import { fmtDate, fmtNum } from '@slc/api-client'
import { distinctValues, filterRows, rowKey, subtotal } from './fields.ts'
import type { TfFilters, TrdFlowRow } from './types.ts'

/**
 * The legacy #tfTable columns in their original order. `kind` drives formatting only; the
 * header text is copied from the original thead verbatim.
 */
const COLUMNS: ReadonlyArray<{ label: string; field: keyof TrdFlowRow; kind?: 'date' | 'num' }> = [
  { label: 'Trade Flow ID', field: 'ZtfNo' },
  { label: 'TF Split ID', field: 'ZtfSplit' },
  { label: 'TF Upload Date', field: 'ZtfDate', kind: 'date' },
  { label: 'Business Unit Name', field: 'Zbu' },
  { label: 'Operator', field: 'Zoprtr' },
  { label: 'BL-Vessel Name', field: 'ZblVsslName' },
  { label: 'BU Commodity', field: 'Zcmmd' },
  { label: 'P - Contract Number', field: 'ZconNum1' },
  { label: 'Purchase Incoterms', field: 'ZpurInc' },
  { label: 'Payment terms - Purchase Side', field: 'Zpaypur' },
  { label: 'Banks-Purchase Leg-Seller Bank', field: 'Zbplsb' },
  { label: 'Banks-Purchase Leg-Buyer Bank', field: 'Zbplbb' },
  { label: 'S Contract Number', field: 'ZconNum2' },
  { label: 'Sales Incoterms', field: 'Zsalesinc' },
  { label: 'Payment terms - Sales Side', field: 'Zptss' },
  { label: 'Banks-Sale Leg-Seller Bank', field: 'Zbslsb' },
  { label: 'Banks-Sale Leg-Buyer Bank', field: 'Zbslbb' },
  { label: 'OGA Title From - Date', field: 'Zotfd', kind: 'date' },
  { label: 'OGA Title Till - Date', field: 'Zottd', kind: 'date' },
  { label: 'Quantity', field: 'Zquantity', kind: 'num' },
  { label: 'Contract Price', field: 'Zcprice', kind: 'num' },
  { label: 'CMP (MT)', field: 'Zunit', kind: 'num' },
  { label: 'Contract Amt(USD)', field: 'Zttv', kind: 'num' },
  { label: 'Port of Loading', field: 'Zpol' },
  { label: 'Port of Destination', field: 'Zpod' },
  { label: 'Sailing Date', field: 'Zsldate', kind: 'date' },
  { label: 'BL Number', field: 'Zblno' },
  { label: 'Number of Days', field: 'Zdays' },
  { label: 'ETA at Discharge Port', field: 'ZetaDsPort', kind: 'date' },
]

/** The legacy filter dropdowns that have a TrdFlow field behind them. */
const FILTERS: ReadonlyArray<{ id: string; key: keyof TfFilters; all: string }> = [
  { id: 'filterBu', key: 'Zbu', all: 'All BU' },
  { id: 'filterCommodity', key: 'Zcmmd', all: 'All Commodities' },
  { id: 'filterTfStatus', key: 'ZflwSts', all: 'All TF Status' },
  { id: 'filterOgbsStatus', key: 'ZogbsStatId', all: 'All OGBS Status' },
]

function cell(row: TrdFlowRow, col: (typeof COLUMNS)[number]): string {
  const raw = row[col.field]
  if (raw === undefined || raw === null || raw === '') return ''
  if (col.kind === 'date') return fmtDate(String(raw))
  if (col.kind === 'num') return fmtNum(Number(raw))
  return String(raw)
}

export type TfTableProps = {
  rows: readonly TrdFlowRow[]
  filters: TfFilters
  onFiltersChange: (filters: TfFilters) => void
  showFilters: boolean
  onToggleFilters: () => void
  onClearFilters: () => void
  keyDate: string
  onKeyDateChange: (value: string) => void
  selected: TrdFlowRow | null
  onSelect: (row: TrdFlowRow) => void
}

export function TfTable({
  rows,
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  keyDate,
  onKeyDateChange,
  selected,
  onSelect,
}: TfTableProps) {
  const visible = filterRows(rows, filters)
  const selectedKey = selected ? rowKey(selected) : null

  return (
    <section className="ds-panel">
      <div className="panel-title">List of Trade Flows</div>

      <div className="toolstrip">
        <div className="ws-field">
          <label htmlFor="mainKeyDate">Key Date</label>
          <div className="date-field-wrap">
            <input
              type="text"
              id="mainKeyDate"
              placeholder="DD-MM-YYYY"
              value={keyDate}
              onChange={(event) => onKeyDateChange(event.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          className="hdr-btn icon-btn"
          id="btnToggleMainFilters"
          title="Filters"
          onClick={onToggleFilters}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M2 3h12l-4.5 5.2v3.6l-3 1.4V8.2z" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={showFilters ? 'toolstrip' : 'toolstrip hidden'} id="mainFiltersRow">
        <span className="field-hint filter-by-label">Filter by</span>
        {FILTERS.map((filter) => (
          <select
            key={filter.id}
            id={filter.id}
            value={filters[filter.key]}
            onChange={(event) =>
              onFiltersChange({ ...filters, [filter.key]: event.target.value })
            }
          >
            <option value="">{filter.all}</option>
            {distinctValues(rows, filter.key as keyof TrdFlowRow).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        ))}
        {/* No TrdFlow field behind these three, so they stay visible but inert. */}
        <select id="filterBlockedStatus" disabled title="No SAP source for this filter yet">
          <option value="">All Blocked Status</option>
        </select>
        <label className="field-check main-filter-check">
          <input type="checkbox" id="filterIncludeExpired" style={{ width: 'auto' }} disabled />
          Include Expired TFs
        </label>
        <label className="field-check main-filter-check">
          <input type="checkbox" id="filterIncludeDeleted" style={{ width: 'auto' }} disabled />
          Include Deleted TFs
        </label>
        <button type="button" className="hdr-btn" id="btnClearMainFilters" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>

      <div className="table-scroll">
        {/* The original pins this at min-width:4200px, which leaves most columns empty and
            forces a long horizontal scroll. Dropped so the columns size to their content;
            the stylesheet's own 1400px floor on .data-table still applies. This is a
            deliberate departure from the original, asked for explicitly. */}
        <table className="data-table" id="tfTable">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.field}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody id="tfTableBody">
            {visible.map((row) => {
              const key = rowKey(row)
              const id = key ? `${key.ZtfNo}-${key.ZtfSplit}` : ''
              const isSelected =
                key !== null &&
                selectedKey !== null &&
                key.ZtfNo === selectedKey.ZtfNo &&
                key.ZtfSplit === selectedKey.ZtfSplit
              return (
                <tr
                  key={id}
                  className={isSelected ? 'row-selected' : undefined}
                  onClick={() => onSelect(row)}
                >
                  {COLUMNS.map((col) => (
                    <td key={col.field}>{cell(row, col)}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="toolstrip">
        <span className="field-hint">
          Showing {visible.length} of {rows.length}
        </span>
        <span className="field-hint">Contract Amt subtotal: {fmtNum(subtotal(visible))}</span>
      </div>
    </section>
  )
}
