/** The columns the legacy payload declares, in its order. */
export type ColumnKey =
  | 'activity'
  | 'dealNo'
  | 'companyName'
  | 'transaction'
  | 'transactionTypeDescription'
  | 'prepayment'
  | 'currency'
  | 'bankName'
  | 'startDate'
  | 'endDate'
  | 'refInterest'

export type ColumnType = 'text' | 'number' | 'date'

export type PrepaymentColumn = {
  key: ColumnKey
  label: string
  width: number
  type: ColumnType
}

/** One selectable status in the filter, and whether it means "already settled". */
export type PrepaymentStatus = {
  code: string
  label: string
  settled: boolean
}

export type PrepaymentRecord = {
  id: number
  companyCode: string
  activity: string
  dealNo: string
  companyName: string
  transaction: string
  transactionTypeDescription: string
  prepayment: number
  currency: string
  bankName: string
  /** DD-MM-YYYY, as the legacy page stores and displays every date. */
  startDate: string
  endDate: string
  refInterest: string
  settled: boolean
}
