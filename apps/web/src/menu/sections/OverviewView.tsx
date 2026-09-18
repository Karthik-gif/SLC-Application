import { useState } from 'react'
import { BarChart, DonutChart, LineChart, Sparkline } from '../charts/Charts.tsx'
import {
  DEAL_STATUS,
  EXPOSURE_BY_PRODUCT,
  KPIS,
  MONTHLY_VOLUME,
  RECENT_ACTIVITY,
} from '../mock/overview.ts'

/**
 * The four structures the hub is divided into, plus the combined view they default to.
 *
 * Short labels on purpose: the row sits under a heading that already says Overview, and the
 * full names ("XLC-CRP Structure") would wrap the row onto two lines on a laptop.
 */
const SCOPES = ['All', 'FX', 'SLC', 'XLC-CRP', 'ICFS'] as const

type Scope = (typeof SCOPES)[number]

/**
 * Position and activity across the estate. Every figure is static — see mock/overview.ts —
 * so the page says so rather than implying it is live.
 *
 * The structure picker below changes nothing yet, and that is the honest state of it: there
 * is one placeholder data set, not four. It exists now so the page has the shape it will
 * keep, and it says outright that the figures are not split, because a picker that silently
 * redraws the same numbers reads as four structures that happen to be identical.
 */
export function OverviewView() {
  const [scope, setScope] = useState<Scope>('All')

  return (
    <>
      <div className="hub-title">Overview</div>
      <div className="hub-sub">
        Position and activity across the TSF estate. Figures on this page are placeholders and
        are not read from SAP.
      </div>

      <div className="mp-scope-row" role="group" aria-label="Structure">
        {SCOPES.map((option) => (
          <button
            type="button"
            key={option}
            className={option === scope ? 'mp-scope active' : 'mp-scope'}
            aria-pressed={option === scope}
            onClick={() => setScope(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {scope !== 'All' ? (
        <p className="mp-scope-note">
          The figures below are not split by structure yet — this is the same placeholder set
          shown for {scope} as for every other structure.
        </p>
      ) : null}

      <div className="group-label">Key figures</div>
      <div className="mp-kpi-grid">
        {KPIS.map((kpi) => (
          <div className="mp-kpi" key={kpi.label}>
            <div className="mp-kpi-label">{kpi.label}</div>
            <div className="mp-kpi-value">{kpi.value}</div>
            <div
              className={kpi.delta >= 0 ? 'mp-kpi-delta up' : 'mp-kpi-delta down'}
              aria-label={`${kpi.delta >= 0 ? 'Up' : 'Down'} ${Math.abs(kpi.delta).toFixed(1)}% ${kpi.deltaNote}`}
            >
              {/* An arrow as well as the colour, so the direction survives a greyscale print
                  or a red-green colour deficiency. The aria-label above says the direction in
                  words, since Math.abs() below strips the sign a screen reader could otherwise use. */}
              <span aria-hidden="true">{kpi.delta >= 0 ? '▲' : '▼'}</span>
              {Math.abs(kpi.delta).toFixed(1)}% {kpi.deltaNote}
            </div>
            <Sparkline values={kpi.series} rising={kpi.delta >= 0} />
          </div>
        ))}
      </div>

      <div className="group-label">Exposure and status</div>
      <div className="mp-panel-row">
        <div className="mp-panel">
          <div className="mp-panel-title">Exposure by product</div>
          <BarChart data={EXPOSURE_BY_PRODUCT} unit="m" title="Exposure by product, USD millions" />
        </div>
        <div className="mp-panel">
          <div className="mp-panel-title">Deal status</div>
          <DonutChart data={DEAL_STATUS} title="Deal status split" />
        </div>
      </div>

      <div className="group-label">Volume</div>
      <div className="mp-panel">
        <div className="mp-panel-title">Deals booked per month</div>
        <LineChart data={MONTHLY_VOLUME} title="Deals booked per month, rolling twelve months" />
      </div>

      <div className="group-label">Recent activity</div>
      <div className="mp-panel">
        <table className="mp-activity">
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITY.map((row) => (
              <tr key={`${row.when}-${row.what}`}>
                <td className="mp-activity-when">{row.when}</td>
                <td>{row.what}</td>
                <td className="mp-activity-who">{row.who}</td>
                <td>
                  <span className={`mp-activity-status ${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
