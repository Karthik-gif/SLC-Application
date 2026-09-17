import { parseDate } from './format.ts'
import type { PrepaymentColumn, PrepaymentRecord, PrepaymentStatus } from './types.ts'

export type SortState = { index: number; direction: 'asc' | 'desc' }

export type RowFilter = {
  companyCode: string
  transaction: string
  settled: boolean
  keyDate: Date | null
}

/** The Company Code list is derived from the records, as the original derives it. */
export function uniqueCompanies(
  records: readonly PrepaymentRecord[],
): { code: string; name: string }[] {
  const seen = new Set<string>()
  const list: { code: string; name: string }[] = []
  for (const row of records) {
    if (seen.has(row.companyCode)) continue
    seen.add(row.companyCode)
    list.push({ code: row.companyCode, name: row.companyName })
  }
  return list
}

export function settledForStatus(statuses: readonly PrepaymentStatus[], code: string): boolean {
  return statuses.find((status) => status.code === code)?.settled ?? false
}

/** A row is in scope when the key date falls inside its start/end window. */
function matchesKeyDate(row: PrepaymentRecord, keyDate: Date | null): boolean {
  if (!keyDate) return true
  const start = parseDate(row.startDate)
  const end = parseDate(row.endDate)
  if (start && keyDate < start) return false
  if (end && keyDate > end) return false
  return true
}

export function filterRows(
  records: readonly PrepaymentRecord[],
  filter: RowFilter,
): PrepaymentRecord[] {
  const typed = filter.transaction.toLowerCase()
  return records.filter((row) => {
    if (filter.companyCode && row.companyCode !== filter.companyCode) return false
    if (typed && !row.transaction.toLowerCase().includes(typed)) return false
    if (row.settled !== filter.settled) return false
    return matchesKeyDate(row, filter.keyDate)
  })
}

export function sortRows(
  rows: PrepaymentRecord[],
  columns: readonly PrepaymentColumn[],
  sort: SortState,
): PrepaymentRecord[] {
  const column = columns[sort.index]
  if (!column) return rows
  const factor = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const left = a[column.key]
    const right = b[column.key]
    if (column.type === 'number') {
      return (Number(left || 0) - Number(right || 0)) * factor
    }
    if (column.type === 'date') {
      const at = parseDate(String(left))?.getTime() ?? 0
      const bt = parseDate(String(right))?.getTime() ?? 0
      return (at - bt) * factor
    }
    const at = String(left ?? '').toLowerCase()
    const bt = String(right ?? '').toLowerCase()
    if (at < bt) return -1 * factor
    if (at > bt) return 1 * factor
    return 0
  })
}
