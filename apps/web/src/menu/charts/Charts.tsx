import { donutArc, niceTicks, polylinePoints, scaleLinear } from './geometry.ts'
import type { Slice } from '../mock/overview.ts'

/**
 * Inline-SVG charts for the Overview section. Presentational only — every number comes in
 * as a prop and all arithmetic lives in geometry.ts. Each chart uses a viewBox with no
 * fixed size so it scales with its container.
 */

/** Ordered so adjacent series stay distinguishable; all six sit on the page's blue-teal axis. */
export const SERIES_COLOURS = ['#1565c0', '#1e88e5', '#42a5f5', '#00acc1', '#7cb3e8', '#9ccce0']

function colourAt(index: number): string {
  return SERIES_COLOURS[index % SERIES_COLOURS.length] ?? '#1565c0'
}

export function Sparkline({ values, rising }: { values: number[]; rising: boolean }) {
  const points = polylinePoints(values, 100, 28)
  if (!points) return null
  return (
    <svg className="mp-spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={rising ? 'var(--blue)' : 'var(--text-muted)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function BarChart({ data, unit, title }: { data: Slice[]; unit: string; title: string }) {
  const max = Math.max(...data.map((d) => d.value), 0)
  return (
    <div className="mp-bars" role="img" aria-label={title}>
      {data.map((slice, index) => (
        <div className="mp-bar-row" key={slice.label}>
          <div className="mp-bar-label">{slice.label}</div>
          <div className="mp-bar-track">
            <div
              className="mp-bar-fill"
              style={{
                width: `${scaleLinear({ min: 0, max }, { min: 0, max: 100 }, slice.value)}%`,
                background: colourAt(index),
              }}
            />
          </div>
          <div className="mp-bar-value">
            {slice.value.toLocaleString()} {unit}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DonutChart({ data, title }: { data: Slice[]; title: string }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  let cursor = 0
  const segments = data.map((slice, index) => {
    const start = cursor
    const fraction = total === 0 ? 0 : slice.value / total
    cursor += fraction
    return { ...slice, fraction, path: donutArc(start, start + fraction, 60, 22), colour: colourAt(index) }
  })

  return (
    <div className="mp-donut-wrap">
      <svg className="mp-donut" viewBox="-70 -70 140 140" role="img" aria-label={title}>
        <title>{title}</title>
        {segments.map((segment) => (
          <path key={segment.label} d={segment.path} fill={segment.colour} />
        ))}
        <text className="mp-donut-total" x="0" y="-2" textAnchor="middle">
          {total.toLocaleString()}
        </text>
        <text className="mp-donut-cap" x="0" y="14" textAnchor="middle">
          DEALS
        </text>
      </svg>
      <ul className="mp-legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className="mp-legend-dot" style={{ background: segment.colour }} />
            <span className="mp-legend-label">{segment.label}</span>
            <span className="mp-legend-value">{Math.round(segment.fraction * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LineChart({ data, title }: { data: { month: string; value: number }[]; title: string }) {
  const width = 620
  const height = 180
  const values = data.map((d) => d.value)
  const max = Math.max(...values, 0)
  const ticks = niceTicks(max, 5)
  const top = ticks[ticks.length - 1] ?? max
  // Scaled against 0..top rather than the series min, so the gridlines and the line agree.
  const scaled = values.map((value) => scaleLinear({ min: 0, max: top }, { min: height, max: 0 }, value))
  const points = scaled
    .map((y, index) => `${(index / Math.max(data.length - 1, 1)) * width},${y}`)
    .join(' ')

  return (
    <div className="mp-line-wrap">
      <svg className="mp-line" viewBox={`-6 -10 ${width + 60} ${height + 40}`} role="img" aria-label={title}>
        <title>{title}</title>
        {ticks.map((tick) => {
          const y = scaleLinear({ min: 0, max: top }, { min: height, max: 0 }, tick)
          return (
            <g key={tick}>
              <line x1="0" y1={y} x2={width} y2={y} stroke="var(--blue-pale2)" strokeWidth="1" />
              <text className="mp-axis" x={width + 8} y={y + 4}>
                {tick.toLocaleString()}
              </text>
            </g>
          )
        })}
        <polyline
          points={points}
          fill="none"
          stroke="var(--blue-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * width
          return (
            <g key={point.month}>
              <circle cx={x} cy={scaled[index] ?? height} r="3.5" fill="var(--white)" stroke="var(--blue-dark)" strokeWidth="2" />
              <text className="mp-axis" x={x} y={height + 20} textAnchor="middle">
                {point.month}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
