import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  BASIC_FIELDS,
  BASIC_SECTIONS,
  PURCH_SALES_SECTIONS,
  SHIPPING_FIELDS,
  SHIPPING_SECTIONS,
  STATUS_FIELDS,
  STATUS_SECTIONS,
  distinctValues,
  filterRows,
  rowKey,
  subtotal,
} from './fields.ts'
import { EMPTY_FILTERS } from './types.ts'
import type { TrdFlowRow } from './types.ts'

const ROWS: TrdFlowRow[] = [
  { ZtfNo: '0000000001', ZtfSplit: '01', Zbu: 'B01', Zcmmd: 'C106', ZflwSts: '01', Zttv: 1000 },
  { ZtfNo: '0000000002', ZtfSplit: '01', Zbu: 'B02', Zcmmd: 'C108', ZflwSts: '02', Zttv: 250.5 },
  { ZtfNo: '0000000003', ZtfSplit: '02', Zbu: 'B01', Zcmmd: 'C106' },
]

describe('filterRows', () => {
  it('returns every row when no filter is set', () => {
    strictEqual(filterRows(ROWS, EMPTY_FILTERS).length, 3)
  })

  it('matches exactly, ignoring case', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, Zcmmd: 'c106' })
    deepStrictEqual(
      out.map((r) => r.ZtfNo),
      ['0000000001', '0000000003'],
    )
  })

  it('does not match on a partial value', () => {
    strictEqual(filterRows(ROWS, { ...EMPTY_FILTERS, Zcmmd: 'C10' }).length, 0)
  })

  it('ands multiple filters together', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, Zbu: 'B01', Zcmmd: 'C106' })
    strictEqual(out.length, 2)
  })

  it('treats a row missing the filtered field as not matching', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, ZflwSts: '02' })
    deepStrictEqual(
      out.map((r) => r.ZtfNo),
      ['0000000002'],
    )
  })
})

describe('distinctValues', () => {
  it('collects distinct non-empty values, sorted', () => {
    deepStrictEqual(distinctValues(ROWS, 'Zbu'), ['B01', 'B02'])
    deepStrictEqual(distinctValues(ROWS, 'Zcmmd'), ['C106', 'C108'])
  })

  it('skips rows where the field is absent', () => {
    deepStrictEqual(distinctValues(ROWS, 'ZflwSts'), ['01', '02'])
  })

  it('is empty when no row carries the field', () => {
    deepStrictEqual(distinctValues(ROWS, 'Zoprtr'), [])
  })
})

describe('subtotal', () => {
  it('sums Zttv across rows, ignoring rows without it', () => {
    strictEqual(subtotal(ROWS), 1250.5)
  })

  it('is zero for an empty list', () => {
    strictEqual(subtotal([]), 0)
  })
})

describe('rowKey', () => {
  it('builds the composite key', () => {
    deepStrictEqual(rowKey(ROWS[0]!), { ZtfNo: '0000000001', ZtfSplit: '01' })
  })

  it('returns null when either half is missing', () => {
    strictEqual(rowKey({ ZtfNo: '1' }), null)
    strictEqual(rowKey({ ZtfSplit: '01' }), null)
  })
})

describe('section structure matches legacy/Manage TF.html', () => {
  /** Headings and grid classes read out of the original tab panels. */
  const EXPECTED = {
    basicData: [
      ['Basic Data', 'grid6', 6],
      ['Invoice Data', 'grid5', 5],
      ['Other Data', 'grid5', 2],
    ],
    shippingData: [
      ['Shipping Data', 'grid4', 12],
      ['Title With OIL', 'grid4', 2],
      ['BL Data', 'grid4', 6],
    ],
    purchSalesData: [
      ['Purchase Leg', 'grid3', 7],
      ['Sales Leg', 'grid3', 6],
    ],
    statusTab: [
      ['Status Details', 'grid5', 2],
      ['Blocked-Allocated Status', 'grid5', 10],
      ['TF Status Details', 'grid5', 9],
    ],
  } as const

  const ACTUAL = {
    basicData: BASIC_SECTIONS,
    shippingData: SHIPPING_SECTIONS,
    purchSalesData: PURCH_SALES_SECTIONS,
    statusTab: STATUS_SECTIONS,
  }

  for (const [tab, expected] of Object.entries(EXPECTED)) {
    it(`${tab} has the original's sections, grid classes and field counts`, () => {
      const actual = ACTUAL[tab as keyof typeof ACTUAL]
      deepStrictEqual(
        actual.map((s) => [s.heading, s.grid, s.fields.length]),
        expected.map((e) => [...e]),
      )
    })
  }

  it('gives every field a unique id across all tabs', () => {
    const ids = [
      ...BASIC_SECTIONS,
      ...SHIPPING_SECTIONS,
      ...PURCH_SALES_SECTIONS,
      ...STATUS_SECTIONS,
    ].flatMap((s) => s.fields.map((f) => f.id))
    strictEqual(new Set(ids).size, ids.length)
  })

  it('marks the original selects as selects', () => {
    const selects = [
      ...BASIC_SECTIONS,
      ...STATUS_SECTIONS,
    ]
      .flatMap((s) => s.fields)
      .filter((f) => f.control === 'select')
      .map((f) => f.id)
      .sort()
    deepStrictEqual(selects, [
      'bdGtCommod',
      'odTfType',
      'stBlockedStatus',
      'stOgbsStatus',
      'stTfStatus',
    ])
  })
})

describe('field descriptors', () => {
  it('maps the shipping fields the spec lists as live', () => {
    const byId = new Map(SHIPPING_FIELDS.map((f) => [f.id, f.field]))
    strictEqual(byId.get('shVessel'), 'ZblVsslName')
    strictEqual(byId.get('shLoadPort'), 'Zpol')
    strictEqual(byId.get('shPodCountry'), 'ZpodCtry')
    strictEqual(byId.get('shSailingDate'), 'Zsldate')
    strictEqual(byId.get('shLcDetails'), 'Zlc')
  })

  it('leaves the fields with no SAP source unmapped', () => {
    const unmapped = [...BASIC_FIELDS, ...SHIPPING_FIELDS, ...STATUS_FIELDS]
      .filter((f) => f.field === undefined)
      .map((f) => f.id)
    // Enumerated in the spec's honesty note.
    strictEqual(unmapped.includes('bdChild1'), true)
    strictEqual(unmapped.includes('shSustain'), true)
    strictEqual(unmapped.includes('stBlockedAmount'), true)
    strictEqual(unmapped.includes('stCreatedBy'), true)
  })

  it('maps the two status fields that do exist', () => {
    const byId = new Map(STATUS_FIELDS.map((f) => [f.id, f.field]))
    strictEqual(byId.get('stTfStatus'), 'ZflwSts')
    strictEqual(byId.get('stOgbsStatus'), 'ZogbsStatId')
  })
})
