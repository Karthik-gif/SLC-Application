import { useEffect, useState } from 'react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { loadTradeFlows, patchTradeFlow } from './api.ts'
import {
  BASIC_FIELDS,
  BASIC_SECTIONS,
  PURCH_SALES_FIELDS,
  PURCH_SALES_SECTIONS,
  SHIPPING_FIELDS,
  SHIPPING_SECTIONS,
  STATUS_FIELDS,
  STATUS_SECTIONS,
  distinctValues,
  rowKey,
} from './fields.ts'
import { FieldGrid } from './FieldGrid.tsx'
import { TfTable } from './TfTable.tsx'
import { EMPTY_FILTERS } from './types.ts'
import type { TfFilters, TrdFlowRow } from './types.ts'
import './tf-manage.legacy.css'

const TABS = [
  { id: 'basicData', label: 'Basic Data', sections: BASIC_SECTIONS, fields: BASIC_FIELDS },
  {
    id: 'shippingData',
    label: 'Shipping Data',
    sections: SHIPPING_SECTIONS,
    fields: SHIPPING_FIELDS,
  },
  {
    id: 'purchSalesData',
    label: 'Purch-Sales Data',
    sections: PURCH_SALES_SECTIONS,
    fields: PURCH_SALES_FIELDS,
  },
  { id: 'statusTab', label: 'Status', sections: STATUS_SECTIONS, fields: STATUS_FIELDS },
] as const

/** Built in Stage 2; they announce that rather than rendering a half-working grid. */
const DEFERRED_TABS = [
  { id: 'blData1', label: 'BL Data 1' },
  { id: 'blData2', label: 'BL Data 2' },
] as const

type TabId = (typeof TABS)[number]['id'] | (typeof DEFERRED_TABS)[number]['id']

/** The mark the legacy header carries, declared locally as the other converted apps do. */
const BRAND_LOGO =
  'https://raw.githubusercontent.com/ryannayak/fs-assets/e82f35a83e28689167b22b4300d4994a249acee0/fs-short-logo.png'

/** ApiError already carries the backend's own message; anything else is stringified. */
function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/** Tab order on screen matches the legacy bar, which interleaves the two deferred tabs. */
const TAB_ORDER: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'basicData', label: 'Basic Data' },
  { id: 'shippingData', label: 'Shipping Data' },
  { id: 'purchSalesData', label: 'Purch-Sales Data' },
  { id: 'blData1', label: 'BL Data 1' },
  { id: 'blData2', label: 'BL Data 2' },
  { id: 'statusTab', label: 'Status' },
]

export default function TfManageApp() {
  const [rows, setRows] = useState<TrdFlowRow[]>([])
  const [filters, setFilters] = useState<TfFilters>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [keyDate, setKeyDate] = useState('')
  const [selected, setSelected] = useState<TrdFlowRow | null>(null)
  const [draft, setDraft] = useState<TrdFlowRow>({})
  const [tab, setTab] = useState<TabId>('basicData')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void refresh()
  }, [])

  async function refresh() {
    setError(undefined)
    setBusy(true)
    try {
      setRows(await loadTradeFlows())
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  function select(row: TrdFlowRow) {
    setSelected(row)
    setDraft({ ...row })
    setSaved(false)
  }

  async function save() {
    if (!selected) return
    const key = rowKey(selected)
    if (!key) {
      setError('This row has no Trade Flow ID and split, so it cannot be updated.')
      return
    }
    const active = TABS.find((t) => t.id === tab)
    if (!active) return

    // Only the current tab's mapped fields are sent; an unmapped control has no field.
    const changes: Partial<TrdFlowRow> = {}
    for (const descriptor of active.fields) {
      const field = descriptor.field
      if (!field) continue
      if (draft[field] !== selected[field]) {
        Object.assign(changes, { [field]: draft[field] })
      }
    }
    if (Object.keys(changes).length === 0) {
      setSaved(true)
      return
    }

    setError(undefined)
    setBusy(true)
    try {
      await patchTradeFlow(key, changes)
      // Keep the edited values on screen and fold them into the list.
      const merged = { ...selected, ...changes }
      setSelected(merged)
      setRows((current) =>
        current.map((row) => {
          const candidate = rowKey(row)
          return candidate && candidate.ZtfNo === key.ZtfNo && candidate.ZtfSplit === key.ZtfSplit
            ? merged
            : row
        }),
      )
      setSaved(true)
    } catch (err) {
      // The draft is deliberately left untouched so nothing typed is lost.
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div className="tfmanage">
      <div className="app-shell">
        <header className="app-header">
          <div className="ds-header-left">
            <BackButton className="hdr-btn" />
            <img className="ds-mark" alt="Fourth Signal" src={BRAND_LOGO} />
            <div className="app-title">Manage Trade Flows</div>
            <span className="ds-code">TF</span>
          </div>
          <div className="ds-header-right">
            <span className="ds-conn" title="System connected" />
            <button
              type="button"
              className="hdr-btn"
              id="btnRefresh"
              onClick={() => void refresh()}
              disabled={busy}
            >
              {busy ? 'Working…' : '↻ Refresh'}
            </button>
            <SignOutButton className="hdr-btn" />
          </div>
        </header>

        <main className="screen" id="screenMain">
          {error ? (
            <div className="ds-panel" role="alert">
              <div className="section-body">
                <span className="field-hint">{error}</span>
              </div>
            </div>
          ) : null}

          <TfTable
            rows={rows}
            filters={filters}
            onFiltersChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((on) => !on)}
            onClearFilters={() => setFilters(EMPTY_FILTERS)}
            keyDate={keyDate}
            onKeyDateChange={setKeyDate}
            selected={selected}
            onSelect={select}
          />

          {selected ? (
            <section className="ds-panel">
              <div className="panel-title">
                Trade Flow {selected.ZtfNo} / {selected.ZtfSplit}
              </div>

              <div className="tab-bar" id="wsTabBar">
                {TAB_ORDER.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={tab === t.id ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="tab-panel">
                {activeTab ? (
                  <div className="tab-content" id={`tabPanel-${activeTab.id}`}>
                    {activeTab.sections.map((section) => (
                      <FieldGrid
                        key={section.heading}
                        section={section}
                        draft={draft}
                        optionsFor={(field) => distinctValues(rows, field)}
                        onChange={(field, value) => {
                          setDraft((current) => ({ ...current, [field]: value }))
                          setSaved(false)
                        }}
                      />
                    ))}
                    <div className="toolstrip">
                      <button type="button" className="hdr-btn" onClick={() => void save()} disabled={busy}>
                        Update
                      </button>
                      <button
                        type="button"
                        className="hdr-btn"
                        onClick={() => setDraft({ ...selected })}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                      {saved ? <span className="field-hint">Saved.</span> : null}
                    </div>
                  </div>
                ) : (
                  <div className="tab-content" id={`tabPanel-${tab}`}>
                    <div className="section-box">
                      <div className="section-head">Not yet backed by SAP</div>
                      <div className="section-body">
                        <span className="field-hint">
                          BL line items, deal assignment and compliance have no OData entity yet,
                          so this tab is deferred to Stage 2 rather than run on placeholder data.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                </section>
              ) : null}
        </main>
      </div>
    </div>
  )
}
