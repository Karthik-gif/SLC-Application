import type { LcColumn, LcRow, SortDirection } from './types.ts'

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function money(value: number): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/** The page speaks DD-MM-YYYY everywhere, in the field and in the data. */
export function parseDate(text: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text)
  if (!match) return null
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
}

export function formatDate(date: Date): string {
  const day = `0${date.getDate()}`.slice(-2)
  const month = `0${date.getMonth() + 1}`.slice(-2)
  return `${day}-${month}-${date.getFullYear()}`
}

export function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** A date column sorts chronologically, a number column numerically, everything else as text. */
export function sortRows(rows: LcRow[], column: LcColumn, direction: SortDirection): LcRow[] {
  const rank = (row: LcRow): number | string => {
    const value = row[column.key]
    if (column.number) return Number(value || 0)
    if (column.date) return parseDate(String(value))?.getTime() ?? 0
    return String(value ?? '').toLowerCase()
  }
  return [...rows].sort((a, b) => {
    const av = rank(a)
    const bv = rank(b)
    if (av < bv) return direction === 'asc' ? -1 : 1
    if (av > bv) return direction === 'asc' ? 1 : -1
    return 0
  })
}
