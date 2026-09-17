/** Shapes of the model the legacy page embedded as inline JSON. See data.ts. */

export type SeriesConfig = { start: number; step: number }

export type AmountMultipliers = Record<string, number>

/** A request line as it is stored against a record. */
export type RequestVariant = {
  startDate: string
  endDate: string
  expEndDate: string
  amount: number | string
  requestType: string
  companyCode: string
  beneficiary: string
  beneficiaryName: string
  requestNo: string
}

export type RequestRow = RequestVariant & {
  id: string
  /**
   * Alternative shapes of the same line. Nothing renders them; they exist so the request
   * number generator can avoid numbers the seed data has already handed out.
   */
  variants?: readonly RequestVariant[] | undefined
}

export type SblcRecord = {
  id: number
  tsfStructure: string
  slcStructure: string
  entityString: string
  entityId: string
  ottkBankDesc: string
  ottkNo: string
  ottkValue: number
  ottkCurr: string
  trader: string
  ottkStatDesc: string
  ottkStatus: string
  dealId: string
  dttkNo: string
  proposedSblcAmt: number
  sblcTxn: string
  sblcAmt: number | string
  companyCode: string
  companyName: string
  businessArea: string
  businessAreaName: string
  requestRows: readonly RequestRow[]
  requestNo: string
}

/** Keys of SblcRecord the results grid can show — every column in data.ts is one of these. */
export type SblcColumnKey =
  | 'slcStructure'
  | 'entityString'
  | 'ottkBankDesc'
  | 'ottkNo'
  | 'ottkValue'
  | 'ottkCurr'
  | 'trader'
  | 'ottkStatDesc'
  | 'dealId'
  | 'dttkNo'
  | 'proposedSblcAmt'
  | 'sblcTxn'
  | 'sblcAmt'

export type SblcColumn = {
  key: SblcColumnKey
  label: string
  width: number
  type: 'text' | 'number'
}

/** Keys of the columns that the list filters search on. */
export type FilterKey = 'ottkNo' | 'entityId' | 'dealId' | 'ottkStatDesc'

export type Filters = Record<FilterKey, string>

export type RequestColumnKey =
  | 'startDate'
  | 'endDate'
  | 'expEndDate'
  | 'amount'
  | 'requestType'
  | 'companyCode'
  | 'beneficiary'
  | 'beneficiaryName'
  | 'requestNo'
  | 'create'

export type RequestColumn = {
  key: RequestColumnKey
  label: string
  width: number
  type: 'date' | 'number' | 'requestType' | 'text' | 'action'
}

/** The date columns, which are the only ones the calendar attaches to. */
export type DateField = 'startDate' | 'endDate' | 'expEndDate'

/**
 * A row being edited in the modal. Drafts start as copies of the record's stored lines (or
 * blank), and are written back onto the record once a request number is minted.
 */
export type RequestDraft = {
  id: string
  startDate: string
  endDate: string
  expEndDate: string
  amount: number | string
  requestType: string
  companyCode: string
  beneficiary: string
  beneficiaryName: string
  requestNo: string
}

/** Text fields of a draft the modal edits directly. */
export type DraftTextField = DateField | 'amount' | 'companyCode'

/** Which date popup is open, and what it is currently showing — one at a time, as in the original. */
export type CalendarState = {
  rowId: string
  field: DateField
  mode: 'days' | 'years'
  viewDate: Date
  viewYear: number
}

export type SortState = { index: number; direction: 'asc' | 'desc' }

export type Toast = {
  id: number
  icon: string
  title: string
  message: string
}
