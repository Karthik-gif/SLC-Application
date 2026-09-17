/**
 * Date/number formatting ported from the legacy page's `parseDate`/`formatDate`/`money`.
 * The original accepts DD-MM-YY or DD-MM-YYYY (with `.` as an alternate separator) and
 * always renders back out as DD-MM-YYYY.
 */

export function pad2(value: number): string {
  return ('0' + value).slice(-2)
}

export function parseDate(text: string | null | undefined): Date | null {
  const match = String(text || '').match(/^(\d{2})[-.](\d{2})[-.](\d{2}|\d{4})$/)
  if (!match) return null
  let year = Number(match[3])
  if (year < 100) year += 2000
  const date = new Date(year, Number(match[2]) - 1, Number(match[1]))
  if (date.getFullYear() !== year || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[1])) {
    return null
  }
  return date
}

export function formatDate(date: Date): string {
  return pad2(date.getDate()) + '-' + pad2(date.getMonth() + 1) + '-' + date.getFullYear()
}

/** Reformats a free-typed date to DD-MM-YYYY, leaving it untouched if it does not parse. */
export function normalizeDateText(text: string): string {
  const date = parseDate(text)
  return date ? formatDate(date) : text
}

export function money(value: number | string | null | undefined): string {
  const n = Number(value || 0)
  const parts = n.toFixed(2).split('.')
  const whole = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return [whole, ...parts.slice(1)].join('.')
}

export function sameDate(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function calendarIso(date: Date): string {
  return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
}

export function calendarFromIso(text: string): Date | null {
  const m = String(text || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export const CAL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const CAL_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
