/** The interest arithmetic and date handling the legacy page did inline. */

/** Every figure the deposit maths needs; the edit modal recalculates from unsaved values. */
export type DepositFigures = {
  tradeValue: number
  refInterestRate: number
  spreadRate: number
  noOfDays: number
}

export function money(value: number): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function rateFmt(value: number): string {
  return Number(value || 0).toFixed(4)
}

function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n
}

export function parseDMY(value: string): Date | null {
  const m = String(value || '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!m) return null
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
}

export function formatDMY(d: Date): string {
  return pad2(d.getDate()) + '-' + pad2(d.getMonth() + 1) + '-' + d.getFullYear()
}

export function addDaysDMY(value: string, days: number): string {
  const d = parseDMY(value)
  if (!d) return value
  d.setDate(d.getDate() + Number(days || 0))
  return formatDMY(d)
}

export function isoToDMY(iso: string): string {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso || ''
  return m[3] + '-' + m[2] + '-' + m[1]
}

export function calcInterestRate(r: DepositFigures): number {
  return (Number(r.refInterestRate) || 0) + (Number(r.spreadRate) || 0)
}

export function calcTotalInterest(r: DepositFigures): number {
  const rate = calcInterestRate(r)
  const days = Number(r.noOfDays) || 0
  const val = Number(r.tradeValue) || 0
  return (val * rate * days) / 36000
}

export function calcNetDeposit(r: DepositFigures): number {
  return (Number(r.tradeValue) || 0) - calcTotalInterest(r)
}

export function statusBadgeClass(status: string): string {
  if (status === 'Contract Settlement') return 'badge badge-closed'
  return 'badge badge-open'
}

/** Strips the thousands separators the edit cells display before parsing. */
export function parseAmount(text: string): number {
  return Number(String(text).replace(/,/g, '')) || 0
}
