import { addDaysDMY, calcInterestRate, calcNetDeposit, calcTotalInterest } from './calc.ts'
import type { DepositRecord } from './types.ts'

export type MainColumn = {
  label: string
  width: number
  /** Right-aligned and sorted numerically. */
  number?: boolean | undefined
  /** Formatted to four decimals rather than as an amount. */
  rate?: boolean | undefined
  /** Rendered as a status pill. */
  badge?: boolean | undefined
  value: (r: DepositRecord) => string | number
}

/** The overview table, in the original's column order. */
export const MAIN_COLUMNS: readonly MainColumn[] = [
  { label: 'Company Code', width: 100, value: (r) => r.companyCode },
  { label: 'Activity Cat. Name', width: 150, value: (r) => r.activityCatName },
  { label: 'Transaction Type Description', width: 170, value: (r) => r.transactionTypeDesc },
  { label: 'ICL Request No', width: 120, value: (r) => r.iclRequestNo },
  { label: 'OTTK No', width: 100, value: (r) => r.ottkNo },
  { label: 'Start Date', width: 105, value: (r) => r.startDate },
  { label: 'End Date', width: 105, value: (r) => addDaysDMY(r.startDate, r.noOfDays) },
  { label: 'Transaction', width: 110, value: (r) => r.transactionNo },
  { label: 'Trade Value', width: 120, number: true, value: (r) => r.tradeValue },
  { label: 'Currency', width: 80, value: (r) => r.currency },
  { label: 'Bank Name', width: 220, value: (r) => r.bankName },
  { label: 'Net Deposit Amt', width: 130, number: true, value: (r) => calcNetDeposit(r) },
  { label: 'Ref. Interest Rate', width: 120, number: true, rate: true, value: (r) => r.refInterestRate },
  { label: 'Interest Rate', width: 105, number: true, rate: true, value: (r) => calcInterestRate(r) },
  { label: 'Spread Rate', width: 105, number: true, rate: true, value: (r) => r.spreadRate },
  { label: 'Total Interest Amount', width: 150, number: true, value: (r) => calcTotalInterest(r) },
  { label: 'Deal ID', width: 100, value: (r) => r.dealId },
  { label: 'Status', width: 150, badge: true, value: (r) => r.status },
]

/** The edit modal's header row; it carries labels and widths only. */
export const EDIT_COLUMNS: readonly { label: string; width: number }[] = [
  { label: 'Trade Value', width: 130 },
  { label: 'Start Date', width: 110 },
  { label: 'Ref. Interest Rate', width: 130 },
  { label: 'Spread Rate', width: 110 },
  { label: 'No Of Days', width: 100 },
  { label: 'Net Deposit Amt', width: 140 },
]
