import { money } from './format.ts'
import type { SblcRecord } from './types.ts'

/** The legacy STATUS_TEXT_MAP / STATUS_CODE_MAP / STATUS_CLASS_MAP, unchanged. */
export const STATUS_TEXT_MAP: Readonly<Record<string, string>> = {
  'SBLC Request Created': 'Pending',
  'TSF Approval/SBLC Created': 'Approved',
  'Reject By TSF': 'Rejected',
}

export const STATUS_CODE_MAP: Readonly<Record<string, string>> = {
  'SBLC Request Created': '01',
  'TSF Approval/SBLC Created': '02',
  'Reject By TSF': '03',
}

export const STATUS_CLASS_MAP: Readonly<Record<string, string>> = {
  'SBLC Request Created': 'badge-pending',
  'TSF Approval/SBLC Created': 'badge-approved',
  'Reject By TSF': 'badge-rejected',
}

export type MainColumn = {
  key: string
  label: string
  width: number
  number?: boolean
  statusText?: boolean
  compute?: (r: SblcRecord) => string
}

/** The main list's columns, in the original's order. */
export const MAIN_COLUMNS: readonly MainColumn[] = [
  {
    key: 'status',
    label: 'Status',
    width: 90,
    statusText: true,
    compute: (r) => STATUS_TEXT_MAP[r.sblcRequestStatusDesc] ?? r.sblcRequestStatusDesc,
  },
  {
    key: 'sblcStatusCode',
    label: 'SBLC Status',
    width: 90,
    compute: (r) => STATUS_CODE_MAP[r.sblcRequestStatusDesc] ?? '',
  },
  { key: 'sblcRequestStatusDesc', label: 'SBLC Request Status Description', width: 230 },
  { key: 'dealId', label: 'Deal ID', width: 100 },
  { key: 'sblcRequestNumber', label: 'SBLC Request Number', width: 150 },
  { key: 'ottkNo', label: 'OTTK No', width: 95 },
  { key: 'sblcRequestType', label: 'SBLC Request Type', width: 180 },
  { key: 'beneficiaryCode', label: 'SBLC Beneficiary', width: 120 },
  { key: 'startDate', label: 'Start Date', width: 100 },
  { key: 'endDate', label: 'End Date', width: 100 },
  { key: 'sblcAmount', label: 'SBLC Amount', width: 130, number: true },
  { key: 'companyCode', label: 'Company Code', width: 100 },
  { key: 'companyName', label: 'Company Name', width: 190 },
  { key: 'sblcTransaction', label: 'SBLC Transaction', width: 140 },
]

/** The value shown in one cell for one row, honouring compute/number the way the original did. */
export function columnValue(col: MainColumn, r: SblcRecord): string {
  const raw = col.compute ? col.compute(r) : String((r as unknown as Record<string, unknown>)[col.key] ?? '')
  return col.number ? money(raw) : raw
}

/** Sort comparator matching the legacy sortData: numeric columns compare as numbers, the rest
 * as lowercased strings. */
export function compareRecords(a: SblcRecord, b: SblcRecord, col: MainColumn, direction: 'asc' | 'desc'): number {
  let av: string | number = col.compute ? col.compute(a) : String((a as unknown as Record<string, unknown>)[col.key] ?? '')
  let bv: string | number = col.compute ? col.compute(b) : String((b as unknown as Record<string, unknown>)[col.key] ?? '')
  if (col.number) {
    av = Number(av || 0)
    bv = Number(bv || 0)
  } else {
    av = String(av || '').toLowerCase()
    bv = String(bv || '').toLowerCase()
  }
  if (av < bv) return direction === 'asc' ? -1 : 1
  if (av > bv) return direction === 'asc' ? 1 : -1
  return 0
}

/** The Transaction modal's column headers (plain labels; no key/compute needed). */
export const TRANSACTION_COLUMNS: readonly { label: string; width: number }[] = [
  { label: 'CoCd', width: 55 },
  { label: 'Trans.', width: 95 },
  { label: 'PTyp', width: 55 },
  { label: 'Bank Name', width: 180 },
  { label: 'Term End', width: 90 },
  { label: 'Limit Amount', width: 100 },
  { label: 'Available Limit', width: 100 },
]

/** The DMS modal's column headers. */
export const DMS_COLUMNS: readonly { label: string; width: number }[] = [
  { label: 'Doc Type', width: 80 },
  { label: 'Doc Type Desc', width: 230 },
  { label: 'Doc Date', width: 170 },
  { label: 'File Path', width: 230 },
  { label: 'DMS Code', width: 130 },
  { label: 'Upload', width: 90 },
  { label: 'Download', width: 90 },
  { label: 'Edit', width: 80 },
]
