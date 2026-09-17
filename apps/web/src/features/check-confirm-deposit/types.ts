/** A company code entry behind the Basic Selection dropdown. */
export type CompanyCode = {
  code: string
  name: string
}

/** One deposit row of the overview table. */
export type DepositRecord = {
  companyCode: string
  companyName: string
  activityCatName: string
  transactionTypeDesc: string
  iclRequestNo: string
  ottkNo: string
  transactionNo: string
  dealId: string
  startDate: string
  noOfDays: number
  tradeValue: number
  currency: string
  bankName: string
  houseBank: string
  accountId: string
  partnerBank: string
  entityId: string
  client: string
  activeActivity: string
  activityCategory: string
  productType: string
  refInterestRate: number
  spreadRate: number
  status: string
  sentForApproval?: boolean | undefined
}

/** The payload the legacy page renders from. */
export type DepositPayload = {
  companyCodes: readonly CompanyCode[]
  statuses: readonly string[]
  records: readonly DepositRecord[]
}

/** A toast in the bottom-right region. */
export type Toast = {
  id: number
  kind: 'success' | 'warning' | 'information'
  message: string
}
