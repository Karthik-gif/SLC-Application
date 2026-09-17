/** Value formatting and lookups shared by the grid and the DMS modal. */

import { STATUS_COLOR_MAP } from './data.ts'
import type { IclRequest, MasterItem } from './types.ts'

export function toSafeNumber(value: string | number | null | undefined): number {
  const num = Number.parseFloat(String(value ?? 0).replace(/,/g, ''))
  return Number.isNaN(num) ? 0 : num
}

/** Two decimals with thousands separators, as the original's formatAmount produced. */
export function formatAmount(value: string | number | null | undefined): string {
  const num = toSafeNumber(value)
  const negative = num < 0
  const [whole = '0', fraction = '00'] = Math.abs(num).toFixed(2).split('.')
  return `${negative ? '-' : ''}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`
}

/** The text for a master-data key, falling back to the key so an unknown code still shows. */
export function lookupText(list: MasterItem[], key: string): string {
  if (!key) return ''
  return list.find((item) => item.key === key)?.text ?? key
}

/**
 * Colour of the row's status dot. An approval or rejection made in this session wins over
 * the code's own colour, because the code is only updated when the change is confirmed.
 */
export function statusColorForRow(row: IclRequest): string {
  if (row.rejected) return 'red'
  if (row.approved) return 'green'
  return STATUS_COLOR_MAP[row.iclReqStatus] ?? 'none'
}
