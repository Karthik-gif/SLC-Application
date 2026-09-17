/**
 * Date conversion for the Manage TF tabs.
 *
 * The original renders every date as a free text field in DD-MM-YYYY with a calendar button
 * beside it, while TrdFlow stores and accepts ISO. These two functions are the only place
 * that gap is bridged; the draft row always holds ISO, so a save never has to guess which
 * format it is looking at.
 */

const ISO = /^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/
const DISPLAY = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

/**
 * True when y-m-d name a day that exists. Date rolls 31 April over into 1 May rather than
 * failing, so the only reliable check is to build the date and read the parts back.
 */
function isRealDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

/**
 * ISO to the DD-MM-YYYY the original displays. A value that is not ISO is returned as it
 * came: blanking it would hide data the backend actually sent.
 */
export function toDisplayDate(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const match = ISO.exec(value)
  if (!match) return value
  return `${match[3]}-${match[2]}-${match[1]}`
}

/**
 * DD-MM-YYYY to ISO. Returns '' for a cleared field — a valid edit meaning "no date" — and
 * null when the text is incomplete or names a day that does not exist, which the caller
 * treats as "keep typing" rather than writing a wrong value into the draft.
 */
export function toIsoDate(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value.trim() === '') return ''
  const match = DISPLAY.exec(value.trim())
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  if (!isRealDate(year, month, day)) return null
  return `${year}-${pad2(month)}-${pad2(day)}`
}

/** Whether the text is finished enough to push into the draft. */
export function isCompleteDisplayDate(value: string): boolean {
  return toIsoDate(value) !== null
}

/**
 * Inserts the separators as digits are typed, so "05092026" becomes "05-09-2026". Ported
 * from the original's formatDateDigits, which is what makes its date fields feel the way
 * they do; without it a user has to type the dashes.
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
