import { COMPANIES } from './data.ts'
import { formatDate, money, parseDate } from './format.ts'
import type { Company, IndexedRow, SblcColumn, SblcRow, SortState } from './types.ts'

export type Filters = {
  transaction: string
  requestType: string
  termination: string
}

export type ComboId = 'transactionFilter' | 'requestTypeFilter' | 'terminationFilter'

export const FILTER_KEY_BY_COMBO: Record<ComboId, keyof Filters> = {
  transactionFilter: 'transaction',
  requestTypeFilter: 'requestType',
  terminationFilter: 'termination',
}

export function companyByCode(code: string): Company | null {
  const value = String(code || '').toUpperCase()
  return COMPANIES.find((c) => c.code.toUpperCase() === value) ?? null
}

/** Mirrors basicReady(): both Company Code and Key Date must resolve before anything loads. */
export function basicReady(companyCode: string, keyDate: string): boolean {
  return !!companyByCode(companyCode) && !!parseDate(keyDate)
}

export function getFilteredRows(rows: SblcRow[], companyCode: string, filters: Filters): IndexedRow[] {
  const company = String(companyCode || '').toUpperCase()
  const txn = filters.transaction.toLowerCase()
  const type = filters.requestType.toLowerCase()
  const selection = filters.termination.toLowerCase()
  const result: IndexedRow[] = []
  rows.forEach((row, index) => {
    if (String(row.companyCode || '').toUpperCase() !== company) return
    if (txn && !row.sblcTransaction.toLowerCase().includes(txn)) return
    if (type && !row.sblcRequestTypeDescription.toLowerCase().includes(type)) return
    if (selection === 'pending termination' && row.terminationState === 'TERMINATED') return
    if (selection === 'terminated' && row.terminationState !== 'TERMINATED') return
    result.push({ row, index })
  })
  return result
}

function sortValue(item: IndexedRow, column: SblcColumn): string | number {
  const value = item.row[column.key]
  if (column.type === 'amount') return Number(value || 0)
  if (column.type === 'date') {
    const date = parseDate(String(value ?? ''))
    return date ? date.getTime() : 0
  }
  return String(value ?? '').toLowerCase()
}

export function applySort(rows: IndexedRow[], column: SblcColumn | undefined, direction: SortState['direction']): IndexedRow[] {
  if (!column || !direction) return rows
  const sorted = [...rows]
  sorted.sort((a, b) => {
    const av = sortValue(a, column)
    const bv = sortValue(b, column)
    if (av < bv) return direction === 'asc' ? -1 : 1
    if (av > bv) return direction === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

/** Renders a cell's text exactly as valueText() did, including the termination special case. */
export function valueText(row: SblcRow, column: SblcColumn): string {
  const value = row[column.key]
  if (column.key === 'sblcInitiateTermination') return value === 'Terminated' ? 'Terminated' : 'Pending'
  if (column.type === 'amount') return money(value as number)
  if (column.type === 'date') {
    const date = parseDate(String(value ?? ''))
    return date ? formatDate(date) : String(value ?? '')
  }
  return String(value ?? '')
}

export function transactionValues(rows: SblcRow[], companyCode: string, query: string): string[] {
  const q = query.toLowerCase()
  const company = String(companyCode || '').toUpperCase()
  const seen = new Set<string>()
  const values: string[] = []
  for (const row of rows) {
    if (company && String(row.companyCode || '').toUpperCase() !== company) continue
    const value = String(row.sblcTransaction || '')
    if (!value || seen.has(value)) continue
    if (q && !value.toLowerCase().includes(q)) continue
    seen.add(value)
    values.push(value)
  }
  return values.sort()
}
