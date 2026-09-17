/** A code/name pair as the legacy selects render it: "code name" or "code - name". */
export type CodeName = { code: string; name: string }

export type DocumentType = { code: string; desc: string }

export type BusinessPartner = CodeName & { bankType: string }

/** One row of the DMS grid, per document type, per limit record. */
export type LimitDocument = {
  /** Display form, DD-MM-YYYY, because the grid edits it as text. */
  date: string
  fileName: string
  uploaded: boolean
  dmsCode: string
  /** Held only so Download can hand the same file back; never persisted. */
  file?: File | undefined
}

export type LimitRecord = {
  companyCode: string
  bankType: string
  bpCode: string
  bpName: string
  limitType: string
  limitLevelCheck: string
  /** ISO YYYY-MM-DD; the screen renders DD-MM-YYYY. */
  startDate: string
  endDate: string
  amount: number
  statusCode: string
  documents: Record<string, LimitDocument>
  emailNote?: string | undefined
}

export type ToastKind = '' | 'success' | 'warning' | 'error'

export type ToastItem = { id: number; kind: ToastKind; message: string }

export type MainColumn = {
  key: keyof LimitRecord
  label: string
  width: number
  number?: boolean | undefined
}
