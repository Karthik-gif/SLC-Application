import { calcInterestRate, descriptionFor } from './calc.ts'
import type { CashflowRow, LoanRecord } from './types.ts'

/**
 * The overview grid's columns, ported from the original's MAIN_COLUMNS — including each
 * fixed pixel width, which the legacy header applies inline and which keeps every column
 * aligned with its sort arrows.
 */
export type MainColumn = {
  id: string
  label: string
  width: number
  number?: boolean
  rate?: boolean
  value: (r: LoanRecord) => string | number
}

export const MAIN_COLUMNS: readonly MainColumn[] = [
  { id: 'companyCode', label: 'CoCode', width: 90, value: (r) => r.companyCode },
  { id: 'entityString', label: 'Entity String', width: 170, value: (r) => r.entityString },
  { id: 'dealId', label: 'Deal ID', width: 110, value: (r) => r.dealId },
  { id: 'discLoanTxn', label: 'Disc Loan Txn', width: 120, value: (r) => r.discLoanTxn },
  { id: 'discLoanAmount', label: 'Disc Loan Amount', width: 150, number: true, value: (r) => r.discLoanAmount },
  { id: 'currency', label: 'Currency', width: 80, value: (r) => r.currency },
  { id: 'bankName', label: 'Bank Name', width: 220, value: (r) => r.bankName },
  { id: 'refInterestRate', label: 'Ref Interest', width: 105, number: true, rate: true, value: (r) => r.refInterestRate },
  { id: 'interestRate', label: 'Interest Rate', width: 105, number: true, rate: true, value: (r) => calcInterestRate(r) },
  { id: 'spreadRate', label: 'Spread Rate', width: 105, number: true, rate: true, value: (r) => r.spreadRate },
  { id: 'irsId', label: 'IRS ID', width: 100, value: (r) => r.irsId },
  { id: 'irsCompanyName', label: 'Company Name', width: 180, value: (r) => r.irsCompanyName },
  { id: 'irsTxn', label: 'IRS Txn', width: 120, value: (r) => r.irsTxn },
  { id: 'partnerName', label: 'Partner Name', width: 220, value: (r) => r.partnerName },
  { id: 'startDate', label: 'Start Date', width: 105, value: (r) => r.startDate },
  { id: 'endDate', label: 'End Date', width: 105, value: (r) => r.endDate },
]

export type CashflowColumn = {
  id: string
  label: string
  width: number
  number?: boolean
  rate?: boolean
  amount?: boolean
  center?: boolean
  value: (row: CashflowRow) => string | number
}

export const CASHFLOW_COLUMNS: readonly CashflowColumn[] = [
  { id: 'paymentDate', label: 'Payment Date', width: 110, value: (row) => row.paymentDate },
  { id: 'name', label: 'Description', width: 150, center: true, value: (row) => descriptionFor(row) },
  { id: 'discLoan', label: 'Disc Loan', width: 130, number: true, amount: true, value: (row) => row.discLoan },
  { id: 'irsIncoming', label: 'IRS Incoming', width: 130, number: true, amount: true, value: (row) => row.irsIncoming },
  { id: 'irsOutgoing', label: 'IRS Outgoing', width: 130, number: true, amount: true, value: (row) => row.irsOutgoing },
  { id: 'curr', label: 'Curr', width: 70, value: (row) => row.curr },
  { id: 'intFixDate', label: 'Int. Fix. Date', width: 120, value: (row) => row.intFixDate },
  { id: 'pctRate', label: 'Percentage Rate', width: 145, number: true, rate: true, value: (row) => row.pctRate },
  { id: 'adjStatus', label: 'Int. Rate Adj. Status', width: 175, center: true, value: (row) => row.adjStatus },
]
