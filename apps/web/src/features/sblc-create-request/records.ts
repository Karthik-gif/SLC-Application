import { REQUEST_NUMBER, REQUEST_TYPES, SBLC_TRANSACTION } from './data.ts'
import { parseAmountValue, parseDate } from './format.ts'
import type {
  FilterKey,
  Filters,
  RequestDraft,
  RequestVariant,
  SblcColumn,
  SblcRecord,
  SortState,
} from './types.ts'

export const EMPTY_FILTERS: Filters = { ottkNo: '', entityId: '', dealId: '', ottkStatDesc: '' }

/**
 * The original patched the model on load rather than shipping it complete: records without
 * an SBLC transaction number get one off the series, and a blank SBLC amount falls back to
 * the proposed one. Done once here so nothing downstream has to cope with the blanks.
 */
export function applyDisplayDefaults(records: readonly SblcRecord[]): SblcRecord[] {
  return records.map((record) => {
    const sblcTxn =
      record.sblcTxn || !SBLC_TRANSACTION.start
        ? record.sblcTxn
        : String(SBLC_TRANSACTION.start + (record.id - 1) * SBLC_TRANSACTION.step)
    const sblcAmt =
      record.sblcAmt === '' || record.sblcAmt === null ? record.proposedSblcAmt : record.sblcAmt
    return { ...record, sblcTxn, sblcAmt }
  })
}

export function structureOptions(records: readonly SblcRecord[]): string[] {
  const seen = new Set<string>()
  for (const record of records) if (record.tsfStructure) seen.add(record.tsfStructure)
  return [...seen].sort()
}

/** Distinct values of one filter column, narrowed by the chosen structure and what is typed. */
export function comboValues(
  records: readonly SblcRecord[],
  structure: string,
  key: FilterKey,
  typed: string,
): string[] {
  const needle = typed.toLowerCase()
  const seen = new Set<string>()
  for (const record of records) {
    if (structure && record.tsfStructure !== structure) continue
    const value = String(record[key] || '')
    if (!value) continue
    if (needle && value.toLowerCase().indexOf(needle) < 0) continue
    seen.add(value)
  }
  return [...seen]
}

export function filterRecords(
  records: readonly SblcRecord[],
  structure: string,
  filters: Filters,
): SblcRecord[] {
  const keys = Object.keys(filters) as FilterKey[]
  return records.filter((record) => {
    if (structure && record.tsfStructure !== structure) return false
    return keys.every((key) => {
      const needle = filters[key].toLowerCase()
      if (!needle) return true
      return String(record[key]).toLowerCase().indexOf(needle) >= 0
    })
  })
}

export function sortRecords(
  rows: readonly SblcRecord[],
  column: SblcColumn,
  direction: SortState['direction'],
): SblcRecord[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    if (column.type === 'number') {
      return (Number(a[column.key] || 0) - Number(b[column.key] || 0)) * sign
    }
    const av = String(a[column.key] || '').toLowerCase()
    const bv = String(b[column.key] || '').toLowerCase()
    if (av < bv) return -sign
    if (av > bv) return sign
    return 0
  })
}

export function recordHasRequest(record: SblcRecord | undefined): boolean {
  return !!record?.requestNo
}

function draftFrom(source: Partial<RequestVariant>, id: string): RequestDraft {
  return {
    id,
    startDate: source.startDate || '',
    endDate: source.endDate || '',
    expEndDate: source.expEndDate || '',
    amount: source.amount == null ? '' : source.amount,
    requestType: source.requestType || REQUEST_TYPES[0] || '',
    companyCode: source.companyCode || '',
    beneficiary: source.beneficiary || '',
    beneficiaryName: source.beneficiaryName || '',
    requestNo: source.requestNo || '',
  }
}

/** A blank line, carrying over only the beneficiary the record's first line already names. */
export function newRequestDraft(
  record: SblcRecord,
  drafts: readonly RequestDraft[],
  id: string,
): RequestDraft {
  const source: Partial<RequestVariant> = drafts[0] ?? record.requestRows[0] ?? {}
  return {
    id,
    startDate: '',
    endDate: '',
    expEndDate: '',
    amount: '',
    requestType: REQUEST_TYPES[0] || 'SBLC Treasury',
    companyCode: '',
    beneficiary: source.beneficiary || '',
    beneficiaryName: source.beneficiaryName || '',
    requestNo: '',
  }
}

/**
 * The lines the modal opens on: the record's already-created requests when it has any,
 * otherwise a single blank line. `seq` is the counter new blank lines are numbered from.
 */
export function initialDrafts(record: SblcRecord, seq: number): RequestDraft[] {
  if (!recordHasRequest(record)) {
    return [newRequestDraft(record, [], `N${seq}`)]
  }
  const created = record.requestRows
    .filter((row) => row.requestNo)
    .map((row) => draftFrom(row, row.id))
  if (created.length) return created
  // A record can carry a request number without any of its lines holding one; the original
  // still shows a line for it rather than an empty table.
  const source = record.requestRows[0] ?? {}
  const fallback = draftFrom(source, record.requestRows[0]?.id ?? `N${seq}`)
  return [{ ...fallback, requestNo: record.requestNo || fallback.requestNo }]
}

/** Walks the configured series past every number the model has already handed out. */
export function nextRequestNumber(records: readonly SblcRecord[]): string {
  const used = new Set<string>()
  for (const record of records) {
    if (record.requestNo) used.add(String(record.requestNo))
    for (const row of record.requestRows) {
      if (row.requestNo) used.add(String(row.requestNo))
      for (const variant of row.variants ?? []) {
        if (variant.requestNo) used.add(String(variant.requestNo))
      }
    }
  }
  let candidate = Number(REQUEST_NUMBER.start || 1)
  const step = Number(REQUEST_NUMBER.step || 1)
  while (used.has(String(candidate))) candidate += step
  return String(candidate)
}

export function requiredFieldsMissing(draft: RequestDraft): string[] {
  const missing: string[] = []
  if (!parseDate(draft.startDate)) missing.push('Start Date')
  if (!parseDate(draft.endDate)) missing.push('End Date')
  if (!parseDate(draft.expEndDate)) missing.push('Exp. End Date')
  if (parseAmountValue(draft.amount) === null) missing.push('Amount')
  if (!String(draft.companyCode || '').trim()) missing.push('Co.Code')
  return missing
}

/**
 * Writes a created line back onto the record. The first creation replaces the seed line the
 * record was shipped with; later ones are appended.
 */
export function withCreatedRequest(
  record: SblcRecord,
  draft: RequestDraft,
  requestNo: string,
): SblcRecord {
  const saved = { ...draftFrom(draft, draft.id), requestNo }
  const hasCreated = record.requestRows.some((row) => row.requestNo)
  return {
    ...record,
    requestRows: hasCreated ? [...record.requestRows, saved] : [saved],
    requestNo: record.requestNo || requestNo,
  }
}
