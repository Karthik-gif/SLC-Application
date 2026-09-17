/** Company code entry behind the Basic Selection dropdown. */
export type CompanyCode = { code: string; name: string }

/** One row of the DMS grid's fixed document-type catalogue. */
export type DmsDocType = { code: string; desc: string }

/** Maps a company code to the single facility the approval flow searches transactions under. */
export type Facility = { companyCode: string; facilityNo: string }

/** A bank transaction (line) available under a facility, picked in the Transaction modal. */
export type FacilityTransaction = {
  transNo: string
  productType: string
  bankName: string
  termEnd: string
  limitAmount: number
  availableLimit: number
  issuingBankCode: string
  issuingBankName: string
}

/** One pending SBLC request — the row type of the main list. */
export type SblcRecord = {
  companyCode: string
  companyName: string
  tsfStructure: string
  dealId: string
  sblcRequestNumber: string
  ottkNo: string
  sblcRequestType: string
  beneficiaryCode: string
  startDate: string
  endDate: string
  sblcAmount: number
  currency: string
  sblcRequestStatusDesc: string
  sblcTransaction: string
  issuingBankCode: string
  issuingBankName: string
  issuanceFee: string
  lcNumber: string
}

/** What the DMS grid remembers per document type, per request. */
export type DmsDoc = {
  docDate: string
  fileName: string
  dmsCode: string
  uploaded: boolean
}

export type ToastKind = 'success' | 'warning' | 'error' | ''

export type Toast = { id: number; kind: ToastKind; message: string }
