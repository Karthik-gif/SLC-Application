import type { LcColumn } from './types.ts'

/** The original's column list, in its order and with its pixel widths. */
export const COLUMNS: LcColumn[] = [
  { key: 'activity', label: 'Actv.Cat.', width: 100 },
  { key: 'applicant', label: 'LC Applicant', width: 225 },
  { key: 'dealId', label: 'Deal ID', width: 90 },
  { key: 'enteredOn', label: 'Entry Date', width: 105, date: true },
  { key: 'lcTxn', label: 'LC Txn', width: 105 },
  { key: 'lcAmount', label: 'LC Amount', width: 115, number: true },
  { key: 'currency', label: 'Currency', width: 90 },
  { key: 'startDate', label: 'Start Date', width: 105, date: true },
  { key: 'endDate', label: 'End Date', width: 105, date: true },
  { key: 'bank', label: 'LC Issuing Bank', width: 300 },
  { key: 'totalAmount', label: 'Total LC Amount', width: 130, number: true },
  { key: 'beneficiary', label: 'LC Beneficiary', width: 120 },
]
