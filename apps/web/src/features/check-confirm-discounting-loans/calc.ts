/** The date, money and interest arithmetic the legacy page did inline, unchanged. */

/** Every number the loan maths needs; the edit modal recalculates from these alone. */
export type InterestInputs = {
  discountValue: number
  refInterestRate: number
  spreadRate: number
  noOfDays: number
}

export function money(value: number): string {
  const parts = (Number(value) || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function rateFmt(value: number): string {
  return (Number(value) || 0).toFixed(4)
}

/** Strips the thousands separators the money cells display before parsing. */
export function parseMoney(text: string): number {
  return Number(text.replace(/,/g, '')) || 0
}

function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n
}

export function parseDMY(text: string): Date | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text)
  if (!m) return null
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
}

export function formatDMY(date: Date): string {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`
}

export function addDaysDMY(text: string, days: number): string {
  const date = parseDMY(text)
  if (!date) return text
  date.setDate(date.getDate() + (Number(days) || 0))
  return formatDMY(date)
}

/** The native date picker speaks ISO; the text field beside it speaks DD-MM-YYYY. */
export function isoToDMY(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[3]}-${m[2]}-${m[1]}`
}

export function calcInterestRate(r: InterestInputs): number {
  return (Number(r.refInterestRate) || 0) + (Number(r.spreadRate) || 0)
}

export function calcInterestDue(r: InterestInputs): number {
  const rate = calcInterestRate(r)
  const days = Number(r.noOfDays) || 0
  const value = Number(r.discountValue) || 0
  return (value * rate * days) / 36000
}

export function calcNetDiscounted(r: InterestInputs): number {
  return (Number(r.discountValue) || 0) - calcInterestDue(r)
}

export function statusBadgeClass(status: string): string {
  if (status === 'Contract Settlement') return 'badge badge-closed'
  return 'badge badge-open'
}
