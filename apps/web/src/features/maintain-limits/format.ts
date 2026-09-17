/** Value formatting and date arithmetic, lifted unchanged from the legacy page's helpers. */

/** Thousands-separated, always two decimals. */
export function money(value: number | string): string {
  const n = Number(value || 0)
  const parts = n.toFixed(2).split('.')
  parts[0] = (parts[0] ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/**
 * "1.5m" -> 1500000. Returns null when the text is not shorthand, which is how the caller
 * tells apart "expand this" from "just reformat what was typed".
 */
export function parseAmountShorthand(text: string): number | null {
  const m = String(text || '')
    .trim()
    .match(/^([0-9]*\.?[0-9]+)\s*(k|l|m|b|cr)$/i)
  if (!m) return null
  const multipliers: Record<string, number> = { k: 1000, l: 100000, m: 1000000, cr: 10000000, b: 1000000000 }
  return parseFloat(m[1] ?? '0') * (multipliers[(m[2] ?? '').toLowerCase()] ?? 1)
}

/** ISO YYYY-MM-DD -> DD-MM-YYYY, the only form this screen shows. */
export function displayDate(iso: string): string {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso || ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

export function isoFromDisplay(text: string): string | null {
  const m = String(text || '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

function parseIso(iso: string): Date | null {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

/** Tenor in days. Zero when either end is unparseable, as the original does. */
export function dayDiff(startIso: string, endIso: string): number {
  const a = parseIso(startIso)
  const b = parseIso(endIso)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function statusBadgeClass(code: string): string {
  if (code === '05') return 'badge badge-closed'
  if (code === '09') return 'badge badge-override'
  if (code === '01' || code === '02') return 'badge badge-open'
  return 'badge badge-created'
}

/** DMS codes are minted client side here; SAP will own them once a service exists. */
export function generateDmsCode(): string {
  return 'DMSD' + String(100000 + Math.floor(Math.random() * 899999))
}
