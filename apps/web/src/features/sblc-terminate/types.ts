export type Company = {
  code: string
  name: string
  city: string
  currency: string
}

/** A DMS attachment slot. The three slots exist before anything is uploaded into them. */
export type DmsDoc = {
  docType: string
  docTypeDesc: string
  docDate: string
  fileName: string
  dmsCode: string
  uploaded: boolean
  /** Picked in the browser but not yet "uploaded"; the legacy page called this pendingFileObject. */
  pendingFile?: File | null | undefined
  file?: File | null | undefined
}

export type SblcRow = {
  companyCode: string
  dealId: string
  sblcStatus: string
  sblcRequestStatusDescription: string
  companyName: string
  sblcTransaction: string
  productTypeDescription: string
  sblcBeneficiary: string
  sblcRequestNumber: string
  startDate: string
  endDate: string
  sblcAmount: number
  ottkNo: string
  sblcRequestTypeDescription: string
  lcAmountValue: number
  entityString: string
  requestDate: string
  expectedEndDate: string
  currency: string
  issuingBank: string
  requestorCoName: string
  requestorBankName: string
  expectedDate: string
  requestedBy: string
  sblcInitiateTermination: string
  sblcTerminationDate: string
  terminationCurrency: string
  terminationState: 'PENDING' | 'TERMINATED'
  dms: DmsDoc[]
}

/** Row fields a column can show — everything except the two the grid never renders. */
export type SblcValueKey = Exclude<keyof SblcRow, 'companyCode' | 'terminationState' | 'dms'>

export type SblcColumn = {
  key: SblcValueKey
  label: string
  width: number
  type?: 'date' | 'amount' | undefined
}

export type Settings = {
  pageSize: number
  nextDmsCode: number
  dateFormat: string
  defaultAdditionalSelection: string
}

export type SortState = {
  index: number
  direction: '' | 'asc' | 'desc'
}

/** A filtered row keeps the index it has in the master list, which is what selection points at. */
export type IndexedRow = {
  row: SblcRow
  index: number
}

export type ToastKind = 'success' | 'warning' | ''

export type Toast = {
  id: number
  kind: ToastKind
  message: string
}
