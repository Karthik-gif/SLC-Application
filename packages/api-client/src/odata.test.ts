import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { entityPath, odataQuery, odataString } from './odata.ts'
import { extractMessage } from './errors.ts'
import { codeText, fmtDate, fmtNum, looseMatch, runLimited } from './format.ts'

describe('odataQuery', () => {
  it('omits absent options rather than emitting empty ones', () => {
    strictEqual(odataQuery({}), '')
    strictEqual(odataQuery({ top: 1 }), '%24top=1')
  })

  it('encodes a filter once, leaving the expression readable at the call site', () => {
    // The legacy pages hand-encoded this and disagreed about the leading $.
    strictEqual(odataQuery({ filter: "ZdttkNo eq '123'" }), "%24filter=ZdttkNo+eq+%27123%27")
  })

  it('emits $top=0, which is meaningful, rather than dropping it as falsy', () => {
    strictEqual(odataQuery({ top: 0 }), '%24top=0')
  })

  it('joins $select', () => {
    strictEqual(odataQuery({ select: ['A', 'B'] }), '%24select=A%2CB')
  })
})

describe('odataString', () => {
  it("doubles an embedded quote, which is OData's escape, not a backslash", () => {
    strictEqual(odataString("O'Brien"), "'O''Brien'")
  })
})

describe('entityPath', () => {
  it('builds a single key', () => {
    strictEqual(entityPath('SlcOttkDetail', '100042'), "SlcOttkDetail('100042')")
  })

  it('builds a composite key in name=value form', () => {
    strictEqual(
      entityPath('SlcDttkFee', { ZdttkNo: '123', ZfeeType: 'CONF' }),
      "SlcDttkFee(ZdttkNo='123',ZfeeType='CONF')",
    )
  })
})

describe('extractMessage', () => {
  it('reads OData V4 ({error:{message}})', () => {
    strictEqual(extractMessage({ error: { message: 'Bad request' } }, 'fallback'), 'Bad request')
  })

  it('reads OData V2 ({error:{message:{value}}})', () => {
    strictEqual(extractMessage({ error: { message: { value: 'Nope' } } }, 'fallback'), 'Nope')
  })

  it('reads SAP__Messages', () => {
    strictEqual(extractMessage({ SAP__Messages: [{ message: 'Field required' }] }, 'fallback'), 'Field required')
  })

  it('falls back on an unrecognised shape', () => {
    strictEqual(extractMessage({ something: 1 }, 'fallback'), 'fallback')
    strictEqual(extractMessage(null, 'fallback'), 'fallback')
  })
})

describe('formatters', () => {
  it('renders an Edm.Date as DD.MM.YYYY', () => {
    strictEqual(fmtDate('2026-03-14'), '14.03.2026')
    strictEqual(fmtDate('2026-03-14T00:00:00Z'), '14.03.2026')
  })

  it('leaves an unparseable date alone and blanks an empty one', () => {
    strictEqual(fmtDate('not a date'), 'not a date')
    strictEqual(fmtDate(''), '')
    strictEqual(fmtDate(null), '')
  })

  it('blanks non-numbers instead of showing NaN', () => {
    strictEqual(fmtNum(''), '')
    strictEqual(fmtNum(null), '')
    strictEqual(fmtNum('abc'), '')
    strictEqual(fmtNum(1234.5), '1,234.50')
  })

  it('formats zero rather than treating it as empty', () => {
    strictEqual(fmtNum(0), '0.00')
  })

  it('matches loosely in both directions but never matches an empty cell', () => {
    strictEqual(looseMatch('', 'anything'), true)
    strictEqual(looseMatch('100', '100042'), true)
    strictEqual(looseMatch('100042', '100'), true)
    strictEqual(looseMatch('100', ''), false)
    strictEqual(looseMatch('100', null), false)
  })
})

describe('runLimited', () => {
  it('reports settled results in input order and never rejects', async () => {
    const results = await runLimited(
      [
        () => Promise.resolve('a'),
        () => Promise.reject(new Error('boom')),
        () => Promise.resolve('c'),
      ],
      2,
    )
    deepStrictEqual(
      results.map((r) => r.status),
      ['fulfilled', 'rejected', 'fulfilled'],
    )
    strictEqual(results[0]?.status === 'fulfilled' ? results[0].value : undefined, 'a')
    strictEqual(results[2]?.status === 'fulfilled' ? results[2].value : undefined, 'c')
  })

  it('never exceeds the concurrency limit', async () => {
    let active = 0
    let peak = 0
    const tasks = Array.from({ length: 10 }, () => async () => {
      active++
      peak = Math.max(peak, active)
      await new Promise((resolve) => setTimeout(resolve, 5))
      active--
      return 1
    })
    await runLimited(tasks, 3)
    strictEqual(peak <= 3, true, `peak concurrency was ${peak}`)
  })
})

describe('codeText', () => {
  it('joins code and text with a space, as the legacy consoles did', () => {
    // An em dash here would change every Type and Structure cell in the ticket tables.
    strictEqual(codeText('01', 'New'), '01 New')
  })

  it('returns the bare code when there is no text, and "" when there is no code', () => {
    strictEqual(codeText('01', undefined), '01')
    strictEqual(codeText('', 'New'), '')
    strictEqual(codeText(undefined, 'New'), '')
  })
})
