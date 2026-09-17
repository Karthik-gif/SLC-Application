import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { donutArc, niceTicks, polylinePoints, scaleLinear } from './geometry.ts'

describe('scaleLinear', () => {
  it('maps the domain onto the range', () => {
    strictEqual(scaleLinear({ min: 0, max: 10 }, { min: 0, max: 100 }, 5), 50)
    strictEqual(scaleLinear({ min: 0, max: 10 }, { min: 0, max: 100 }, 0), 0)
    strictEqual(scaleLinear({ min: 0, max: 10 }, { min: 0, max: 100 }, 10), 100)
  })

  it('handles an inverted range, which is how SVG y axes are drawn', () => {
    strictEqual(scaleLinear({ min: 0, max: 10 }, { min: 100, max: 0 }, 10), 0)
    strictEqual(scaleLinear({ min: 0, max: 10 }, { min: 100, max: 0 }, 0), 100)
  })

  it('centres a zero-width domain instead of dividing by zero', () => {
    // A flat series has min === max. Pinning it to an edge would read as "at the minimum",
    // which is wrong; the middle says "unchanged".
    strictEqual(scaleLinear({ min: 7, max: 7 }, { min: 0, max: 100 }, 7), 50)
  })
})

describe('donutArc', () => {
  it('starts a segment at 12 o_clock', () => {
    // A quarter turn from the top: begins at (0,-50), ends at (50,0).
    const path = donutArc(0, 0.25, 50, 14)
    strictEqual(path.startsWith('M 0 -50 A 50 50 0 0 1 50 0'), true)
  })

  it('sets the large-arc flag only past half a turn', () => {
    strictEqual(donutArc(0, 0.4, 50, 14).includes('A 50 50 0 0 1'), true)
    strictEqual(donutArc(0, 0.6, 50, 14).includes('A 50 50 0 1 1'), true)
  })

  it('splits a full turn into two arcs', () => {
    // One elliptical arc whose endpoints coincide draws nothing, so a 100% segment
    // must be halved.
    const path = donutArc(0, 1, 50, 14)
    strictEqual(path.split('M').length - 1, 2)
  })

  it('is empty for a zero-width segment', () => {
    strictEqual(donutArc(0.3, 0.3, 50, 14), '')
  })

  it('closes the ring back to the inner radius', () => {
    strictEqual(donutArc(0, 0.25, 50, 14).endsWith('Z'), true)
    strictEqual(donutArc(0, 0.25, 50, 14).includes('A 36 36 0 0 0'), true)
  })
})

describe('polylinePoints', () => {
  it('spreads values evenly across the width, max at the top', () => {
    strictEqual(polylinePoints([0, 5, 10], 100, 50), '0,50 50,25 100,0')
  })

  it('draws a flat series through the middle', () => {
    strictEqual(polylinePoints([4, 4, 4], 100, 50), '0,25 50,25 100,25')
  })

  it('centres a single value rather than dividing by zero', () => {
    strictEqual(polylinePoints([9], 100, 50), '50,25')
  })

  it('is empty for no values', () => {
    strictEqual(polylinePoints([], 100, 50), '')
  })
})

describe('niceTicks', () => {
  it('rounds the step up to a readable number', () => {
    deepStrictEqual(niceTicks(100, 5), [0, 25, 50, 75, 100])
    deepStrictEqual(niceTicks(9, 3), [0, 5, 10])
  })

  it('covers the maximum', () => {
    const ticks = niceTicks(1420, 5)
    strictEqual((ticks[ticks.length - 1] ?? 0) >= 1420, true)
  })

  it('degrades to a single tick for a non-positive maximum', () => {
    deepStrictEqual(niceTicks(0, 5), [0])
    deepStrictEqual(niceTicks(-3, 5), [0])
  })
})
