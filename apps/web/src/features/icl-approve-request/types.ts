/** Shapes behind the View & Approve ICL Request screen. */

export type MasterItem = {
  key: string
  text: string
}

export type DmsDoc = {
  docType: string
  docTypeDesc: string
  docDate: string
  filePath: string
  dmsCode: string
}

export type IclRequest = {
  iclRequestNo: string
  entityId: string
  entityString: string
  requestorCoName: string
  iclReqStatus: string
  amount: number
  currency: string
  requestDate: string
  ottkNo: string
  dttkNo: string
  dealId: string
  startDate: string
  endDate: string
  depositBankName: string
  houseBank: string
  accountId: string
  partnerBankId: string
  fiscalYear: string
  docNo: string
  client: string
  iclGivenCoCode: string
  plannedEndDate: string
  slcStructure: string
  approved: boolean
  rejected: boolean
  dmsData: DmsDoc[]
}

/**
 * Every sortable header. Three of them are not fields on the row: `status` sorts on the
 * status code behind the colour dot, `iclGivenPrdDesc` is a constant, and
 * `iclReqStatusDesc` is the looked-up status text.
 */
export type SortKey =
  | 'status'
  | 'iclGivenPrdDesc'
  | 'iclReqStatusDesc'
  | 'entityString'
  | 'requestorCoName'
  | 'iclRequestNo'
  | 'amount'
  | 'currency'
  | 'requestDate'
  | 'ottkNo'
  | 'dttkNo'
  | 'dealId'
  | 'startDate'
  | 'endDate'
  | 'depositBankName'
  | 'houseBank'
  | 'accountId'
  | 'partnerBankId'
  | 'fiscalYear'
  | 'docNo'
  | 'client'
  | 'iclGivenCoCode'
  | 'plannedEndDate'
  | 'iclReqStatus'
  | 'slcStructure'
  | 'entityId'

export type SortDirection = 'asc' | 'desc'

export type Filters = {
  requestNo: string
  entityId: string
  ottkNo: string
  iclReqStatus: string
  plannedEndDate: string
}

export type ToastKind = 'success' | 'error' | 'warning' | 'info'

export type Toast = {
  id: number
  kind: ToastKind
  message: string
}
