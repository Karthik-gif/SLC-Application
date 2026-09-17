import { addDaysDMY, calcInterestDue, calcInterestRate, calcNetDiscounted } from './calc.ts'
import type { DiscountingLoanRecord } from './types.ts'

export type MainColumn = {
  /** Stable identity, matching the legacy column key even where no field backs it. */
  id: string
  label: string
  width: number
  /** Columns that read a field straight off the record. */
  key?: keyof DiscountingLoanRecord
  /** Columns the page derives; the four money/rate ones have no stored field. */
  compute?: (record: DiscountingLoanRecord) => string | number
  number?: boolean
  rate?: boolean
  badge?: boolean
}

export const MAIN_COLUMNS: readonly MainColumn[] = [
  { id: 'companyCode', label: 'Company Code', width: 100, key: 'companyCode' },
  { id: 'slcStructure', label: 'SLC Structure', width: 110, key: 'slcStructure' },
  { id: 'activityCatName', label: 'Activity Cat. Name', width: 150, key: 'activityCatName' },
  {
    id: 'transactionTypeDesc',
    label: 'Transaction Type Description',
    width: 190,
    key: 'transactionTypeDesc',
  },
  { id: 'dealNo', label: 'Deal No', width: 110, key: 'dealNo' },
  { id: 'dttkNo', label: 'DTTK No', width: 100, key: 'dttkNo' },
  { id: 'startDate', label: 'Start Date', width: 105, key: 'startDate' },
  {
    id: 'endDate',
    label: 'End Date',
    width: 105,
    compute: (r) => addDaysDMY(r.startDate, r.noOfDays),
  },
  { id: 'transactionNo', label: 'Transaction', width: 110, key: 'transactionNo' },
  { id: 'discountValue', label: 'Discount Value', width: 130, key: 'discountValue', number: true },
  { id: 'currency', label: 'Currency', width: 80, key: 'currency' },
  { id: 'bankName', label: 'Bank Name', width: 220, key: 'bankName' },
  {
    id: 'netDiscountedAmt',
    label: 'Net Discounted Amt',
    width: 150,
    number: true,
    compute: calcNetDiscounted,
  },
  {
    id: 'refInterestRate',
    label: 'Ref. Interest Rate',
    width: 120,
    key: 'refInterestRate',
    number: true,
    rate: true,
  },
  {
    id: 'interestRate',
    label: 'Interest Rate',
    width: 105,
    number: true,
    rate: true,
    compute: calcInterestRate,
  },
  { id: 'spreadRate', label: 'Spread Rate', width: 105, key: 'spreadRate', number: true, rate: true },
  { id: 'interestDue', label: 'Interest Due', width: 130, number: true, compute: calcInterestDue },
  {
    id: 'accountingTypeDesc',
    label: 'Accounting Type Description',
    width: 180,
    key: 'accountingTypeDesc',
  },
  { id: 'status', label: 'Status', width: 150, key: 'status', badge: true },
]

/** The edit modal's grid header; it shares the main table's header markup but never sorts. */
export const EDIT_COLUMNS: readonly { label: string; width: number }[] = [
  { label: 'Discount Value', width: 135 },
  { label: 'Start Date', width: 110 },
  { label: 'Ref. Interest Rate', width: 130 },
  { label: 'Spread Rate', width: 110 },
  { label: 'No Of Days', width: 100 },
  { label: 'Net Discounted Amt', width: 150 },
]

export function columnValue(column: MainColumn, record: DiscountingLoanRecord): string | number {
  if (column.compute) return column.compute(record)
  return column.key ? record[column.key] : ''
}
