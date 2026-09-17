import { valueText, statusInfo } from './format.ts'
import type { IclColumn, IndexedRow, SortState } from './types.ts'

type ResultsTableProps = {
  open: boolean
  columns: IclColumn[]
  pageRows: IndexedRow[]
  totalRows: number
  selectedIndex: number
  onSelectRow: (index: number) => void
  sort: SortState
  onSort: (columnIndex: number) => void
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  selectionLabel: string
  createDisabled: boolean
  dmsDisabled: boolean
  onCreateReceived: () => void
  onOpenDms: () => void
}

/** The results toolbar, request table and pagination bar (`#resultsArea` in the original). */
export function ResultsTable({
  open,
  columns,
  pageRows,
  totalRows,
  selectedIndex,
  onSelectRow,
  sort,
  onSort,
  page,
  pageCount,
  onPageChange,
  selectionLabel,
  createDisabled,
  dmsDisabled,
  onCreateReceived,
  onOpenDms,
}: ResultsTableProps) {
  const totalWidth = columns.reduce((sum, c) => sum + (Number(c.width) || 100), 0) + 64

  const pageButtons: number[] = []
  const start = Math.max(1, Math.min(page - 1, pageCount - 2))
  const end = Math.min(pageCount, start + 2)
  const clampedStart = Math.max(1, end - 2)
  for (let p = clampedStart; p <= end; p++) pageButtons.push(p)

  return (
    <div id="resultsArea" className={'results' + (open ? ' open' : '')}>
      <div className="toolbar">
        <div className="toolbar-left">
          <span id="recordCount" className="record-count">
            {totalRows + ' request' + (totalRows === 1 ? '' : 's') + ' found'}
          </span>
        </div>
        <div className="toolbar-right">
          <button
            id="createReceivedBtn"
            className="btn btn-primary"
            type="button"
            disabled={createDisabled}
            onClick={onCreateReceived}
          >
            Create ICL Received Txn
          </button>
          <button id="dmsBtn" className="btn" type="button" disabled={dmsDisabled} onClick={onOpenDms}>
            DMS
          </button>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div className="card-title">ICL Received Requests</div>
          <div id="selectionCount" className="card-meta">
            {selectionLabel}
          </div>
        </div>
        <div className="table-wrap">
          <table id="requestTable" className="data-table" style={{ minWidth: totalWidth + 'px' }}>
            <thead id="requestHead">
              <tr>
                <th className="select-cell" style={{ minWidth: '64px', cursor: 'default' }}>
                  Select
                </th>
                {columns.map((column, i) => {
                  const cls = sort.index === i ? (sort.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''
                  return (
                    <th
                      key={column.key}
                      className={cls}
                      style={{ minWidth: column.width + 'px' }}
                      onClick={() => onSort(i)}
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
            <tbody id="requestBody">
              {pageRows.length === 0 ? (
                <tr>
                  <td className="empty" colSpan={columns.length + 1}>
                    No ICL requests match the current selection.
                  </td>
                </tr>
              ) : (
                pageRows.map((item) => (
                  <tr
                    key={item.index}
                    className={item.index === selectedIndex ? 'selected' : ''}
                    data-index={item.index}
                    onClick={() => onSelectRow(item.index)}
                  >
                    <td className="select-cell">
                      <input
                        className="row-radio"
                        type="radio"
                        name="iclRowSelect"
                        checked={item.index === selectedIndex}
                        onChange={() => onSelectRow(item.index)}
                      />
                    </td>
                    {columns.map((column) => {
                      if (column.type === 'status') {
                        const info = statusInfo(item.row.statusCode)
                        return (
                          <td key={column.key} className="status-cell">
                            <span className={'status-text status-' + info.kind} title={info.title}>
                              {info.label}
                            </span>
                          </td>
                        )
                      }
                      if (column.type === 'amount' || column.type === 'rate') {
                        return (
                          <td key={column.key} className="number">
                            {valueText(item.row, column)}
                          </td>
                        )
                      }
                      return <td key={column.key}>{valueText(item.row, column)}</td>
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div id="paginationBar" className="pagination">
          <button className="page-btn" type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          {pageButtons.map((p) => (
            <button
              key={p}
              className={'page-btn' + (p === page ? ' active' : '')}
              type="button"
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            type="button"
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
