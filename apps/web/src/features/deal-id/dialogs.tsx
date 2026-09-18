import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fmtNum, toNum } from '@slc/api-client'
import { useAsync } from '@slc/api-client/react'
import { loadDealIds } from './api.ts'
import { StatusPill } from './columns.tsx'
import type { AssignedTotals, DealIdRow, OttkRow } from './types.ts'

function matches(row: unknown, query: string): boolean {
  if (!query) return true
  return Object.values(row as Record<string, unknown>).join(' ').toLowerCase().includes(query)
}

/**
 * The legacy modal: a .modal-backdrop that is always in the DOM and toggles .open, so it
 * keeps the original's fade transition. Escape is handled here because a plain div has none
 * of the behaviour the native <dialog> element would bring.
 */
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  style,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  style?: React.CSSProperties
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={open ? 'modal-backdrop open' : 'modal-backdrop'}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal" style={style}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{footer}</div>
      </div>
    </div>
  )
}

export function OttkSearchDialog({
  open,
  rows,
  totals,
  onPick,
  onClose,
}: {
  open: boolean
  rows: readonly OttkRow[]
  totals: AssignedTotals
  onPick: (row: OttkRow) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  const hits = useMemo(() => rows.filter((row) => matches(row, query.toLowerCase())), [rows, query])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Search OTTK"
      footer={
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
      }
    >
      <input
        className="search"
        style={{ width: '100%', marginBottom: 10 }}
        placeholder="Search OTTK No, Entity or Bank…"
        aria-label="Search OTTK"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>OTTK No</th>
              <th>Structure</th>
              <th>Entity String</th>
              <th>Trade Value</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {hits.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No matches
                </td>
              </tr>
            ) : (
              hits.map((row) => (
                <tr
                  key={row.ZottkNo}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onClose()
                    onPick(row)
                  }}
                >
                  <td>{row.ZottkNo}</td>
                  <td>{row.Zstr}</td>
                  <td>{row.ZentDesc}</td>
                  <td className="num">{fmtNum(row.ZottkValue)}</td>
                  <td className="num">
                    {fmtNum(toNum(row.ZottkValue) - (totals.byOttk.get(row.ZottkNo ?? '') ?? 0))}
                  </td>
                  <td>
                    <StatusPill status={row.ZstatDesc ?? row.ZottkSt} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

/**
 * The full Deal ID list, fetched fresh each time it opens — the console never holds a
 * complete list otherwise, and a stale one here would mislead.
 */
export function DealIdListDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  const deals = useAsync<DealIdRow[]>((signal) => (open ? loadDealIds(signal) : Promise.resolve([])), [open])
  const hits = useMemo(
    () => (deals.data ?? []).filter((row) => matches(row, query.toLowerCase())),
    [deals.data, query],
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Deal ID List"
      style={{ width: 'min(1080px, calc(100vw - 32px))' }}
      footer={
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      }
    >
      <input
        className="search"
        style={{ width: '100%', marginBottom: 10 }}
        placeholder="Search Deal ID, OTTK, DTTK, Entity or Description…"
        aria-label="Search Deal IDs"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Deal ID</th>
              <th>OTTK No</th>
              <th>DTTK No</th>
              <th>Entity ID</th>
              <th>Structure</th>
              <th>Deal Amt</th>
              <th>Crcy</th>
              <th>Description</th>
              <th>Status</th>
              <th>Status Desc</th>
            </tr>
          </thead>
          <tbody>
            {hits.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No records
                </td>
              </tr>
            ) : (
              hits.map((row) => (
                <tr key={row.ZdealId}>
                  <td>{row.ZdealId}</td>
                  <td>{row.ZottkNo}</td>
                  <td>{row.ZdttkNo}</td>
                  <td>{row.ZentId}</td>
                  <td>{row.Zstr}</td>
                  <td className="num">{fmtNum(row.ZdealAmt)}</td>
                  <td>{row.ZdealCurr}</td>
                  <td>{row.ZdealIdDesc}</td>
                  <td>{row.ZdealStat}</td>
                  {/* No status-text source survived the move off OData, so the raw code is
                      shown rather than an empty cell — the same fallback the OTTK grid uses. */}
                  <td>{row.ZdealStatDesc ?? row.ZdealStat ?? ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

/** Its own centred card, not the standard modal frame — exactly as the legacy page had it. */
export function SuccessDialog({
  dealId,
  ottkNo,
  dttkNo,
  onClose,
}: {
  dealId: string | undefined
  ottkNo: string
  dttkNo: string
  onClose: () => void
}) {
  const open = dealId !== undefined

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={open ? 'modal-backdrop open' : 'modal-backdrop'}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="successModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="success-modal">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>
        <h3 id="successModalTitle">Deal ID Created</h3>
        <span className="deal-id-highlight">{dealId}</span>
        <p>
          Created for OTTK #{ottkNo} / DTTK #{dttkNo}.
        </p>
        <button type="button" className="btn primary" autoFocus onClick={onClose}>
          OK
        </button>
      </section>
    </div>
  )
}
