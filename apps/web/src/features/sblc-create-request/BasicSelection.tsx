import { ComboField } from './ComboField.tsx'
import { comboValues } from './records.ts'
import type { FilterKey, Filters, SblcRecord } from './types.ts'

type ComboSpec = {
  name: string
  label: string
  key: FilterKey
  shellClassName?: string | undefined
}

/** The four filters, in the order the original's grid lays them out. */
const COMBOS: readonly ComboSpec[] = [
  { name: 'ottk', label: 'OTTK No', key: 'ottkNo' },
  { name: 'entity', label: 'Entity ID', key: 'entityId' },
  { name: 'deal', label: 'Deal ID', key: 'dealId' },
  { name: 'status', label: 'OTTK Status', key: 'ottkStatDesc', shellClassName: 'status-combo' },
]

type BasicSelectionProps = {
  records: readonly SblcRecord[]
  structures: readonly string[]
  structure: string
  filters: Filters
  filtersOpen: boolean
  openCombo: FilterKey | null
  onStructureChange: (structure: string) => void
  onFilterChange: (key: FilterKey, value: string) => void
  onFiltersOpenChange: (open: boolean) => void
  onOpenComboChange: (key: FilterKey | null) => void
  onClearFilters: () => void
}

export function BasicSelection({
  records,
  structures,
  structure,
  filters,
  filtersOpen,
  openCombo,
  onStructureChange,
  onFilterChange,
  onFiltersOpenChange,
  onOpenComboChange,
  onClearFilters,
}: BasicSelectionProps) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Basic Selection</div>
      </div>
      <div className="card-body">
        <div className="selection-main-row">
          <div className="field-inline">
            <label htmlFor="tsfStructure">
              TSF Structure <span className="required">*</span>
            </label>
            <select
              id="tsfStructure"
              className="select structure-select"
              required
              value={structure}
              onChange={(event) => onStructureChange(event.target.value)}
            >
              <option value="">Select TSF Structure</option>
              {structures.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            id="filterToggle"
            className="filter-icon-btn"
            type="button"
            title="Filters"
            aria-label="Filters"
            onClick={() => onFiltersOpenChange(!filtersOpen)}
          />
          <div id="filterBody" className={filtersOpen ? 'filter-body open' : 'filter-body'}>
            <div className="filter-grid">
              {COMBOS.map((combo) => (
                <ComboField
                  key={combo.key}
                  name={combo.name}
                  label={combo.label}
                  value={filters[combo.key]}
                  options={comboValues(records, structure, combo.key, filters[combo.key])}
                  open={openCombo === combo.key}
                  shellClassName={combo.shellClassName}
                  onChange={(value) => onFilterChange(combo.key, value)}
                  onOpenChange={(open) => onOpenComboChange(open ? combo.key : null)}
                />
              ))}
              <div className="filter-item">
                <button
                  id="clearFilters"
                  className="btn btn-ghost"
                  type="button"
                  onClick={onClearFilters}
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
