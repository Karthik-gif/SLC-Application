import { SBLC_COLUMNS } from './data.ts'
import { money } from './format.ts'
import type { SblcRecord, SortState } from './types.ts'

type ResultsTableProps = {
  open: boolean
  rows: readonly SblcRecord[]
  pageRows: readonly SblcRecord[]
  page: number
  pages: number
  sort: SortState | null
  selectedId: number | null
  selectionMeta: string
  onSort: (index: number) => void
  onSelect: (id: number) => void
  onPage: (page: number) => void
  onCreateRequest: () => void
}

/** The three page buttons the original keeps around the current one. */
function pageWindow(page: number, pages: number): number[] {
  const end = Math.min(pages, Math.max(1, page - 1) + 2)
  const start = Math.max(1, end - 2)
  const list: number[] = []
  for (let p = start; p <= end; p += 1) list.push(p)
  return list
}

export function ResultsTable({
  open,
  rows,
  pageRows,
  page,
  pages,
  sort,
  selectedId,
  selectionMeta,
  onSort,
  onSelect,
  onPage,
  onCreateRequest,
}: ResultsTableProps) {
  return (
    <div id="resultsArea" className={open ? 'open' : ''}>
      <div className="toolbar">
        <div className="toolbar-left">
          <span id="recordCount" className="record-count">
            {rows.length} record{rows.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="toolbar-right">
          <button
            id="createRequestBtn"
            className="btn btn-primary"
            type="button"
            disabled={selectedId === null}
            onClick={onCreateRequest}
          >
            Create SBLC Request
          </button>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-head">
          <div className="card-title">SBLC Request Records</div>
          <div id="selectionMeta" className="card-meta">
            {selectionMeta}
          </div>
        </div>
        <div className="table-wrap">
          <table id="mainTable" className="data-table">
            <thead id="mainHead">
              <tr>
                <th style={{ width: '64px' }}>Select</th>
                {SBLC_COLUMNS.map((column, index) => (
                  <th
                    key={column.key}
                    className={
                      sort && sort.index === index
                        ? sort.direction === 'asc'
                          ? 'sort-asc'
                          : 'sort-desc'
                        : ''
                    }
                    style={{ width: `${column.width}px` }}
                    onClick={() => onSort(index)}
                  >
                    {column.label}
                    <span className="sort-arrows">
                      <span className="sort-up" />
                      <span className="sort-down" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="mainBody">
              {pageRows.length ? (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.id === selectedId ? 'selected' : ''}
                    onClick={() => onSelect(row.id)}
                  >
                    <td className="select-cell">
                      <input
                        type="radio"
                        name="sblcPick"
                        value={row.id}
                        checked={row.id === selectedId}
                        onChange={() => onSelect(row.id)}
                      />
                    </td>
                    {SBLC_COLUMNS.map((column) => (
                      <td key={column.key} className={column.type === 'number' ? 'number' : ''}>
                        {column.type === 'number' ? money(row[column.key]) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={SBLC_COLUMNS.length + 1} className="empty">
                    No SBLC request records match the current selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div id="paginationBar" className="pagination-bar">
          <button
            className="page-btn"
            type="button"
            disabled={page === 1}
            onClick={() => onPage(Math.max(1, page - 1))}
          >
            &lt;
          </button>
          {pageWindow(page, pages).map((p) => (
            <button
              key={p}
              className={p === page ? 'page-btn active' : 'page-btn'}
              type="button"
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            type="button"
            disabled={page === pages}
            onClick={() => onPage(Math.min(pages, page + 1))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
