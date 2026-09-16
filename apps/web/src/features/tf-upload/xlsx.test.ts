import { deepStrictEqual, ok, rejects, strictEqual, throws } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { columnIndexFromRef, extractZipText, findEocd, readZipEntries, validateHeaders } from './xlsx.ts'

/**
 * These exercise the ZIP half of the reader against archives built here byte by byte. The
 * XML half (parseSharedStrings / parseSheetRows / readCellValue) needs DOMParser, which is a
 * browser API with no equivalent under node:test, so it is covered by driving the real app in
 * a browser instead.
 */

type Entry = { name: string; data: Uint8Array; method: number; original: number }

async function deflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  // Copied into a fresh array: TextEncoder returns Uint8Array<ArrayBufferLike>, whose buffer
  // may be a SharedArrayBuffer as far as the types are concerned, and that is not a BlobPart.
  const copy = new Uint8Array(bytes)
  const stream = new Blob([copy]).stream().pipeThrough(new CompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** Builds a ZIP with local headers, a central directory and an EOCD, optionally with a comment. */
function buildZip(entries: Entry[], comment = ''): ArrayBuffer {
  const encoder = new TextEncoder()
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name)

    const local = new Uint8Array(30 + nameBytes.length + entry.data.length)
    const localView = new DataView(local.buffer)
    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(8, entry.method, true)
    localView.setUint32(18, entry.data.length, true)
    localView.setUint32(22, entry.original, true)
    localView.setUint16(26, nameBytes.length, true)
    localView.setUint16(28, 0, true)
    local.set(nameBytes, 30)
    local.set(entry.data, 30 + nameBytes.length)
    locals.push(local)

    const central = new Uint8Array(46 + nameBytes.length)
    const centralView = new DataView(central.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(10, entry.method, true)
    centralView.setUint32(20, entry.data.length, true)
    centralView.setUint32(24, entry.original, true)
    centralView.setUint16(28, nameBytes.length, true)
    centralView.setUint32(42, offset, true)
    central.set(nameBytes, 46)
    centrals.push(central)

    offset += local.length
  }

  const centralSize = centrals.reduce((sum, c) => sum + c.length, 0)
  const commentBytes = encoder.encode(comment)
  const eocd = new Uint8Array(22 + commentBytes.length)
  const eocdView = new DataView(eocd.buffer)
  eocdView.setUint32(0, 0x06054b50, true)
  eocdView.setUint16(8, entries.length, true)
  eocdView.setUint16(10, entries.length, true)
  eocdView.setUint32(12, centralSize, true)
  eocdView.setUint32(16, offset, true)
  eocdView.setUint16(20, commentBytes.length, true)
  eocd.set(commentBytes, 22)

  const total = offset + centralSize + eocd.length
  const out = new Uint8Array(total)
  let pos = 0
  for (const part of [...locals, ...centrals, eocd]) {
    out.set(part, pos)
    pos += part.length
  }
  return out.buffer
}

const encoder = new TextEncoder()
const stored = (name: string, text: string): Entry => {
  const data = encoder.encode(text)
  return { name, data, method: 0, original: data.length }
}

describe('findEocd', () => {
  it('finds the record at the very end', () => {
    const buffer = buildZip([stored('a.xml', '<x/>')])
    ok(findEocd(new DataView(buffer)) > 0)
  })

  it('still finds it behind a ZIP comment', () => {
    // The whole point of scanning backwards rather than reading the last 22 bytes.
    const buffer = buildZip([stored('a.xml', '<x/>')], 'a trailing comment')
    ok(findEocd(new DataView(buffer)) > 0)
  })

  it('is -1 when there is no record', () => {
    strictEqual(findEocd(new DataView(new Uint8Array(100).buffer)), -1)
  })
})

describe('readZipEntries', () => {
  it('indexes every entry by name', () => {
    const buffer = buildZip([stored('xl/sharedStrings.xml', '<sst/>'), stored('xl/worksheets/sheet1.xml', '<w/>')])
    const entries = readZipEntries(buffer)
    deepStrictEqual(Object.keys(entries).sort(), ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml'])
  })

  it('rejects something that is not an archive', () => {
    throws(() => readZipEntries(new Uint8Array(50).buffer), /Invalid Excel archive/)
  })
})

describe('extractZipText', () => {
  it('reads a stored entry', async () => {
    const buffer = buildZip([stored('xl/worksheets/sheet1.xml', '<worksheet>hello</worksheet>')])
    const entries = readZipEntries(buffer)
    strictEqual(await extractZipText(buffer, entries, 'xl/worksheets/sheet1.xml'), '<worksheet>hello</worksheet>')
  })

  it('inflates a deflated entry', async () => {
    const text = '<sst><si><t>Trade Flow ID</t></si></sst>'.repeat(20)
    const raw = encoder.encode(text)
    const buffer = buildZip([
      { name: 'xl/sharedStrings.xml', data: await deflateRaw(raw), method: 8, original: raw.length },
    ])
    const entries = readZipEntries(buffer)
    strictEqual(await extractZipText(buffer, entries, 'xl/sharedStrings.xml'), text)
  })

  it('reads the second entry correctly, so the offset arithmetic is right', async () => {
    // A single-entry archive would pass even with a broken localOffset, since it is 0.
    const buffer = buildZip([stored('first.xml', '<first/>'), stored('xl/worksheets/sheet1.xml', '<second/>')])
    const entries = readZipEntries(buffer)
    strictEqual(await extractZipText(buffer, entries, 'xl/worksheets/sheet1.xml'), '<second/>')
  })

  it('handles multi-byte characters without truncating them', async () => {
    const text = '<t>Côte d’Ivoire — 中文</t>'
    const buffer = buildZip([stored('a.xml', text)])
    strictEqual(await extractZipText(buffer, readZipEntries(buffer), 'a.xml'), text)
  })

  it('returns "" for a part that is absent — sharedStrings.xml is optional', async () => {
    const buffer = buildZip([stored('a.xml', '<a/>')])
    strictEqual(await extractZipText(buffer, readZipEntries(buffer), 'xl/sharedStrings.xml'), '')
  })

  it('refuses a compression method it does not implement', async () => {
    const buffer = buildZip([{ name: 'a.xml', data: encoder.encode('x'), method: 12, original: 1 }])
    await rejects(
      () => extractZipText(buffer, readZipEntries(buffer), 'a.xml'),
      /Unsupported Excel compression method/,
    )
  })
})

describe('columnIndexFromRef', () => {
  it('decodes single and multi-letter columns', () => {
    strictEqual(columnIndexFromRef('A1'), 0)
    strictEqual(columnIndexFromRef('C7'), 2)
    strictEqual(columnIndexFromRef('Z1'), 25)
    strictEqual(columnIndexFromRef('AA1'), 26)
    // The template has 45 columns, so AS is the last one.
    strictEqual(columnIndexFromRef('AS1'), 44)
  })

  it('is -1 for a reference with no column letters', () => {
    strictEqual(columnIndexFromRef('123'), -1)
    strictEqual(columnIndexFromRef(''), -1)
    strictEqual(columnIndexFromRef(null), -1)
  })
})

describe('validateHeaders', () => {
  const expected = ['Trade Flow ID', 'TF Split ID', 'Quantity']

  it('accepts an exact match', () => {
    strictEqual(validateHeaders(['Trade Flow ID', 'TF Split ID', 'Quantity'], expected), null)
  })

  it('tolerates surrounding whitespace', () => {
    strictEqual(validateHeaders([' Trade Flow ID ', 'TF Split ID', 'Quantity '], expected), null)
  })

  it('reports a count mismatch with both numbers', () => {
    const message = validateHeaders(['Trade Flow ID'], expected)
    ok(message?.includes('Expected 3 columns but found 1'), message ?? '')
  })

  it('names the offending column when one is wrong', () => {
    const message = validateHeaders(['Trade Flow ID', 'Wrong', 'Quantity'], expected)
    ok(message?.includes('Column 2'), message ?? '')
    ok(message?.includes('TF Split ID'), message ?? '')
  })

  it('catches columns in the wrong order', () => {
    ok(validateHeaders(['TF Split ID', 'Trade Flow ID', 'Quantity'], expected) !== null)
  })
})
