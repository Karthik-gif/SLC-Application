import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fieldOf, nextKey } from './middleware.ts'
import { COLUMNS } from './middleware-columns.ts'

/**
 * The field names below are the ones the SAP OData service used to return, taken from a live
 * response before the migration. They are the contract every grid, form and payload in the
 * OTTK and DTTK consoles is written against, so the translation has to reproduce them exactly
 * — a single wrong name is a silently blank column rather than an error.
 */
describe('fieldOf', () => {
  it('reproduces the OData field names the consoles are written against', () => {
    strictEqual(fieldOf('ZOTTK_NO'), 'ZottkNo')
    strictEqual(fieldOf('ZENT_ID'), 'ZentId')
    strictEqual(fieldOf('ZLC_APP'), 'ZlcApp')
    strictEqual(fieldOf('ZOTTK_ST'), 'ZottkSt')
    strictEqual(fieldOf('ZCC_OTTK_VALUE'), 'ZccOttkValue')
    strictEqual(fieldOf('ZDEAL_ID'), 'ZdealId')
    strictEqual(fieldOf('ZSBLC_TXN'), 'ZsblcTxn')
  })

  it('leaves a single-segment column as one capitalised word', () => {
    strictEqual(fieldOf('CLIENT'), 'Client')
    strictEqual(fieldOf('ZSTR'), 'Zstr')
    strictEqual(fieldOf('ZLCCHARGES'), 'Zlccharges')
  })
})

describe('COLUMNS', () => {
  it('maps every column to a distinct field, so no column is shadowed', () => {
    for (const [resource, columns] of Object.entries(COLUMNS)) {
      const fields = columns.map(fieldOf)
      deepStrictEqual(
        fields.length,
        new Set(fields).size,
        `${resource} has two columns translating to the same field name`,
      )
    }
  })

  it('carries the key field of each resource', () => {
    strictEqual(COLUMNS.ottk.includes('ZOTTK_NO'), true)
    strictEqual(COLUMNS.dttk.includes('ZDTTK_NO'), true)
    // Deal IDs are keyed on both columns; a create missing either is rejected outright.
    strictEqual(COLUMNS.dealid.includes('ZDEAL_ID'), true)
    strictEqual(COLUMNS.dealid.includes('ZSBLC_TXN'), true)
  })
})

describe('nextKey', () => {
  it('continues a plain numeric series at the highest value', () => {
    strictEqual(nextKey(['100001', '100002', '900001']), '900002')
  })

  it('carries a prefix through, so Deal IDs stay Deal-ID shaped', () => {
    strictEqual(nextKey(['DEAL0001', 'DEAL0002', 'DEAL9001']), 'DEAL9002')
  })

  it('keeps the width the existing keys already use', () => {
    strictEqual(nextKey(['0000000009']), '0000000010')
    strictEqual(nextKey([]), '000001')
  })

  it('ignores keys it cannot parse rather than failing the allocation', () => {
    // A blank key is exactly what a bad create leaves behind; it must not stall the next one.
    strictEqual(nextKey(['', '100001', 'not-a-number']), '100002')
  })
})
