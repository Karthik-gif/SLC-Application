/**
 * Geometry for the hub's inline-SVG charts: plain numbers and path strings, no DOM and no
 * React, so it is testable under `node --test` without a browser environment.
 */

export type Range = { min: number; max: number }

const TAU = Math.PI * 2

/** Coordinates are rounded so paths are short and tests are not floating-point noise. */
function r2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Maps a value from a data domain onto a pixel range. `range.min > range.max` is normal and
 * is how a y axis is expressed, since SVG y grows downward.
 */
export function scaleLinear(domain: Range, range: Range, value: number): number {
  const span = domain.max - domain.min
  // A flat series has no span. The midpoint reads as "unchanged"; an edge would read as
  // "at the minimum", which is a different and wrong claim.
  if (span === 0) return (range.min + range.max) / 2
  return range.min + ((value - domain.min) / span) * (range.max - range.min)
}

/** Turns, clockwise from 12 o'clock: 0 is the top, 0.25 is 3 o'clock. */
function pointOnCircle(fraction: number, radius: number): [number, number] {
  const angle = fraction * TAU - Math.PI / 2
  return [r2(radius * Math.cos(angle)), r2(radius * Math.sin(angle))]
}

/**
 * One ring segment of a donut, centred on the origin, drawn clockwise from `start` to `end`
 * in turns.
 */
export function donutArc(start: number, end: number, radius: number, thickness: number): string {
  const sweep = Math.min(Math.max(end - start, 0), 1)
  if (sweep === 0) return ''
  // A single elliptical arc cannot close a full turn: its endpoints coincide and the browser
  // draws nothing at all. Halving it keeps every endpoint distinct.
  if (sweep >= 1) {
    return `${donutArc(start, start + 0.5, radius, thickness)} ${donutArc(start + 0.5, start + 1, radius, thickness)}`
  }
  const inner = radius - thickness
  const large = sweep > 0.5 ? 1 : 0
  const [outerStartX, outerStartY] = pointOnCircle(start, radius)
  const [outerEndX, outerEndY] = pointOnCircle(start + sweep, radius)
  const [innerEndX, innerEndY] = pointOnCircle(start + sweep, inner)
  const [innerStartX, innerStartY] = pointOnCircle(start, inner)
  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${radius} ${radius} 0 ${large} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${inner} ${inner} 0 ${large} 0 ${innerStartX} ${innerStartY}`,
    'Z',
  ].join(' ')
}

/** `x,y` pairs for a `<polyline points=…>`, scaled to fill the box with the max at the top. */
export function polylinePoints(values: number[], width: number, height: number): string {
  if (values.length === 0) return ''
  if (values.length === 1) return `${r2(width / 2)},${r2(height / 2)}`
  const domain: Range = { min: Math.min(...values), max: Math.max(...values) }
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = scaleLinear(domain, { min: height, max: 0 }, value)
      return `${r2(x)},${r2(y)}`
    })
    .join(' ')
}

/** Axis values from 0 to at least `max`, stepping by a round number. */
export function niceTicks(max: number, count: number): number[] {
  if (max <= 0 || count < 2) return [0]
  const rawStep = max / (count - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? magnitude * 10
  const ticks: number[] = []
  for (let value = 0; value < max + step; value += step) ticks.push(r2(value))
  return ticks
}
