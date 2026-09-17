import type { RequestColumn } from './columns.ts'
import type { IclRequest, SortState } from './types.ts'

export function pad2(value: number): string {
  return `0${value}`.slice(-2)
}

/** Thousands-separated two-decimal amount, as the original's `money()`. */
export function money(value: number): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/** DD-MM-YYYY (or DD-MM-YY, or dotted) -> Date; null when the text is not a real date. */
export function parseDate(text: string): Date | null {
  const match = String(text || '').match(/^(\d{2})[-.](\d{2})[-.](\d{2}|\d{4})$/)
  if (!match) return null
  let year = Number(match[3])
  if (year < 100) year += 2000
  const month = Number(match[2]) - 1
  const day = Number(match[1])
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year) return null
  if (date.getMonth() !== month) return null
  if (date.getDate() !== day) return null
  return date
}

export function formatInputDate(date: Date): string {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`
}

export function calendarIso(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function calendarFromIso(text: string): Date | null {
  const m = String(text || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function sameDate(a: Date | null, b: Date | null): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function inDateRange(value: string, from: string, to: string): boolean {
  const current = parseDate(value)
  const fromDate = from ? parseDate(from) : null
  const toDate = to ? parseDate(to) : null
  if (!current) return false
  if (fromDate && current < fromDate) return false
  if (toDate && current > toDate) return false
  return true
}

export type RequestFilters = {
  uptoRequestDate: string
  requestType: string
  requestNo: string
  startDate: string
}

/**
 * The original's `getFilteredRows`. An unparseable Upto Request Date yields no rows at all,
 * which is what keeps the results area empty until a date has been entered.
 */
export function filterRequests(
  requests: readonly IclRequest[],
  filters: RequestFilters,
): IclRequest[] {
  const upTo = parseDate(filters.uptoRequestDate)
  if (!upTo) return []
  const requestNo = filters.requestNo.toLowerCase()
  return requests.filter((row) => {
    const requestDate = parseDate(row.requestDate)
    if (!requestDate || requestDate > upTo) return false
    const rowType = String(row.requestType || 'Pending')
    // "Pending" lists every pending-type row, approved ones included; "Issued" narrows to
    // rows that have actually been issued or approved.
    if (filters.requestType === 'Pending' && rowType !== 'Pending') return false
    if (filters.requestType === 'Issued' && rowType !== 'Issued' && row.statusCode !== 'APPROVED') {
      return false
    }
    if (requestNo && String(row.requestNo || '').toLowerCase().indexOf(requestNo) < 0) return false
    if (filters.startDate && !inDateRange(row.startDate, filters.startDate, filters.startDate)) {
      return false
    }
    return true
  })
}

function sortValue(row: IclRequest, column: RequestColumn): number | string {
  const value = row[column.key]
  if (column.number) return Number(value || 0)
  if (column.key === 'requestDate' || column.key === 'startDate' || column.key === 'endDate') {
    const date = parseDate(String(value))
    return date ? date.getTime() : 0
  }
  return String(value ?? '').toLowerCase()
}

export function sortRequests(
  rows: IclRequest[],
  sort: SortState,
  columns: readonly RequestColumn[],
): IclRequest[] {
  const column = columns[sort.index]
  if (sort.index < 0 || !sort.direction || !column) return rows
  return [...rows].sort((a, b) => {
    const av = sortValue(a, column)
    const bv = sortValue(b, column)
    if (av < bv) return sort.direction === 'asc' ? -1 : 1
    if (av > bv) return sort.direction === 'asc' ? 1 : -1
    return 0
  })
}

/** The class the original's `statusHtml` picks for the little status glyph. */
export function statusGlyph(status: string): { className: string; title: string } {
  if (status === 'APPROVED') return { className: 'status-symbol status-approved', title: 'Approved' }
  if (status === 'REJECTED') return { className: 'status-symbol status-rejected', title: 'Rejected' }
  return { className: 'status-symbol status-pending', title: 'Pending' }
}
