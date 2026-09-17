import { formatDate, money, parseDate } from './dates.ts'
import type { IclColumn, IclRequestRow } from './types.ts'

/** Renders one cell's text, per the column's declared type — ported from `valueText`. */
export function valueText(row: IclRequestRow, column: IclColumn): string {
  const value = row[column.key as keyof IclRequestRow]
  if (column.type === 'amount') return money(value as number)
  if (column.type === 'rate' && value !== '' && value != null) return Number(value).toFixed(4)
  if (column.type === 'date') {
    const date = parseDate(String(value ?? ''))
    return date ? formatDate(date) : String(value ?? '')
  }
  return String(value ?? '')
}

export type StatusKind = 'pending' | 'received' | 'rejected'

/** Maps a row's raw status code to the label/kind the `.status-text` badge shows. */
export function statusInfo(status: string): { label: string; kind: StatusKind; title: string } {
  if (status === 'RECEIVED') return { label: 'Received', kind: 'received', title: 'ICL Received' }
  if (status === 'REJECTED') return { label: 'Rejected', kind: 'rejected', title: 'Rejected' }
  return { label: 'Pending', kind: 'pending', title: 'Pending' }
}
