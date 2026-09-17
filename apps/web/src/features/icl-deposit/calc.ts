import type { IclRecord } from './types.ts'

/** Thousands-separated, always two decimals — the format every amount cell is edited in. */
export function money(value: number | string): string {
  const parts = toNumber(value).toFixed(2).split('.')
  const whole = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${whole}.${parts[1] ?? '00'}`
}

/** Interest rates carry seven decimals, matching the SAP treasury display. */
export function rateFmt(value: number | string): string {
  return toNumber(value).toFixed(7)
}

/**
 * Amount fields are shown grouped ("1,000,000.00"), so a plain Number() of whatever the
 * user last saw returns NaN. Every numeric read goes through here instead.
 */
export function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const n = Number(String(value ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** ISO `YYYY-MM-DD` to the page's `DD-MM-YYYY`. Anything else passes through unchanged. */
export function displayDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return iso || ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

/** `DD-MM-YYYY` back to ISO, or null when the text is not a complete date yet. */
export function isoFromDisplay(text: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text || '')
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

export function addDaysIso(iso: string, days: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return iso
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  date.setDate(date.getDate() + (Number.isFinite(days) ? days : 0))
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${date.getFullYear()}-${month}-${day}`
}

/** Discount the trade value back over the tenor: simple interest on a 360-day year. */
export function calcDepositAmt(input: {
  ottkAmount: number | string
  depositTradeValue?: number | string | undefined
  interestRate: number | string
  noOfDays: number | string
}): number {
  const trade = toNumber(input.depositTradeValue ?? input.ottkAmount)
  const rate = toNumber(input.interestRate)
  const days = toNumber(input.noOfDays)
  return trade / (1 + (rate * days) / 36000)
}
