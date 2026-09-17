import type { Cashflow, ComboKind, IrsColumn, IrsRecord, SortDirection } from './types.ts'

/** Thousands-separated, always two decimals — the original's `money()`. */
export function money(value: number | string): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/** Parses DD-MM-YYYY, rejecting values the calendar rolled over (31-02-2026 and friends). */
export function parseDate(text: string): Date | null {
  const match = String(text || '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year) return null
  if (date.getMonth() !== month - 1) return null
  if (date.getDate() !== day) return null
  return date
}

export function formatDate(date: Date): string {
  const day = `0${date.getDate()}`.slice(-2)
  const month = `0${date.getMonth() + 1}`.slice(-2)
  return `${day}-${month}-${date.getFullYear()}`
}

export function isValidDate(text: string): boolean {
  return parseDate(text) !== null
}

export function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Adds whole months, clamping to the target month's last day. */
export function shiftDate(text: string, months: number): string {
  const date = parseDate(text)
  if (!date) return text
  const day = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() + months)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  date.setDate(Math.min(day, last))
  return formatDate(date)
}

/** "0660013455 - BANCO CONTINENTAL" -> "BANCO CONTINENTAL". */
export function bankDisplayName(value: string): string {
  const text = String(value || '')
  const pos = text.indexOf(' - ')
  return pos >= 0 ? text.substring(pos + 3) : text
}

export function rateNumber(value: string): number {
  const number = parseFloat(String(value || '').replace('%', ''))
  return isNaN(number) ? 0 : number
}

export function signedMoney(value: number): string {
  return (value >= 0 ? '+' : '-') + money(Math.abs(value))
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/** Returns a sorted copy; the original sorted the filtered array in place. */
export function sortRows(
  rows: readonly IrsRecord[],
  column: IrsColumn,
  direction: SortDirection,
): IrsRecord[] {
  const key = (row: IrsRecord): number | string | null => {
    const value = row[column.key]
    if (column.type === 'number') return Number(value || 0)
    if (column.type === 'date') {
      const parsed = parseDate(String(value))
      return parsed ? parsed.getTime() : null
    }
    return String(value ?? '').toLowerCase()
  }
  return [...rows].sort((a, b) => {
    const av = key(a)
    const bv = key(b)
    if (av === null || bv === null) return 0
    if (av < bv) return direction === 'asc' ? -1 : 1
    if (av > bv) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/** True when the row's validity window covers `keyDate`, or there is no key date yet. */
export function rowMatchesKeyDate(row: IrsRecord, keyDate: Date | null): boolean {
  if (!keyDate) return true
  const start = parseDate(row.startDate)
  const end = parseDate(row.endDate)
  if (start && keyDate < start) return false
  if (end && keyDate > end) return false
  return true
}

export type IrsFilters = {
  companyCode: string
  transaction: string
  deal: string
  settled: boolean
  keyDate: string
}

/** The IRS Contracts grid, matching the original's `getFilteredRows`, before sorting. */
export function filterRows(rows: readonly IrsRecord[], filters: IrsFilters): IrsRecord[] {
  const transaction = filters.transaction.toLowerCase()
  const deal = filters.deal.toLowerCase()
  const keyDate = parseDate(filters.keyDate)
  return rows.filter((row) => {
    if (filters.companyCode && row.companyCode !== filters.companyCode) return false
    if (transaction && !String(row.transaction).toLowerCase().includes(transaction)) return false
    if (deal && !String(row.dealNo).toLowerCase().includes(deal)) return false
    if (row.settled !== filters.settled) return false
    if (!rowMatchesKeyDate(row, keyDate)) return false
    return true
  })
}

/** The Transaction No / Deal ID combo's suggestion list: unique, filtered, typed-matched. */
export function buildComboOptions(
  rows: readonly IrsRecord[],
  kind: ComboKind,
  filters: Omit<IrsFilters, 'transaction' | 'deal'>,
  typed: string,
): string[] {
  const key = kind === 'txn' ? 'transaction' : 'dealNo'
  const keyDate = parseDate(filters.keyDate)
  const lowerTyped = typed.toLowerCase()
  const seen = new Set<string>()
  const values: string[] = []
  for (const row of rows) {
    if (filters.companyCode && row.companyCode !== filters.companyCode) continue
    if (row.settled !== filters.settled) continue
    if (!rowMatchesKeyDate(row, keyDate)) continue
    const value = String(row[key])
    if (lowerTyped && !value.toLowerCase().includes(lowerTyped)) continue
    if (seen.has(value)) continue
    seen.add(value)
    values.push(value)
  }
  return values
}

/**
 * The seven cashflow lines the modal shows: principal in, five monthly interest legs, then
 * principal out. Entirely client-side arithmetic in the original — no service behind it.
 */
export function buildCashflows(row: IrsRecord): Cashflow[] {
  const principal = Number(row.incomingAmount || 0)
  const outPrincipal = Number(row.outgoingAmount || 0)
  const rate = rateNumber(row.outgoingInterestRate)
  const interest = Math.max(1, (principal * (rate / 100)) / 12)
  const outInterest = Math.max(1, (outPrincipal * (rate / 100)) / 12)
  const flows: Cashflow[] = [
    {
      date: row.startDate,
      description: 'Principal',
      disc: principal,
      incoming: principal,
      outgoing: -outPrincipal,
      fixDate: row.startDate,
      percentage: '0.0000',
      status: 'Fixed',
    },
  ]
  for (let i = 1; i <= 5; i++) {
    flows.push({
      date: shiftDate(row.startDate, i),
      description: 'IRS Interest',
      disc: -interest,
      incoming: interest,
      outgoing: -outInterest,
      fixDate: shiftDate(row.startDate, i),
      percentage: rate.toFixed(4),
      status: 'Not fixed',
    })
  }
  flows.push({
    date: row.endDate,
    description: 'Principal',
    disc: -principal,
    incoming: principal,
    outgoing: -outPrincipal,
    fixDate: row.endDate,
    percentage: '100.0000',
    status: 'Fixed',
  })
  return flows
}
