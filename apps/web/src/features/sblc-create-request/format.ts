import { AMOUNT_MULTIPLIERS } from './data.ts'

/** Thousands-separated, two decimals — the original's money() for every numeric cell. */
export function money(value: number | string | null | undefined): string {
  if (value === '' || value === null || value === undefined) return ''
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/** DD-MM-YYYY, rejecting dates the calendar would silently roll over (31-02-2025). */
export function parseDate(text: string | number | null | undefined): Date | null {
  const match = String(text ?? '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match as unknown as [string, string, string, string]
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (date.getFullYear() !== Number(year)) return null
  if (date.getMonth() !== Number(month) - 1) return null
  if (date.getDate() !== Number(day)) return null
  return date
}

export function formatDate(date: Date): string {
  const day = `0${date.getDate()}`.slice(-2)
  const month = `0${date.getMonth() + 1}`.slice(-2)
  return `${day}-${month}-${date.getFullYear()}`
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

export function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Amount shorthand: "2.5M", "800K", "3CR". Returns null for anything that is not a positive
 * number, which is what the modal's validation treats as a missing amount.
 */
export function parseAmountValue(value: number | string | null | undefined): number | null {
  const text = String(value ?? '')
    .replace(/,/g, '')
    .trim()
  const match = text.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(CR|K|L|M|B)?$/i)
  if (!match) return null
  const suffix = String(match[2] ?? '').toUpperCase()
  const multiplier = suffix ? (AMOUNT_MULTIPLIERS[suffix] ?? 0) : 1
  if (!multiplier) return null
  const number = Number(match[1]) * multiplier
  if (!isFinite(number) || number <= 0) return null
  return number
}
