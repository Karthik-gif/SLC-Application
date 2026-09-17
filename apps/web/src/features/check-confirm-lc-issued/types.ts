export type LcRow = {
  id: number
  companyCode: string
  activity: string
  applicant: string
  dealId: string
  enteredOn: string
  lcTxn: string
  lcAmount: number
  currency: string
  startDate: string
  endDate: string
  bank: string
  totalAmount: number
  beneficiary: string
  settled: boolean
}

/** Every field the grid shows; the rest of `LcRow` drives filtering, not columns. */
export type LcColumnKey = Exclude<keyof LcRow, 'id' | 'companyCode' | 'settled'>

export type LcColumn = {
  key: LcColumnKey
  label: string
  width: number
  /** Right-aligned and thousands-separated, and sorted numerically. */
  number?: boolean
  /** Sorted as a DD-MM-YYYY date rather than as text. */
  date?: boolean
}

export type CompanyOption = {
  code: string
  label: string
}

export type StatusFilter = 'CONTRACT' | 'SETTLED'

export type SortDirection = 'asc' | 'desc'
