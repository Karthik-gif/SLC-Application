import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { applyChargeEdit, buildChargeRows, chargesTotal, isChargeRowTouched, recalcAllRows, recalcRow } from './charges.ts'
import type { ChargeRow } from './charge-types.ts'

const row = (over: Partial<ChargeRow> = {}): ChargeRow => ({
  ZfeeType: 'F1',
  ZfeeDesc: 'Confirmation',
  Zcat: '',
  Zcode: '',
  Zrate: '',
  Zday: '',
  Zamt: '',
  ZbAmt: '',
  ZfAmt: '0.00',
  ...over,
})

describe('recalcRow', () => {
  it('computes Base x Rate% x Period/360 for a percentage row', () => {
    // 1,000,000 x 2% x 90/360 = 5,000
    strictEqual(recalcRow(row({ ZbAmt: '1,000,000.00', Zrate: '2', Zday: '90', Zcode: '01' })), '5,000.00')
  })

  it('takes the Amount as-is for a flat-amount row, ignoring rate and period', () => {
    strictEqual(
      recalcRow(row({ Zcat: '02', Zamt: '1,250.00', ZbAmt: '1,000,000.00', Zrate: '99', Zday: '360' })),
      '1,250.00',
    )
  })

  it('takes the greater of the percentage and the Amount for code 02', () => {
    const base = { ZbAmt: '1,000,000.00', Zrate: '2', Zday: '90', Zcode: '02' }
    strictEqual(recalcRow(row({ ...base, Zamt: '7,500' })), '7,500.00')
    strictEqual(recalcRow(row({ ...base, Zamt: '2,500' })), '5,000.00')
  })

  it('takes the lesser for code 03', () => {
    const base = { ZbAmt: '1,000,000.00', Zrate: '2', Zday: '90', Zcode: '03' }
    strictEqual(recalcRow(row({ ...base, Zamt: '7,500' })), '5,000.00')
    strictEqual(recalcRow(row({ ...base, Zamt: '2,500' })), '2,500.00')
  })

  it('rounds to 2dp rather than letting the display and the stored value disagree', () => {
    // 1,000 x 1% x 1/360 = 0.02777...
    strictEqual(recalcRow(row({ ZbAmt: '1,000', Zrate: '1', Zday: '1', Zcode: '01' })), '0.03')
  })

  it('is 0.00 when nothing is filled in', () => {
    strictEqual(recalcRow(row()), '0.00')
  })
})

describe('applyChargeEdit', () => {
  it('clears Amount when switching to percentage, so a stale value cannot mislead', () => {
    const next = applyChargeEdit(row({ Zamt: '999', Zrate: '2', Zday: '90', ZbAmt: '1,000,000' }), 'Zcat', '01')
    strictEqual(next.Zamt, '')
    strictEqual(next.ZfAmt, '5,000.00')
  })

  it('clears rate and period when switching to flat amount', () => {
    const next = applyChargeEdit(row({ Zrate: '2', Zday: '90', Zamt: '1,250' }), 'Zcat', '02')
    strictEqual(next.Zrate, '')
    strictEqual(next.Zday, '')
    strictEqual(next.ZfAmt, '1,250.00')
  })

  it('recalculates the final amount on every edit', () => {
    const next = applyChargeEdit(row({ ZbAmt: '1,000,000', Zday: '90', Zcode: '01' }), 'Zrate', '4')
    strictEqual(next.ZfAmt, '10,000.00')
  })
})

describe('recalcAllRows', () => {
  it('re-bases every row on the current trade value', () => {
    const rows = recalcAllRows([row({ Zrate: '2', Zday: '90', Zcode: '01' })], 2_000_000)
    strictEqual(rows[0]?.ZbAmt, '2,000,000.00')
    strictEqual(rows[0]?.ZfAmt, '10,000.00')
  })
})

describe('isChargeRowTouched', () => {
  it('is false for an untouched row, so it is never persisted', () => {
    strictEqual(isChargeRowTouched(row()), false)
    // A base amount and a computed final are set for every row, touched or not.
    strictEqual(isChargeRowTouched(row({ ZbAmt: '1,000,000.00', ZfAmt: '0.00' })), false)
  })

  it('is true once any editable field is filled', () => {
    strictEqual(isChargeRowTouched(row({ Zcat: '01' })), true)
    strictEqual(isChargeRowTouched(row({ Zamt: '10' })), true)
    strictEqual(isChargeRowTouched(row({ Zday: '30' })), true)
  })
})

describe('buildChargeRows', () => {
  it('produces exactly one row per fee type, in order', () => {
    const rows = buildChargeRows([{ ZfeeType: 'A', ZfeeDesc: 'Alpha' }, { ZfeeType: 'B', ZfeeDesc: 'Beta' }], {})
    deepStrictEqual(rows.map((r) => r.ZfeeType), ['A', 'B'])
    strictEqual(rows[0]?.Zcat, '')
  })

  it('carries existing values across, formatting the stored amount', () => {
    const rows = buildChargeRows([{ ZfeeType: 'A', ZfeeDesc: 'Alpha' }], {
      A: { Zcat: '02', Zcode: '01', Zrate: '2', Zday: ' 90 ', Zamt: 1250 },
    })
    strictEqual(rows[0]?.Zcat, '02')
    strictEqual(rows[0]?.Zday, '90')
    strictEqual(rows[0]?.Zamt, '1,250.00')
  })
})

describe('chargesTotal', () => {
  it('sums the final amounts', () => {
    strictEqual(chargesTotal([row({ ZfAmt: '1,000.00' }), row({ ZfAmt: '250.50' })]), 1250.5)
  })
})
