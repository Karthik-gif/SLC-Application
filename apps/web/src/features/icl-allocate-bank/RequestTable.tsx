import { COLUMNS } from './columns.ts'
import { money, statusGlyph } from './helpers.ts'
import type { IclRequest, SortState } from './types.ts'

export type RequestTableProps = {
  resultsOpen: boolean
  recordCount: string
  onApprove: () => void
  onReject: () => void
  onApproveAll: () => void
  approveDisabled: boolean
  selectionCount: number
  rows: readonly IclRequest[]
  hasDate: boolean
  selected: Record<string, boolean>
  onToggleRow: (requestNo: string) => void
  allChecked: boolean
  onToggleAll: () => void
  sort: SortState
  onSort: (index: number) => void
  page: number
  pageCount: number
  onPage: (page: number | 'prev' | 'next') => void
}

/** The results area: toolbar, sortable request grid and pagination bar. */
export function RequestTable({
  resultsOpen,
  recordCount,
  onApprove,
  onReject,
  onApproveAll,
  approveDisabled,
  selectionCount,
  rows,
  hasDate,
  selected,
  onToggleRow,
  allChecked,
  onToggleAll,
  sort,
  onSort,
  page,
  pageCount,
  onPage,
}: RequestTableProps) {
  const pageStart = Math.max(1, page - 1)
  const pageEnd = Math.min(pageCount, pageStart + 2)
  const pageButtons: number[] = []
  for (let p = Math.max(1, pageEnd - 2); p <= pageEnd; p++) pageButtons.push(p)

  return (
    <div id="resultsArea" className={resultsOpen ? 'open' : ''}>
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="record-count">{recordCount}</span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" type="button" disabled={approveDisabled} onClick={onApprove}>
            Approve ICL Request
          </button>
          <button className="btn" type="button" onClick={onReject}>
            Reject ICL Request
          </button>
          <button className="btn" type="button" disabled={approveDisabled} onClick={onApproveAll}>
            Approve All ICL Requests
          </button>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div className="card-title">ICL Requests</div>
          <div className="card-meta">{selectionCount} selected</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th className="check-cell" style={{ width: 42 }}>
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allChecked}
                    onChange={onToggleAll}
                  />
                </th>
                {COLUMNS.map((column, index) => {
                  let cls = 'sortable-head'
                  if (sort.index === index) cls += sort.direction === 'asc' ? ' sort-asc' : ' sort-desc'
                  return (
                    <th
                      key={column.key}
                      className={cls}
                      style={{ width: column.width }}
                      onClick={() => onSort(index)}
                    >
                      {column.label}
                      <span className="sort-arrows">
                        <span className="sort-up" />
                        <span className="sort-down" />
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="empty">
                    {hasDate ? 'No ICL requests match the current filters.' : 'Enter Upto Request Date to load ICL requests.'}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const checked = !!selected[row.requestNo]
                  return (
                    <tr key={row.requestNo} className={checked ? 'selected' : ''} onClick={() => onToggleRow(row.requestNo)}>
                      <td className="check-cell">
                        <input
                          className="row-check"
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleRow(row.requestNo)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </td>
                      {COLUMNS.map((column) => {
                        if (column.status) {
                          const glyph = statusGlyph(row.statusCode)
                          return (
                            <td key={column.key} className="status-cell">
                              <span className={glyph.className} title={glyph.title} />
                            </td>
                          )
                        }
                        if (column.number) {
                          return (
                            <td key={column.key} className="number">
                              {money(row[column.key] as number)}
                            </td>
                          )
                        }
                        return <td key={column.key}>{String(row[column.key] ?? '')}</td>
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-bar">
          <button className="page-btn" type="button" disabled={page === 1} onClick={() => onPage('prev')}>
            Previous
          </button>
          {pageButtons.map((p) => (
            <button
              key={p}
              className={p === page ? 'page-btn active' : 'page-btn'}
              type="button"
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" type="button" disabled={page === pageCount} onClick={() => onPage('next')}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
