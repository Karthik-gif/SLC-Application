/**
 * The ICL Requests grid, in the original's column order.
 *
 * Header and body are driven from one list because the grid is 27 columns wide and the
 * scoped stylesheet sizes it by position — a body cell that drifted out of step with its
 * header would shift every column after it.
 */

import { ICL_GIVEN_PRD_DESC } from './data.ts'
import { formatAmount } from './format.ts'
import type { IclRequest, SortKey } from './types.ts'

export type IclColumn = {
  key: SortKey
  label: string
  /** Right-aligned, tabular numerals. */
  num?: boolean
  /**
   * Cell contents. The `status` column has none: it is the colour dot, the one cell that
   * is an element rather than text.
   */
  text?: (row: IclRequest, statusDesc: string) => string
}

export const COLUMNS: IclColumn[] = [
  { key: 'status', label: 'Status' },
  { key: 'iclGivenPrdDesc', label: 'ICL Given Prd Desc', text: () => ICL_GIVEN_PRD_DESC },
  {
    key: 'iclReqStatusDesc',
    label: 'ICL Request Status Description',
    text: (row, statusDesc) => `${row.iclReqStatus} - ${statusDesc}`,
  },
  { key: 'entityString', label: 'Entity String', text: (row) => row.entityString },
  { key: 'requestorCoName', label: 'Requestor Co Name', text: (row) => row.requestorCoName },
  { key: 'iclRequestNo', label: 'ICL Request No', text: (row) => row.iclRequestNo },
  { key: 'amount', label: 'Amount', num: true, text: (row) => formatAmount(row.amount) },
  { key: 'currency', label: 'Currency', text: (row) => row.currency },
  { key: 'requestDate', label: 'Request Date', text: (row) => row.requestDate },
  { key: 'ottkNo', label: 'OTTK No', text: (row) => row.ottkNo },
  { key: 'dttkNo', label: 'DTTK No', text: (row) => row.dttkNo },
  { key: 'dealId', label: 'Deal ID', text: (row) => row.dealId },
  { key: 'startDate', label: 'Start Date', text: (row) => row.startDate },
  { key: 'endDate', label: 'End Date', text: (row) => row.endDate },
  { key: 'depositBankName', label: 'Deposit Bank Name', text: (row) => row.depositBankName },
  { key: 'houseBank', label: 'House Bank', text: (row) => row.houseBank },
  { key: 'accountId', label: 'Account ID', text: (row) => row.accountId },
  { key: 'partnerBankId', label: 'Partner Bank ID', text: (row) => row.partnerBankId },
  { key: 'fiscalYear', label: 'Fiscal Year', text: (row) => row.fiscalYear },
  { key: 'docNo', label: 'Doc No', text: (row) => row.docNo },
  { key: 'client', label: 'Client', text: (row) => row.client },
  { key: 'iclGivenCoCode', label: 'ICL Given Co Code', text: (row) => row.iclGivenCoCode },
  { key: 'plannedEndDate', label: 'Planned End Date', text: (row) => row.plannedEndDate },
  { key: 'iclReqStatus', label: 'ICL Req Status', text: (row) => row.iclReqStatus },
  { key: 'slcStructure', label: 'SLC Structure', text: (row) => row.slcStructure },
  { key: 'entityId', label: 'Entity ID', text: (row) => row.entityId },
]

/** Data columns plus the leading Select column, for the empty-state row's colspan. */
export const COLUMN_COUNT = COLUMNS.length + 1
