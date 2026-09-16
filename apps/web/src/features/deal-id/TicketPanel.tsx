import { useMemo, useState } from 'react'
import { looseMatch } from '@slc/api-client'
import type { Col } from './columns.tsx'

export type FilterOption = { value: string; label: string }

export type FilterDef<Row> = {
  id: string
  allLabel: string
  options: FilterOption[]
  match: (row: Row, value: string) => boolean
}

export type TicketPanelProps<Row> = {
  title: string
  searchPlaceholder: string
  rows: readonly Row[]
  columns: Array<Col<Row>>
  filters: Array<FilterDef<Row>>
  rowKey: (row: Row) => string
  selectedKey: string | undefined
  onSelect: (row: Row) => void
  emptyColSpan: number
  onFiltersCleared: () => void
}

/**
 * One ticket list panel, reproducing legacy/Deal ID.html's <section class="panel"> exactly:
 * the head with its title, record count, search box and funnel button; the collapsible
 * .advanced-filters strip; the scrolling table; and the "Showing x of y" foot.
 *
 * The markup and class names are the original's, because deal-id.legacy.css is the
 * original's stylesheet. Swapping in a generic table component changes the appearance.
 */
export function TicketPanel<Row extends Record<string, unknown>>({
  title,
  searchPlaceholder,
  rows,
  columns,
  filters,
  rowKey,
  selectedKey,
  onSelect,
  emptyColSpan,
  onFiltersCleared,
}: TicketPanelProps<Row>) {
  const [search, setSearch] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hits = useMemo(() => {
    const query = search.toLowerCase()
    return rows.filter((row) => {
      // The free-text box matches against every value in the row, as the legacy did.
      const hay = Object.values(row).join(' ').toLowerCase()
      if (!hay.includes(query)) return false
      return filters.every((filter) => {
        const value = values[filter.id]
        return !value || filter.match(row, value)
      })
    })
  }, [rows, filters, values, search])

  const clear = () => {
    setSearch('')
    setValues({})
    onFiltersCleared()
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <span className="panel-title">{title}</span>{' '}
          <span className="panel-meta">{hits.length} records</span>
        </div>
        <div className="panel-tools">
          <input
            className="search"
            value={search}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            className={filtersOpen ? 'tool filter-btn active' : 'tool filter-btn'}
            title="Filter"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={filtersOpen ? 'advanced-filters open' : 'advanced-filters'}>
        <span className="filter-label">Filter by</span>
        {filters.map((filter) => (
          <select
            key={filter.id}
            aria-label={filter.allLabel}
            value={values[filter.id] ?? ''}
            onChange={(event) => setValues((current) => ({ ...current, [filter.id]: event.target.value }))}
          >
            <option value="">{filter.allLabel}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        <button type="button" className="filter-reset-btn" onClick={clear}>
          Clear filters
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hits.length === 0 ? (
              <tr>
                <td colSpan={emptyColSpan} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No records
                </td>
              </tr>
            ) : (
              hits.map((row) => {
                const key = rowKey(row)
                return (
                  <tr
                    key={key}
                    className={key === selectedKey ? 'selected' : undefined}
                    onClick={() => onSelect(row)}
                  >
                    {columns.map((column) => (
                      <td key={column.header} className={column.className}>
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="panel-foot">
        Showing {hits.length} of {rows.length}
      </div>
    </section>
  )
}

/**
 * Distinct values of a field as dropdown options, labelled "CODE — description" when a
 * description field is given — the legacy fillFilterSelect(). Options come from the loaded
 * rows, so a filter never offers a value that would return nothing.
 */
export function derivedOptions<Row extends Record<string, unknown>>(
  rows: readonly Row[],
  field: keyof Row & string,
  textField?: keyof Row & string,
): FilterOption[] {
  const seen = new Map<string, string>()
  for (const row of rows) {
    const value = row[field]
    if (value === undefined || value === null || value === '') continue
    const key = String(value)
    if (seen.has(key)) continue
    const text = textField ? row[textField] : undefined
    seen.set(key, text ? `${key} — ${String(text)}` : key)
  }
  return [...seen.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, label]) => ({ value, label }))
}

/** Exact-match on a code field; used by the type and bank filters. */
export function exact<Row>(field: keyof Row & string) {
  return (row: Row, value: string) => String(row[field] ?? '') === value
}

/** The forgiving contains-match the legacy filters used. */
export function loose<Row>(field: keyof Row & string) {
  return (row: Row, value: string) => looseMatch(value, row[field])
}
