import type { MainColumn } from './types.ts'

/** The Limits Overview grid, in the original's order and pixel widths. */
export const MAIN_COLUMNS: readonly MainColumn[] = [
  { key: 'limitType', label: 'Limit Type', width: 90 },
  { key: 'bpCode', label: 'BP', width: 110 },
  { key: 'bpName', label: 'BP Name', width: 180 },
  { key: 'startDate', label: 'Start Date', width: 110 },
  { key: 'endDate', label: 'End Date', width: 110 },
  { key: 'amount', label: 'Amount', width: 130, number: true },
  { key: 'statusCode', label: 'Limit Status', width: 270 },
]

/** The DMS grid's header, which the original builds through the same header helper. */
export const DMS_COLUMNS: readonly { label: string; width: number }[] = [
  { label: 'Doc Type', width: 60 },
  { label: 'Doc Type Desc', width: 140 },
  { label: 'Doc Date', width: 135 },
  { label: 'File Path', width: 165 },
  { label: 'DMS Code', width: 95 },
  { label: 'Upload', width: 65 },
  { label: 'Download', width: 75 },
  { label: 'Edit', width: 65 },
]
