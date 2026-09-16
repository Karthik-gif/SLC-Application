/**
 * A minimal .xlsx reader, ported from legacy/Uplaod TF.html.
 *
 * An .xlsx is a ZIP of XML parts. This walks the ZIP's central directory, inflates the two
 * parts that matter (sharedStrings.xml and the first worksheet) with the browser's own
 * DecompressionStream, and reads the cells out of the XML. No third-party library is used —
 * the legacy console had none, and adding one would change nothing except the bundle size.
 *
 * Only what a template workbook actually contains is supported: stored (method 0) and
 * deflated (method 8) entries, and the cell types Excel emits for the template's columns.
 */

export type CellValue = string | number

type ZipEntry = {
  method: number
  compSize: number
  uncompSize: number
  localOffset: number
}

const EOCD_SIGNATURE = 0x06054b50
const CENTRAL_SIGNATURE = 0x02014b50
const LOCAL_SIGNATURE = 0x04034b50

/**
 * Finds the End Of Central Directory record. It sits at the end of the file, but a ZIP
 * comment can follow it, so the last 65,557 bytes (max comment + header) are scanned
 * backwards.
 */
export function findEocd(view: DataView): number {
  const start = Math.max(0, view.byteLength - 65557)
  for (let pos = view.byteLength - 22; pos >= start; pos--) {
    if (view.getUint32(pos, true) === EOCD_SIGNATURE) return pos
  }
  return -1
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8').decode(bytes)
}

export function readZipEntries(buffer: ArrayBuffer): Record<string, ZipEntry> {
  const view = new DataView(buffer)
  const eocd = findEocd(view)
  if (eocd < 0) throw new Error('Invalid Excel archive.')

  const count = view.getUint16(eocd + 10, true)
  let pos = view.getUint32(eocd + 16, true)
  const entries: Record<string, ZipEntry> = {}

  for (let i = 0; i < count; i++) {
    if (view.getUint32(pos, true) !== CENTRAL_SIGNATURE) break
    const nameLen = view.getUint16(pos + 28, true)
    const extraLen = view.getUint16(pos + 30, true)
    const commentLen = view.getUint16(pos + 32, true)
    const name = decodeUtf8(new Uint8Array(buffer, pos + 46, nameLen))
    entries[name] = {
      method: view.getUint16(pos + 10, true),
      compSize: view.getUint32(pos + 20, true),
      uncompSize: view.getUint32(pos + 24, true),
      localOffset: view.getUint32(pos + 42, true),
    }
    pos += 46 + nameLen + extraLen + commentLen
  }
  return entries
}

/** Returns '' for a part that is not in the archive — sharedStrings.xml is optional. */
export async function extractZipText(
  buffer: ArrayBuffer,
  entries: Record<string, ZipEntry>,
  name: string,
): Promise<string> {
  const entry = entries[name]
  if (!entry) return ''

  const view = new DataView(buffer)
  const pos = entry.localOffset
  if (view.getUint32(pos, true) !== LOCAL_SIGNATURE) throw new Error('Invalid Excel file entry.')

  // The local header repeats the name and extra fields with its OWN lengths, which can differ
  // from the central directory's, so the data offset must be computed from this header.
  const nameLen = view.getUint16(pos + 26, true)
  const extraLen = view.getUint16(pos + 28, true)
  const dataStart = pos + 30 + nameLen + extraLen
  const compressed = new Uint8Array(buffer, dataStart, entry.compSize)

  if (entry.method === 0) return decodeUtf8(compressed)
  if (entry.method !== 8) throw new Error('Unsupported Excel compression method.')
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read Excel files locally. Use a current browser.')
  }

  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return decodeUtf8(new Uint8Array(await new Response(stream).arrayBuffer()))
}

function nodeText(node: Element | null | undefined): string {
  return node?.textContent ?? ''
}

/** The workbook's shared string table; `t` nodes are concatenated to flatten rich text runs. */
export function parseSharedStrings(xmlText: string): string[] {
  if (!xmlText) return []
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
  const items = doc.getElementsByTagName('si')
  const out: string[] = []
  for (let i = 0; i < items.length; i++) {
    const tNodes = items[i]!.getElementsByTagName('t')
    let text = ''
    for (let j = 0; j < tNodes.length; j++) text += nodeText(tNodes[j])
    out.push(text)
  }
  return out
}

/** "C" -> 2, "AA" -> 26. Returns -1 for a reference with no column letters. */
export function columnIndexFromRef(ref: string | null): number {
  const letters = String(ref ?? '').match(/^[A-Z]+/i)
  if (!letters) return -1
  const text = letters[0].toUpperCase()
  let index = 0
  for (let i = 0; i < text.length; i++) index = index * 26 + text.charCodeAt(i) - 64
  return index - 1
}

export function readCellValue(cell: Element, shared: readonly string[]): CellValue {
  const type = cell.getAttribute('t') ?? ''

  if (type === 'inlineStr') {
    const nodes = cell.getElementsByTagName('t')
    let text = ''
    for (let k = 0; k < nodes.length; k++) text += nodeText(nodes[k])
    return text
  }

  const raw = nodeText(cell.getElementsByTagName('v')[0])
  if (type === 's') return shared[Number(raw)] ?? ''
  if (type === 'b') return raw === '1' ? 'TRUE' : 'FALSE'
  if (type === 'str' || type === 'e') return raw
  if (raw === '') return ''

  // Unmarked cells are numeric in Excel; anything that will not parse is kept as text so a
  // malformed cell is shown rather than silently becoming NaN.
  const numeric = Number(raw)
  return Number.isFinite(numeric) ? numeric : raw
}

/**
 * Rows as fixed-width arrays of `columnCount`. Cells carry their own column reference, so a
 * sparse row (Excel omits empty cells) still lands in the right positions. A row where every
 * cell is empty is dropped.
 */
export function parseSheetRows(xmlText: string, shared: readonly string[], columnCount: number): CellValue[][] {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
  const rowNodes = doc.getElementsByTagName('row')
  const allRows: CellValue[][] = []

  for (let i = 0; i < rowNodes.length; i++) {
    const cells = rowNodes[i]!.getElementsByTagName('c')
    const row: CellValue[] = new Array<CellValue>(columnCount).fill('')
    let hasValue = false

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j]!
      const index = columnIndexFromRef(cell.getAttribute('r'))
      if (index < 0 || index >= columnCount) continue
      const value = readCellValue(cell, shared)
      row[index] = value
      if (value !== '') hasValue = true
    }

    if (hasValue) allRows.push(row)
  }
  return allRows
}

export function normalizeHeader(value: unknown): string {
  return String(value ?? '').trim()
}

/** The workbook must match the template exactly, in count and in order. */
export function validateHeaders(actual: readonly CellValue[], expected: readonly string[]): string | null {
  if (actual.length !== expected.length) {
    return `Column count mismatch. Expected ${expected.length} columns but found ${actual.length}.`
  }
  for (let i = 0; i < expected.length; i++) {
    if (normalizeHeader(actual[i]) !== normalizeHeader(expected[i])) {
      return `Column ${i + 1} should be "${expected[i]}" but the file has "${normalizeHeader(actual[i])}".`
    }
  }
  return null
}

export type ParsedWorkbook = { headers: CellValue[]; rows: CellValue[][] }

export async function parseExcelFile(file: File, expectedHeaders: readonly string[]): Promise<ParsedWorkbook> {
  const buffer = await file.arrayBuffer()
  const entries = readZipEntries(buffer)
  const sharedText = await extractZipText(buffer, entries, 'xl/sharedStrings.xml')
  const sheetText = await extractZipText(buffer, entries, 'xl/worksheets/sheet1.xml')
  if (!sheetText) throw new Error('The first worksheet could not be read.')

  const shared = parseSharedStrings(sharedText)
  const allRows = parseSheetRows(sheetText, shared, expectedHeaders.length)
  if (!allRows.length) throw new Error('The workbook does not contain a header row.')

  const headers = allRows[0]!.slice(0, expectedHeaders.length)
  const error = validateHeaders(headers, expectedHeaders)
  if (error) throw new Error(error)

  const rows = allRows.slice(1).filter((row) => row.some((value) => value !== ''))
  return { headers, rows }
}
