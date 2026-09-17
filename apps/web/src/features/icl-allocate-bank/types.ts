/** One pending / issued ICL request row of the main grid. */
export type IclRequest = {
  statusCode: string
  statusDescription: string
  requestType: string
  companyCode: string
  companyName: string
  productType: string
  productDescription: string
  requestorCompany: string
  requestNo: string
  amount: number
  currency: string
  requestDate: string
  requestedBy: string
  startDate: string
  endDate: string
  partnerBankId: string
  iclGivenTxn: string
  ottkNo: string
  transactionNo: string
}

/** A house bank / account ID pair offered by the two lookup dialogs. */
export type BankAccount = {
  companyCode: string
  houseBank: string
  bankKey: string
  accountId: string
  currency: string
  bankAccount: string
  description: string
  partnerBankId: string
}

/** A row of the Log Message screen. */
export type LogRow = {
  companyName: string
  productDescription: string
  transaction: string
  startDate: string
  endDate: string
  message: string
  requestNo: string
  requestDate: string
}

export type IclSettings = {
  pageSize: number
  defaultRequestType: string
  nextIclGivenTransaction: number
}

export type IclPayload = {
  settings: IclSettings
  requests: IclRequest[]
  bankAccounts: BankAccount[]
}

export type SortDirection = '' | 'asc' | 'desc'

export type SortState = {
  /** Index into COLUMNS; -1 while the grid is unsorted, as in the original. */
  index: number
  direction: SortDirection
}

export type ToastKind = 'success' | 'warning' | 'error' | ''

export type ToastItem = {
  id: number
  kind: ToastKind
  message: string
}
