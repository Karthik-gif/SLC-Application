/** Filtering and sorting for the ICL Requests grid. */

import { ICL_GIVEN_PRD_DESC } from './data.ts'
import { parseDateMs } from './dates.ts'
import { lookupText, toSafeNumber } from './format.ts'
import type { Filters, IclRequest, MasterItem, SortDirection, SortKey } from './types.ts'

const NUMERIC_KEYS: SortKey[] = [
  'iclRequestNo', 'ottkNo', 'dttkNo', 'dealId', 'fiscalYear', 'docNo', 'amount',
]
const DATE_KEYS: SortKey[] = ['requestDate', 'startDate', 'endDate', 'plannedEndDate']

function contains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

export function matchesFilters(row: IclRequest, filters: Filters): boolean {
  if (filters.requestNo && !contains(row.iclRequestNo, filters.requestNo)) return false
  if (filters.entityId && row.entityId !== filters.entityId) return false
  if (filters.ottkNo && !contains(row.ottkNo, filters.ottkNo)) return false
  if (filters.iclReqStatus && row.iclReqStatus !== filters.iclReqStatus) return false
  if (filters.plannedEndDate && row.plannedEndDate !== filters.plannedEndDate) return false
  return true
}

function sortValue(row: IclRequest, key: SortKey, statuses: MasterItem[]): string | number {
  if (key === 'status') return row.iclReqStatus
  if (key === 'iclGivenPrdDesc') return ICL_GIVEN_PRD_DESC
  if (key === 'iclReqStatusDesc') return lookupText(statuses, row.iclReqStatus)
  if (NUMERIC_KEYS.includes(key)) return toSafeNumber(row[key as keyof IclRequest] as string | number)
  if (DATE_KEYS.includes(key)) return parseDateMs(row[key as keyof IclRequest] as string) ?? 0
  return row[key as keyof IclRequest] as string
}

function compare(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  const as = String(a ?? '').toLowerCase()
  const bs = String(b ?? '').toLowerCase()
  if (as < bs) return -1
  if (as > bs) return 1
  return 0
}

/** Stable: rows that compare equal keep the order they arrived in. */
export function sortRows(
  rows: IclRequest[],
  key: SortKey,
  direction: SortDirection,
  statuses: MasterItem[],
): IclRequest[] {
  const factor = direction === 'desc' ? -1 : 1
  return rows
    .map((row, index) => ({ row, index, value: sortValue(row, key, statuses) }))
    .sort((a, b) => {
      const result = compare(a.value, b.value)
      return result !== 0 ? result * factor : a.index - b.index
    })
    .map((entry) => entry.row)
}

/** The Entity ID filter is built from whatever entities the loaded rows actually carry. */
export function uniqueEntityIds(rows: IclRequest[]): string[] {
  return [...new Set(rows.map((row) => row.entityId).filter(Boolean))].sort()
}
