/** One IRS contract row of the results table. */
export type IrsRecord = {
  id: number
  companyCode: string
  companyName: string
  /** Derived on load by the original as `companyCode - companyName`; a sortable column. */
  companyNameDisplay: string
  productTypeDescription: string
  transactionTypeDescription: string
  dealNo: string
  startDate: string
  endDate: string
  bankName: string
  irsId: string
  transaction: string
  incomingAmount: number
  inRefIntRate: string
  incSpreadRate: string
  outgoingInterestRate: string
  businessArea: string
  contractDate: string
  discLoanTxn: string
  irsRefNo: string
  discLoanCompCode: string
  dttkNo: string
  ottkNo: string
  outRefIntRate: string
  outgoingAmount: number
  profitCenter: string
  settled: boolean
}

/** Every record field the table can render or sort on — i.e. everything but `settled`. */
export type IrsColumnKey = {
  [K in keyof IrsRecord]: IrsRecord[K] extends string | number ? K : never
}[keyof IrsRecord]

export type IrsColumnType = 'text' | 'number' | 'date' | 'rate'

export type IrsColumn = {
  key: IrsColumnKey
  label: string
  width: number
  type: IrsColumnType
}

/** A Status Selection entry. `settled` is the flag rows are matched against. */
export type IrsStatus = {
  code: string
  label: string
  settled: boolean
}

/** One generated row of the cashflow table inside the Cashflow modal. */
export type Cashflow = {
  date: string
  description: string
  disc: number
  incoming: number
  outgoing: number
  fixDate: string
  percentage: string
  status: string
}

export type SortDirection = 'asc' | 'desc'

export type CalendarMode = 'days' | 'years'

/** Which of the two filter comboboxes is open, if either. */
export type ComboKind = 'txn' | 'deal'
