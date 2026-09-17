/** Date/amount helpers ported from the legacy page's parseDate/formatDate/money functions. */

const DATE_RE = /^(\d{2})[-.](\d{2})[-.](\d{2}|\d{4})$/

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** Parses "DD-MM-YYYY" (or DD.MM.YYYY / two-digit year), rejecting anything that round-trips wrong. */
export function parseDate(text: string | undefined): Date | null {
  const match = String(text ?? '').match(DATE_RE)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  let year = Number(match[3])
  if (year < 100) year += 2000
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

export function formatDate(date: Date): string {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`
}

/** Re-parses and re-formats a raw DD-MM-YYYY string, passing through anything unparsable unchanged. */
export function normalizeDateText(text: string): string {
  const date = parseDate(text)
  return date ? formatDate(date) : text
}

export function money(value: number | string | undefined): string {
  const n = Number(value ?? 0)
  const parts = n.toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function sameDate(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function calendarIso(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function calendarFromIso(text: string): Date | null {
  const match = String(text || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export const CAL_MONTHS = [
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
]

export const CAL_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
