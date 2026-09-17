/** One discounting loan row of the overview list, with the IRS fields it may have been assigned. */
export type LoanRecord = {
  companyCode: string
  entityString: string
  dealId: string
  discLoanTxn: string
  discLoanAmount: number
  currency: string
  bankName: string
  refInterestRate: number
  spreadRate: number
  irsId: string
  irsCompanyName: string
  irsTxn: string
  partnerName: string
  startDate: string
  endDate: string
  resetFrequency: string
  accountingType: string
  specialCase: string
  /** A record may ship its own cashflow instead of having one derived from the IRS terms. */
  exampleCashflow?: readonly CashflowRow[]
}

/** One line of the cashflow grid, shown on the detail screen and in the popup. */
export type CashflowRow = {
  paymentDate: string
  name: string
  discLoan: number
  irsIncoming: number
  irsOutgoing: number
  curr: string
  flowType: string
  intFixDate: string
  status: string
  pctRate: number
  adjStatus: string
}

export type CompanyCode = { code: string; name: string }

export type Partner = { id: string; name: string }

export type CodedOption = { code: string; label: string }

/** The IRS Details form. Every field is a string because the form edits them as text. */
export type IrsForm = {
  coCode: string
  partnerName: string
  startDate: string
  endDate: string
  incomingRef1: string
  incomingRef2: string
  outgoingIntCat: string
  outgoingIntFrq: string
  interestPaymentDate: string
  specialCase: string
  outgoingRate1: string
  outgoingRate2: string
}

export type ToastKind = 'success' | 'warning' | 'information'

export type Toast = { id: number; kind: ToastKind; message: string }
