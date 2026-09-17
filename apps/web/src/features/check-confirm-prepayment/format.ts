/** Date and amount helpers, exactly as the legacy page computed them. */

/** Parses DD-MM-YYYY. Returns null unless every part round-trips, so 31-02-2026 is rejected. */
export function parseDate(text: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text ?? '')
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

/** Two decimals with thousands separators. */
export function money(value: number): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
