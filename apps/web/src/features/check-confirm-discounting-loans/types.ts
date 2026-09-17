/** A company code entry behind the Basic Selection dropdown. */
export type CompanyCode = {
  code: string
  name: string
}

/** One discounting loan as the overview table and the edit modal read it. */
export type DiscountingLoanRecord = {
  companyCode: string
  companyName: string
  slcStructure: string
  activityCatName: string
  transactionTypeDesc: string
  dealNo: string
  dttkNo: string
  transactionNo: string
  startDate: string
  noOfDays: number
  discountValue: number
  currency: string
  bankName: string
  refInterestRate: number
  spreadRate: number
  accountingTypeDesc: string
  productType: string
  status: string
}

/** The whole payload the legacy page renders from. */
export type DiscountingLoanPayload = {
  companyCodes: readonly CompanyCode[]
  statuses: readonly string[]
  records: readonly DiscountingLoanRecord[]
}

/** The five values the edit modal lets the user change, held as typed text. */
export type EditForm = {
  discountValue: string
  startDate: string
  refInterestRate: string
  spreadRate: string
  noOfDays: string
}

export type ToastKind = 'success' | 'warning' | ''

export type Toast = {
  id: number
  kind: ToastKind
  message: string
}
