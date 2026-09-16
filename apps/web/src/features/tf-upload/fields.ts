import type { CellValue } from './xlsx.ts'

export type FieldType = 'text' | 'date' | 'number'

/**
 * Column index -> OData field, mapped by each field's real DDIC label (dd04t) rather than its
 * frequently misleading technical name — the table's own ZUNIT column is labelled
 * "Contract Price", and ZCPRICE is actually "CMP (MT)". Confirmed against ZFS_C_TrdFlowTP
 * field by field.
 *
 * Index 0 and 1 (ZtfNo / ZtfSplit) are the entity key: read separately by uploadRow and never
 * sent inside a PATCH body.
 */
export const TF_FIELD_MAP: ReadonlyArray<{ field: string; type: FieldType }> = [
  { field: 'ZtfNo', type: 'text' },
  { field: 'ZtfSplit', type: 'text' },
  { field: 'ZtfDate', type: 'date' },
  { field: 'Zbu', type: 'text' },
  { field: 'Zoprtr', type: 'text' },
  { field: 'ZblVsslName', type: 'text' },
  { field: 'Zcmmd', type: 'text' },
  { field: 'ZconNum1', type: 'text' },
  { field: 'ZpurInc', type: 'text' },
  { field: 'Zpaypur', type: 'text' },
  { field: 'Zbplsb', type: 'text' },
  { field: 'Zbplbb', type: 'text' },
  { field: 'ZconNum2', type: 'text' },
  { field: 'Zsalesinc', type: 'text' },
  { field: 'Zptss', type: 'text' },
  { field: 'Zbslsb', type: 'text' },
  { field: 'Zbslbb', type: 'text' },
  { field: 'Zotfd', type: 'date' },
  { field: 'Zottd', type: 'date' },
  { field: 'Zquantity', type: 'number' },
  { field: 'Zunit', type: 'number' },
  { field: 'Zcprice', type: 'number' },
  { field: 'Zttv', type: 'number' },
  { field: 'Zpol', type: 'text' },
  { field: 'Zpod', type: 'text' },
  { field: 'Zsldate', type: 'date' },
  { field: 'Zblno', type: 'text' },
  { field: 'Zdays', type: 'text' },
  { field: 'ZetaDsPort', type: 'date' },
  { field: 'Zcob', type: 'text' },
  { field: 'Znotify', type: 'text' },
  { field: 'Zlc', type: 'text' },
  { field: 'Zoentity', type: 'text' },
  { field: 'Zsod', type: 'text' },
  { field: 'Zbod', type: 'text' },
  { field: 'Zaobf13', type: 'date' },
  { field: 'Zaobt13', type: 'date' },
  { field: 'Zaobf33', type: 'date' },
  { field: 'Zaobt33', type: 'date' },
  { field: 'Zremark', type: 'text' },
  { field: 'ZblRcpdt', type: 'date' },
  { field: 'ZflwSts', type: 'text' },
  { field: 'ZpolCtry', type: 'text' },
  { field: 'ZpodCtry', type: 'text' },
  { field: 'ZogbsStatId', type: 'text' },
]

/**
 * ZTFTYPE is CHAR(2) and the domain's own fixed values (dd07v) are 01 Container / 02 Bulk,
 * used in preference to the informal codes seen in some live rows.
 */
export const TF_TYPE_CODES: Record<string, string> = { CONTAINER: '01', BULK: '02' }

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

/**
 * Excel serial or ISO text to "YYYY-MM-DD" for the Edm.Date fields, or null when there is
 * nothing usable — a null is skipped rather than sent, so a bad cell never clears a field.
 *
 * The epoch is 1899-12-30, not 1900-01-01: Excel treats 1900 as a leap year, and counting
 * from the 30th absorbs that phantom day.
 */
export function toIsoDate(value: CellValue | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null

  if (typeof value === 'number') {
    const millis = Date.UTC(1899, 11, 30) + Math.round(value * 86400000)
    const d = new Date(millis)
    return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
  }

  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? match[0] : null
}

/**
 * ZtfNo / ZtfSplit are stored zero-padded ("0000000022", "01"), but Excel drops leading
 * zeros, so a plain "22" would address a key that does not exist. Only purely numeric values
 * are padded; anything else passes through untouched.
 */
export function padKey(value: CellValue | null | undefined, length: number): string {
  const text = String(value ?? '').trim()
  return /^\d+$/.test(text) && text.length < length ? text.padStart(length, '0') : text
}

export type CommodityRow = {
  ZcommId?: string
  ZcommDesc?: string
  ZchName1?: string
  ZchName2?: string
}

/** Matched on either commodity name, exactly as ZSGTSF_RTF_UPLOAD's own READ TABLE does. */
export function lookupCommodity(
  zcmmd: unknown,
  rows: readonly CommodityRow[],
): CommodityRow | undefined {
  if (!zcmmd) return undefined
  return rows.find((r) => r.ZchName1 === zcmmd) ?? rows.find((r) => r.ZchName2 === zcmmd)
}

export type BusinessUnit = { code: string; name: string }

/**
 * The request body for one row.
 *
 * Only cells with a value are included, so on UPDATE an empty cell leaves that field
 * untouched on the SAP side rather than clearing it — deliberately safer than
 * ZSGTSF_RTF_UPLOAD's own full-overwrite behaviour.
 *
 * On create the Business Unit name is resolved from the master list by the selected code,
 * ignoring whatever the workbook's own "Business Unit Name" column says; on update that
 * column's text is used as-is. Both match the corresponding branches of that program.
 */
export function buildRowPayload(
  row: readonly CellValue[],
  buCode: string,
  tfTypeCode: string,
  isCreate: boolean,
  businessUnits: readonly BusinessUnit[],
  commodities: readonly CommodityRow[],
): Record<string, string | number> {
  const body: Record<string, string | number> = {}

  for (let i = 2; i < TF_FIELD_MAP.length; i++) {
    const col = TF_FIELD_MAP[i]!
    const raw = row[i]
    if (raw === null || raw === undefined || raw === '') continue

    if (col.type === 'date') {
      const iso = toIsoDate(raw)
      if (iso) body[col.field] = iso
    } else if (col.type === 'number') {
      const num = Number(raw)
      if (Number.isFinite(num)) body[col.field] = num
    } else {
      body[col.field] = String(raw)
    }
  }

  if (buCode) body['ZbuId'] = buCode
  if (tfTypeCode) body['ZtfType'] = tfTypeCode

  if (isCreate && buCode) {
    const unit = businessUnits.find((b) => b.code === buCode)
    if (unit) body['Zbu'] = unit.name
  }

  const commodity = lookupCommodity(body['Zcmmd'], commodities)
  if (commodity) {
    body['ZtrmComId'] = commodity.ZcommId ?? ''
    body['ZtrmComDesc'] = commodity.ZcommDesc ?? ''
    body['ZchName1'] = commodity.ZchName1 ?? ''
    body['ZchName2'] = commodity.ZchName2 ?? ''
  }

  return body
}

/** A blank Trade Flow ID means a genuinely new row; the backend generates the number. */
export function isCreateRow(row: readonly CellValue[]): boolean {
  return !String(row[0] ?? '').trim()
}
