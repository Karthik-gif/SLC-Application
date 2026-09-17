/** Pure helpers lifted from the legacy page's script: formatting, DD-MM-YYYY dates and the
 * LC fee calculation. Nothing here touches the DOM. */

export function money(value: number | string): string {
  const n = Number(value || 0)
  const parts = n.toFixed(2).split('.')
  parts[0] = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
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
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`
}

/** The date inputs show DD-MM-YYYY; the hidden native picker next to them speaks ISO. */
export function isoToDMY(iso: string): string {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso || ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

export function diffDaysDMY(startValue: string, endValue: string): number {
  const s = parseDMY(startValue)
  const e = parseDMY(endValue)
  if (!s || !e) return 0
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000))
}

/** Simple-interest style fee: amount x rate x days over a 360-day year in percent. */
export function calcFeeAmount(amount: number, feePercent: number, days: number): number {
  return (Number(amount || 0) * Number(feePercent || 0) * Number(days || 0)) / 36000
}

/**
 * Expands "2.5m", "3cr", "10k" and friends typed into an amount field.
 * Returns null when the text is not a shorthand amount, in which case the field is left as is.
 */
export function parseShorthandAmount(value: string): number | null {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  const match = raw.match(/^(-?[\d.]+)\s*([a-zA-Z]*)$/)
  if (!match) return null
  const num = parseFloat(match[1] ?? '')
  if (isNaN(num)) return null
  const suffix = (match[2] ?? '').toLowerCase()
  let mult = 1
  if (suffix === 'k') mult = 1e3
  else if (suffix === 'l' || suffix === 'lc' || suffix === 'lac' || suffix === 'lakh') mult = 1e5
  else if (suffix === 'm') mult = 1e6
  else if (suffix === 'cr' || suffix === 'c') mult = 1e7
  else if (suffix === 'b') mult = 1e9
  else if (suffix !== '') return null
  return num * mult
}

/** The legacy convertShorthandField: rewrite the field only when it parses. */
export function expandShorthand(value: string): string {
  const parsed = parseShorthandAmount(value)
  return parsed === null ? value : String(parsed)
}
