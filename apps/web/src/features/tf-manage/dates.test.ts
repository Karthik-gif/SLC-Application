import { strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatDateDigits, isCompleteDisplayDate, toDisplayDate, toIsoDate } from './dates.ts'

describe('toDisplayDate', () => {
  it('converts an ISO date to the DD-MM-YYYY the original shows', () => {
    strictEqual(toDisplayDate('2026-09-05'), '05-09-2026')
  })

  it('drops a time component, which OData may append', () => {
    strictEqual(toDisplayDate('2026-09-05T00:00:00Z'), '05-09-2026')
  })

  it('is empty for an absent value', () => {
    strictEqual(toDisplayDate(undefined), '')
    strictEqual(toDisplayDate(''), '')
    strictEqual(toDisplayDate(null), '')
  })

  it('passes through a value it does not recognise rather than hiding it', () => {
    // Blanking an unexpected value would silently lose data the backend sent.
    strictEqual(toDisplayDate('not-a-date'), 'not-a-date')
  })
})

describe('toIsoDate', () => {
  it('converts DD-MM-YYYY to ISO', () => {
    strictEqual(toIsoDate('05-09-2026'), '2026-09-05')
  })

  it('pads a single-digit day and month', () => {
    strictEqual(toIsoDate('5-9-2026'), '2026-09-05')
  })

  it('accepts slash and dot separators', () => {
    strictEqual(toIsoDate('05/09/2026'), '2026-09-05')
    strictEqual(toIsoDate('05.09.2026'), '2026-09-05')
  })

  it('is empty for a cleared field', () => {
    strictEqual(toIsoDate(''), '')
    strictEqual(toIsoDate('   '), '')
  })

  it('rejects a date that does not exist', () => {
    // 2026 is not a leap year, so 29 February must not roll into 1 March.
    strictEqual(toIsoDate('29-02-2026'), null)
    strictEqual(toIsoDate('31-04-2026'), null)
  })

  it('accepts a real leap day', () => {
    strictEqual(toIsoDate('29-02-2024'), '2024-02-29')
  })

  it('rejects a partially typed value', () => {
    strictEqual(toIsoDate('05-'), null)
    strictEqual(toIsoDate('05-09'), null)
    strictEqual(toIsoDate('05-09-20'), null)
  })

  it('rejects an out-of-range day or month', () => {
    strictEqual(toIsoDate('00-09-2026'), null)
    strictEqual(toIsoDate('05-13-2026'), null)
  })
})

describe('isCompleteDisplayDate', () => {
  it('is true only once the value parses to a real date', () => {
    strictEqual(isCompleteDisplayDate('05-09-2026'), true)
    strictEqual(isCompleteDisplayDate('05-09'), false)
    strictEqual(isCompleteDisplayDate('29-02-2026'), false)
  })

  it('treats empty as complete, since clearing a date is a valid edit', () => {
    strictEqual(isCompleteDisplayDate(''), true)
  })
})

describe('formatDateDigits', () => {
  it('inserts separators as digits arrive', () => {
    strictEqual(formatDateDigits('0'), '0')
    strictEqual(formatDateDigits('05'), '05')
    strictEqual(formatDateDigits('059'), '05-9')
    strictEqual(formatDateDigits('0509'), '05-09')
    strictEqual(formatDateDigits('05092026'), '05-09-2026')
  })

  it('ignores non-digits already present, so retyping is idempotent', () => {
    strictEqual(formatDateDigits('05-09-2026'), '05-09-2026')
  })

  it('stops at eight digits', () => {
    strictEqual(formatDateDigits('0509202699'), '05-09-2026')
  })

  it('is empty for no digits', () => {
    strictEqual(formatDateDigits(''), '')
    strictEqual(formatDateDigits('--'), '')
  })
})

describe('round trip', () => {
  it('survives ISO -> display -> ISO unchanged', () => {
    for (const iso of ['2026-09-05', '2024-02-29', '1999-12-31', '2000-01-01']) {
      strictEqual(toIsoDate(toDisplayDate(iso)), iso)
    }
  })
})
