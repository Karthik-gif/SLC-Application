import { valueText } from './logic.ts'
import type { IndexedRow, SblcColumn, SortState } from './types.ts'

export type ResultsPanelProps = {
  open: boolean
  columns: SblcColumn[]
  recordCount: number
  keyDate: string
  terminateDisabled: boolean
  dmsDisabled: boolean
  onTerminateClick: () => void
  onDmsClick: () => void
  sort: SortState
  onSortColumn: (columnIndex: number) => void
  pageRows: IndexedRow[]
  selectedIndex: number
  onSelectRow: (index: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ResultsPanel(props: ResultsPanelProps) {
  const {
    open,
    columns,
    recordCount,
    keyDate,
    terminateDisabled,
    dmsDisabled,
    onTerminateClick,
    onDmsClick,
    sort,
    onSortColumn,
    pageRows,
    selectedIndex,
    onSelectRow,
    page,
    totalPages,
    onPageChange,
  } = props

  const totalWidth = 64 + columns.reduce((sum, c) => sum + (Number(c.width) || 100), 0)

  const pageStart = Math.max(1, Math.min(page, totalPages) - 1)
  const pageEnd = Math.min(totalPages, pageStart + 2)
  const pageStartClamped = Math.max(1, pageEnd - 2)
  const pageButtons: number[] = []
  for (let p = pageStartClamped; p <= pageEnd; p++) pageButtons.push(p)

  return (
    <div id="resultsArea" className={'results' + (open ? ' open' : '')}>
      <div className="toolbar">
        <div className="toolbar-left">
          <span id="recordCount" className="record-count">
            {open ? `${recordCount} record${recordCount === 1 ? '' : 's'} found` : ''}
          </span>
        </div>
        <div className="toolbar-right">
          <button id="terminateBtn" className="btn btn-primary" type="button" disabled={terminateDisabled} onClick={onTerminateClick}>
            SBLC Initiate Termination
          </button>
          <button id="dmsBtn" className="btn" type="button" disabled={dmsDisabled} onClick={onDmsClick}>
            DMS
          </button>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div className="card-title">SBLC Records</div>
          <div id="tableMeta" className="card-meta">
            {open ? `Key Date - ${keyDate}` : ''}
          </div>
        </div>
        <div className="table-wrap">
          <table id="requestTable" className="data-table" style={{ minWidth: totalWidth }}>
            <thead id="requestHead">
              <tr>
                <th className="select-cell" style={{ minWidth: 64 }}>
                  Select
                </th>
                {columns.map((column, i) => {
                  const cls = sort.index === i ? (sort.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''
                  return (
                    <th key={column.key} className={cls} style={{ minWidth: column.width }} onClick={() => onSortColumn(i)}>
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
                    No SBLC records match the current selection.
                  </td>
                </tr>
              ) : (
                pageRows.map((item) => (
                  <tr key={item.index} className={item.index === selectedIndex ? 'selected' : ''} onClick={() => onSelectRow(item.index)}>
                    <td className="select-cell">
                      <input
                        className="row-radio"
                        type="radio"
                        name="sblcRowSelect"
                        checked={item.index === selectedIndex}
                        onChange={() => onSelectRow(item.index)}
                      />
                    </td>
                    {columns.map((column) =>
                      column.key === 'sblcInitiateTermination' ? (
                        <td key={column.key}>
                          {item.row.terminationState === 'TERMINATED' ? (
                            <span className="termination-done">Terminated</span>
                          ) : (
                            <span className="termination-pending">Pending</span>
                          )}
                        </td>
                      ) : (
                        <td key={column.key} className={column.type === 'amount' ? 'number' : undefined}>
                          {valueText(item.row, column)}
                        </td>
                      ),
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div id="paginationBar" className="pagination">
          <button className="page-btn" type="button" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
            &lt;
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
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
