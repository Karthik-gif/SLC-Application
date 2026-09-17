/**
 * Date helpers for this screen. Every date it shows, filters on and sorts by is a
 * DD-MM-YYYY string, so nothing here converts to ISO — there is no backend yet to convert
 * for, and inventing a second representation would only add a place to get it wrong.
 */

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

export type DateParts = {
  year: number
  month: number
  day: number
}

/** DD-MM-YYYY to its calendar parts, or null when the text is not a complete date. */
export function parseDateParts(value: string): DateParts | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value ?? '')
  if (!match) return null
  return { day: Number(match[1]), month: Number(match[2]) - 1, year: Number(match[3]) }
}

/** DD-MM-YYYY to a UTC timestamp for comparing and sorting; null when it does not parse. */
export function parseDateMs(value: string): number | null {
  const parts = parseDateParts(value)
  if (!parts) return null
  const time = Date.UTC(parts.year, parts.month, parts.day)
  return Number.isNaN(time) ? null : time
}

export function formatDateParts(year: number, month: number, day: number): string {
  return `${pad2(day)}-${pad2(month + 1)}-${year}`
}

/**
 * Inserts the separators as digits are typed, so "05012026" becomes "05-01-2026". Ported
 * from the original; without it the user has to type the dashes.
 */
export function formatDateDigits(raw: string): string {
  const digits = String(raw ?? '')
    .replace(/[^\d]/g, '')
    .slice(0, 8)
  const parts: string[] = []
  if (digits.length > 0) parts.push(digits.slice(0, 2))
  if (digits.length > 2) parts.push(digits.slice(2, 4))
  if (digits.length > 4) parts.push(digits.slice(4, 8))
  return parts.join('-')
}
