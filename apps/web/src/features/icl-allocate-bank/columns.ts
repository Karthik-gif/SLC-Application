import type { IclRequest } from './types.ts'

/**
 * The grid's 14 columns, ported verbatim from the original's `columns` array — including
 * each fixed pixel width, which the legacy header applies inline and which keeps the
 * sortable header cells aligned with the body.
 */
export type RequestColumn = {
  key: keyof IclRequest
  label: string
  width: number
  status?: boolean
  number?: boolean
}

export const COLUMNS: readonly RequestColumn[] = [
  { key: 'statusCode', label: 'Status', width: 58, status: true },
  { key: 'statusDescription', label: 'ICL Request Status Description', width: 215 },
  { key: 'productDescription', label: 'ICL Given Prd Desc', width: 170 },
  { key: 'requestorCompany', label: 'Requestor Co Name', width: 220 },
  { key: 'requestNo', label: 'ICL Request No', width: 110 },
  { key: 'amount', label: 'Amount', width: 120, number: true },
  { key: 'currency', label: 'Currency', width: 76 },
  { key: 'requestDate', label: 'Request Date', width: 100 },
  { key: 'requestedBy', label: 'Requested By', width: 145 },
  { key: 'startDate', label: 'Start Date', width: 100 },
  { key: 'endDate', label: 'End Date', width: 100 },
  { key: 'partnerBankId', label: 'Partner Bank ID', width: 110 },
  { key: 'iclGivenTxn', label: 'ICL Given Txn', width: 110 },
  { key: 'ottkNo', label: 'OTTK No', width: 90 },
]
