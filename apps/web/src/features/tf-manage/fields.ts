import type { TfFilters, TrdFlowKey, TrdFlowRow } from './types.ts'

/**
 * One control on a tab. `field` is the TrdFlow property it binds to; a descriptor without
 * one is a legacy control that has no SAP source yet — it is rendered disabled rather than
 * dropped, because the generated stylesheet lays each section out as a fixed-column grid
 * and a missing cell shifts every one after it.
 *
 * `control` and `readOnly` mirror the original element, which the stylesheet styles
 * differently: a <select> is not a text box, and a readonly input is not a disabled one.
 */
export type FieldDescriptor = {
  id: string
  label: string
  field?: keyof TrdFlowRow
  type: 'text' | 'date' | 'number'
  control?: 'input' | 'select'
  readOnly?: boolean
}

/**
 * A `.section-box` within a tab: its heading, the grid class controlling column count, and
 * its fields. The legacy page varies the column count per section — grid6, grid5, grid4,
 * grid3 — so a single shared grid class misaligns every tab but one.
 */
export type Section = {
  heading: string
  /** The legacy grid modifier: 'grid6' | 'grid5' | 'grid4' | 'grid3' | 'single' | ''. */
  grid: string
  fields: readonly FieldDescriptor[]
}

export const BASIC_SECTIONS: readonly Section[] = [
  {
    heading: 'Basic Data',
    grid: 'grid6',
    fields: [
      { id: 'bdBu', label: 'BU', field: 'Zbu', type: 'text', readOnly: true },
      { id: 'bdBuCode', label: 'BU Code', type: 'text', readOnly: true },
      { id: 'bdGtCommod', label: 'GT Commodity', field: 'Zcmmd', type: 'text', control: 'select' },
      { id: 'bdBuCommodity', label: 'BU Commodity', type: 'text', readOnly: true },
      { id: 'bdChild1', label: 'Child Comm: Name 1', type: 'text' },
      { id: 'bdChild2', label: 'Child Comm: Name 2', type: 'text' },
    ],
  },
  {
    heading: 'Invoice Data',
    grid: 'grid5',
    fields: [
      { id: 'idQty', label: 'Qty (MT)', field: 'Zquantity', type: 'number', readOnly: true },
      { id: 'idContractPrice', label: 'Contract Price', field: 'Zcprice', type: 'number' },
      { id: 'idCmp', label: 'Current Market Price(MT)', field: 'Zunit', type: 'number' },
      { id: 'idContractAmt', label: 'Contract Amount', field: 'Zttv', type: 'number', readOnly: true },
      { id: 'idCpmtAmt', label: 'CPMT Amount', type: 'number', readOnly: true },
    ],
  },
  {
    heading: 'Other Data',
    grid: 'grid5',
    fields: [
      { id: 'odTfType', label: 'TF Type', type: 'text', control: 'select' },
      { id: 'odBuContact', label: 'BU Contact Person', type: 'text', readOnly: true },
    ],
  },
]

export const SHIPPING_SECTIONS: readonly Section[] = [
  {
    heading: 'Shipping Data',
    grid: 'grid4',
    fields: [
      { id: 'shVessel', label: 'Vessel Name', field: 'ZblVsslName', type: 'text' },
      { id: 'shBlNumber', label: 'BL Number', field: 'Zblno', type: 'text' },
      { id: 'shSustain', label: 'Sustainability flows', type: 'text' },
      { id: 'shLoadPort', label: 'Load Port', field: 'Zpol', type: 'text' },
      { id: 'shDischargePort', label: 'Discharge Port', field: 'Zpod', type: 'text' },
      { id: 'shTransit', label: 'Transit time', field: 'Zdays', type: 'text', readOnly: true },
      { id: 'shPolCountry', label: 'POL Country', field: 'ZpolCtry', type: 'text' },
      { id: 'shPodCountry', label: 'POD Country', field: 'ZpodCtry', type: 'text' },
      { id: 'shSailingDate', label: 'Sailing Date', field: 'Zsldate', type: 'date' },
      { id: 'shReceiptDate', label: 'Receipt Date', field: 'ZblRcpdt', type: 'date' },
      { id: 'shEta', label: 'ETA at POD', field: 'ZetaDsPort', type: 'date' },
      { id: 'shNotifyParty', label: 'Notify Party', field: 'Znotify', type: 'text' },
    ],
  },
  {
    heading: 'Title With OIL',
    grid: 'grid4',
    fields: [
      { id: 'shFromDate', label: 'From Date', field: 'Zotfd', type: 'date' },
      { id: 'shToDate', label: 'To Date', field: 'Zottd', type: 'date' },
    ],
  },
  {
    heading: 'BL Data',
    grid: 'grid4',
    fields: [
      { id: 'shBlConsignee', label: 'BL Consignee', field: 'Zcob', type: 'text' },
      { id: 'shLcDetails', label: 'LC Details', field: 'Zlc', type: 'text' },
      { id: 'shBl13From', label: 'BL 1/3 From', field: 'Zaobf13', type: 'date' },
      { id: 'shBl13To', label: 'BL 1/3 To', field: 'Zaobt13', type: 'date' },
      { id: 'shBl33From', label: 'BL 3/3 From', field: 'Zaobf33', type: 'date' },
      { id: 'shBl33To', label: 'BL 3/3 To', field: 'Zaobt33', type: 'date' },
    ],
  },
]

export const PURCH_SALES_SECTIONS: readonly Section[] = [
  {
    heading: 'Purchase Leg',
    grid: 'grid3',
    fields: [
      { id: 'plContract', label: 'Purch Contract', field: 'ZconNum1', type: 'text' },
      { id: 'plIncoterms', label: 'Purch Incoterms', field: 'ZpurInc', type: 'text' },
      { id: 'plPayTerms', label: 'Purch Pay Terms', field: 'Zpaypur', type: 'text' },
      { id: 'plSellerBank', label: 'Purch - Seller Bank', field: 'Zbplsb', type: 'text' },
      { id: 'plBuyerBank', label: 'Purch - Buyer Bank', field: 'Zbplbb', type: 'text' },
      { id: 'plSellerLoc', label: 'Seller Location', type: 'text' },
      { id: 'plOriginEntity', label: 'Origin Entity', field: 'Zoentity', type: 'text' },
    ],
  },
  {
    heading: 'Sales Leg',
    grid: 'grid3',
    fields: [
      { id: 'slContract', label: 'Sales Contract', field: 'ZconNum2', type: 'text' },
      { id: 'slIncoterms', label: 'Sales Incoterms', field: 'Zsalesinc', type: 'text' },
      { id: 'slPayTerms', label: 'Sales Pay Terms', field: 'Zptss', type: 'text' },
      { id: 'slSellerBank', label: 'Sales - Seller Bank', field: 'Zbslsb', type: 'text' },
      { id: 'slBuyerBank', label: 'Sales - Buyer Bank', field: 'Zbslbb', type: 'text' },
      { id: 'slBuyerLoc', label: 'Buyer Location', type: 'text' },
    ],
  },
]

export const STATUS_SECTIONS: readonly Section[] = [
  {
    heading: 'Status Details',
    grid: 'grid5',
    fields: [
      {
        id: 'stOgbsStatus',
        label: 'OGBS Status',
        field: 'ZogbsStatId',
        type: 'text',
        control: 'select',
      },
      { id: 'stOgbsRemarks', label: 'OGBS Remarks', type: 'text' },
    ],
  },
  {
    heading: 'Blocked-Allocated Status',
    grid: 'grid5',
    fields: [
      { id: 'stBlockedStatus', label: 'Blocked Status', type: 'text', control: 'select' },
      { id: 'stBlockedAmount', label: 'Amount', type: 'number' },
      { id: 'stBlockedFrom', label: 'Blocked From', type: 'date' },
      { id: 'stBlockedTo', label: 'Blocked To', type: 'date' },
      { id: 'stBlockedRemarks', label: 'Blocked Remarks', type: 'text' },
      { id: 'stTrader', label: 'Trader', type: 'text' },
      { id: 'stCpmtAmount', label: 'CPMT Amount', type: 'number', readOnly: true },
      { id: 'stDealId', label: 'Deal ID', type: 'text', readOnly: true },
      { id: 'stOttkNo', label: 'OTTK No', type: 'text' },
      { id: 'stDttkNo', label: 'DTTK No', type: 'text' },
    ],
  },
  {
    heading: 'TF Status Details',
    grid: 'grid5',
    fields: [
      { id: 'stTfStatus', label: 'TF Status', field: 'ZflwSts', type: 'text', control: 'select' },
      { id: 'stTfExpired', label: 'Tradeflow Expired', type: 'text' },
      { id: 'stTfDeleted', label: 'Tradeflow Deleted', type: 'text' },
      { id: 'stCreatedBy', label: 'Created By', type: 'text', readOnly: true },
      { id: 'stCreatedDate', label: 'Created Date', type: 'date', readOnly: true },
      { id: 'stCreatedTime', label: 'Created Time', type: 'text', readOnly: true },
      { id: 'stChangedBy', label: 'Changed By', type: 'text', readOnly: true },
      { id: 'stChangedDate', label: 'Changed Date', type: 'date', readOnly: true },
      { id: 'stChangedTime', label: 'Changed Time', type: 'text', readOnly: true },
    ],
  },
]

/** Flattened per-tab views, used for save (which fields belong to the open tab). */
export const BASIC_FIELDS: readonly FieldDescriptor[] = BASIC_SECTIONS.flatMap((s) => s.fields)
export const SHIPPING_FIELDS: readonly FieldDescriptor[] = SHIPPING_SECTIONS.flatMap((s) => s.fields)
export const PURCH_SALES_FIELDS: readonly FieldDescriptor[] = PURCH_SALES_SECTIONS.flatMap(
  (s) => s.fields,
)
export const STATUS_FIELDS: readonly FieldDescriptor[] = STATUS_SECTIONS.flatMap((s) => s.fields)

/**
 * Exact, case-insensitive match on each non-empty filter; all must match. Exact rather than
 * substring because every filter is a dropdown whose options are the distinct values
 * already present in the loaded rows — there is nothing partial to type.
 */
export function filterRows(rows: readonly TrdFlowRow[], filters: TfFilters): TrdFlowRow[] {
  const active = Object.entries(filters).filter(([, value]) => value.trim() !== '')
  if (active.length === 0) return [...rows]
  return rows.filter((row) =>
    active.every(([key, value]) => {
      const cell = row[key as keyof TrdFlowRow]
      if (cell === undefined || cell === null) return false
      return String(cell).toLowerCase() === value.trim().toLowerCase()
    }),
  )
}

/**
 * The distinct non-empty values of one field across the rows, sorted — the option list for
 * that field's dropdown. The legacy page filled these from DUMMY_MASTER_DATA; here they come
 * from the data actually loaded, so an option can never select an empty result.
 */
export function distinctValues(rows: readonly TrdFlowRow[], field: keyof TrdFlowRow): string[] {
  const seen = new Set<string>()
  for (const row of rows) {
    const value = row[field]
    if (value === undefined || value === null || value === '') continue
    seen.add(String(value))
  }
  return [...seen].sort()
}

/** Sums the contract amount. Rows without one contribute nothing rather than NaN. */
export function subtotal(rows: readonly TrdFlowRow[]): number {
  return rows.reduce((sum, row) => sum + (Number.isFinite(row.Zttv) ? Number(row.Zttv) : 0), 0)
}

/** The composite key, or null when the row cannot address itself. */
export function rowKey(row: TrdFlowRow): TrdFlowKey | null {
  if (!row.ZtfNo || !row.ZtfSplit) return null
  return { ZtfNo: row.ZtfNo, ZtfSplit: row.ZtfSplit }
}
