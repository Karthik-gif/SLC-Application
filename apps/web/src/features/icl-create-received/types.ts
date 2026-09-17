/** One column definition from the request table, as the legacy page declares it. */
export type IclColumnType = 'status' | 'text' | 'date' | 'amount' | 'rate'

export type IclColumn = {
  key: string
  label: string
  width: number
  type?: IclColumnType | undefined
}

/** The DMS (document management) record attached to one ICL request row. */
export type IclDmsDoc = {
  docType: string
  docTypeDesc: string
  docDate: string
  filePath: string
  fileName: string
  dmsCode: string
  uploaded: boolean
  finalized: boolean
}

/** One row of the ICL Received Requests table. Every field the original renders directly. */
export type IclRequestRow = {
  statusCode: string
  client: string
  iclGivenCompanyCode: string
  iclRequestNo: string
  requestDate: string
  startDate: string
  endDate: string
  plannedEndDate: string
  amount: number
  currency: string
  dealId: string
  iclReqStatus: string
  ottkNo: string
  slcStructure: string
  entityId: string
  entityString: string
  iclRecCompanyCode: string
  depositRequest: string
  houseBank: string
  accountId: string
  partnerBankId: string
  enteredBy: string
  enteredOn: string
  entryTime: string
  requestedBy: string
  requestorCoCode: string
  requestorCoName: string
  requestorBank: string
  requestorBankName: string
  expectedDate: string
  lcTenor: string
  businessArea: string
  ottkClassification: string
  dttkNo: string
  iclRequestStatusDescription: string
  percentageRate: number
  fixing: string
  depositCompanyCode: string
  depositTxn: string
  wcdlCompanyCode: string
  iclRecTxn: string
  iclGivenTxn: string
  companyName: string
  activeStatus: string
  productType: string
  productTypeDescription: string
  transactionType: string
  transactionTypeDescription: string
  iclReceivedBank: string
  activeActivity: string
  businessPartner: string
  profitCenter: string
  profitCenterDescription: string
  businessAreaDescription: string
  portfolio: string
  accountingCategory: string
  iclGivenPrd: string
  iclGivenPrdDesc: string
  iclRecPrd: string
  iclRecPrdDesc: string
  targetReceivedCompanyCode: string
  dms: IclDmsDoc
}

export type IclSettings = {
  pageSize: number
  nextReceivedTransaction: number
  nextDmsCode: number
  dateFormat: string
}

export type IclPayload = {
  settings: IclSettings
  columns: IclColumn[]
  rows: IclRequestRow[]
}

/** A row alongside its index in the full (unfiltered) row list, as the original tracks it. */
export type IndexedRow = {
  row: IclRequestRow
  index: number
}

export type SortState = {
  index: number
  direction: '' | 'asc' | 'desc'
}

/** Values typed into the four combo-box filters, keyed by the row field they filter on. */
export type FilterState = {
  givenTxn: string
  requestNo: string
  entity: string
  ottk: string
  plannedDate: string
}

export type CalendarTarget = 'uptoRequestDate' | 'plannedDateFilter'
