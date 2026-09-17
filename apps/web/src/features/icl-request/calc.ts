// Formatting and the deposit discount maths, exactly as the legacy page computed them.

/** Thousands-separated with two decimals. The grid re-parses its own output, so keep the commas. */
export function money(value: number | string): string {
  const parts = Number(value || 0).toFixed(2).split('.')
  const whole = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return [whole, parts[1] ?? '00'].join('.')
}

export function rate(value: number | string): string {
  return Number(value || 0).toFixed(7)
}

/** Same as `rate`, but for a value that has already been typed into a grid cell. */
export function rateValue(value: string): string {
  return (Number(String(value).replace(/,/g, '')) || 0).toFixed(7)
}

export function toNumber(value: string): number {
  return Number(String(value).replace(/,/g, '')) || 0
}

/** Discounted present value: trade / (1 + rate * days / 36000). */
export function calcDeposit(trade: number | string, interest: number | string, days: number | string): number {
  const t = toNumber(String(trade))
  const r = Number(interest) || 0
  const d = Number(days) || 0
  return t / (1 + (r * d) / 36000)
}

function parseDate(text: string): Date | null {
  const m = String(text || '').match(/^(\d{2})-(\d{2})-(\d{2}|\d{4})$/)
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const rawYear = m[3] ?? ''
  const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear)
  return new Date(year, month - 1, day)
}

function formatDate(date: Date): string {
  const d = `0${date.getDate()}`.slice(-2)
  const m = `0${date.getMonth() + 1}`.slice(-2)
  return `${d}-${m}-${date.getFullYear()}`
}

/** dd-mm-yy becomes dd-mm-yyyy; anything unparseable is handed back untouched. */
export function normalizeDate(text: string): string {
  const d = parseDate(text)
  return d ? formatDate(d) : text
}

export function addDays(text: string, days: number | string): string {
  const d = parseDate(text)
  if (!d) return text
  d.setDate(d.getDate() + (Number(days) || 0))
  return formatDate(d)
}
