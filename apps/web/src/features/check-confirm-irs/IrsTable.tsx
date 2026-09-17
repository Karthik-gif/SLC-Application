import { money } from './format.ts'
import type { IrsColumn, IrsRecord, SortDirection } from './types.ts'

export type IrsTableProps = {
  columns: readonly IrsColumn[]
  rows: readonly IrsRecord[]
  page: number
  pageSize: number
  selectedId: number | null
  sortIndex: number
  sortDirection: SortDirection
  onSort(index: number): void
  onSelect(id: number): void
  onViewCashflow(id: number): void
  onPageChange(page: number): void
}

export function IrsTable(props: IrsTableProps) {
  const { columns, rows, page, pageSize, selectedId, sortIndex, sortDirection } = props
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pages)
  const start = (currentPage - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  return (
    <>
      <div className="table-wrap">
        <table id="irsTable" className="data-table">
          <thead id="irsHead">
            <tr>
              <th style={{ width: 64 }}>Select</th>
              <th style={{ width: 95 }}>View</th>
              {columns.map((column, index) => {
                const cls =
                  sortIndex === index ? (sortDirection === 'asc' ? 'sort-asc' : 'sort-desc') : ''
                return (
                  <th
                    key={column.key}
                    className={cls}
                    style={{ width: column.width }}
                    onClick={() => props.onSort(index)}
                  >
                    {column.label}
                    <span className="sort-arrows">
                      <span className="sort-up"></span>
                      <span className="sort-down"></span>
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody id="irsBody">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="empty">
                  No IRS records match the current selection.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                let cls = row.settled ? 'settled' : ''
                if (String(row.id) === String(selectedId)) cls += (cls ? ' ' : '') + 'selected'
                return (
                  <tr key={row.id} data-id={row.id} className={cls} onClick={() => props.onSelect(row.id)}>
                    <td className="select-cell">
                      <input
                        type="radio"
                        name="irsPick"
                        value={row.id}
                        checked={String(row.id) === String(selectedId)}
                        onChange={() => props.onSelect(row.id)}
                      />
                    </td>
                    <td className="view-cell">
                      <button
                        className="cashflow-link"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          props.onViewCashflow(row.id)
                        }}
                      >
                        &#8595; Cashflow
                      </button>
                    </td>
                    {columns.map((column) => {
                      const value = row[column.key]
                      const numeric = column.type === 'number' || column.type === 'rate'
                      return (
                        <td key={column.key} className={numeric ? 'number' : ''}>
                          {column.type === 'number' ? money(value) : value}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <PaginationBar page={currentPage} pages={pages} onPageChange={props.onPageChange} />
    </>
  )
}

function PaginationBar({
  page,
  pages,
  onPageChange,
}: {
  page: number
  pages: number
  onPageChange(page: number): void
}) {
  const startPage = Math.max(1, Math.min(page - 1, pages - 2))
  const clampedStart = Math.max(1, startPage)
  const endPage = Math.min(pages, clampedStart + 2)
  const finalStart = Math.max(1, endPage - 2)
  const numbers: number[] = []
  for (let p = finalStart; p <= endPage; p++) numbers.push(p)

  return (
    <div id="paginationBar" className="pagination-bar">
      <button
        className="page-btn"
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        &lt;
      </button>
      {numbers.map((p) => (
        <button
          key={p}
          className={p === page ? 'page-btn active' : 'page-btn'}
          type="button"
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="page-btn"
        type="button"
        disabled={page === pages}
        onClick={() => onPageChange(Math.min(pages, page + 1))}
      >
        &gt;
      </button>
    </div>
  )
}
