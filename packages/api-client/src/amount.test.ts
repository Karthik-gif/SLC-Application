import { strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatAmount, formatAmountWhileTyping, parseAmount, toNum } from './format.ts'

describe('parseAmount', () => {
  it('expands the magnitude suffixes, in either case', () => {
    strictEqual(parseAmount('2.5M'), 2_500_000)
    strictEqual(parseAmount('2.5m'), 2_500_000)
    strictEqual(parseAmount('3K'), 3_000)
    strictEqual(parseAmount('1B'), 1_000_000_000)
    strictEqual(parseAmount('1T'), 1_000_000_000_000)
  })

  it('ignores thousands separators, so its own output round-trips', () => {
    strictEqual(parseAmount('1,234,567.89'), 1_234_567.89)
    strictEqual(parseAmount(formatAmount(1_234_567.89)), 1_234_567.89)
  })

  it('returns null for unparseable input, which is not the same as zero', () => {
    strictEqual(parseAmount('abc'), null)
    strictEqual(parseAmount('1.2.3'), null)
    strictEqual(parseAmount('5X'), null)
    strictEqual(parseAmount('1M2'), null)
    strictEqual(parseAmount(''), null)
    strictEqual(parseAmount(null), null)
  })

  it('parses zero as zero rather than as empty', () => {
    strictEqual(parseAmount('0'), 0)
  })

  it('accepts a leading decimal point and a sign', () => {
    strictEqual(parseAmount('.5'), 0.5)
    strictEqual(parseAmount('.5M'), 500_000)
    strictEqual(parseAmount('-2K'), -2_000)
  })
})

describe('formatAmountWhileTyping', () => {
  it('groups the integer part', () => {
    strictEqual(formatAmountWhileTyping('1234567'), '1,234,567')
  })

  it('leaves a trailing decimal point alone so the next keystroke still works', () => {
    strictEqual(formatAmountWhileTyping('1234.'), '1,234.')
  })

  it('leaves a magnitude suffix alone, uppercased', () => {
    strictEqual(formatAmountWhileTyping('2.5m'), '2.5M')
  })

  it('keeps only the first decimal point', () => {
    strictEqual(formatAmountWhileTyping('1.2.3'), '1.23')
  })

  it('strips characters that are not part of a number', () => {
    strictEqual(formatAmountWhileTyping('12a34'), '1,234')
  })

  it('preserves a leading minus', () => {
    strictEqual(formatAmountWhileTyping('-1234'), '-1,234')
  })
})

describe('toNum', () => {
  it('reads a grouped display value back', () => {
    strictEqual(toNum('1,234.50'), 1234.5)
  })

  it('is 0 for anything unreadable, including empty and null', () => {
    strictEqual(toNum(''), 0)
    strictEqual(toNum(null), 0)
    strictEqual(toNum(undefined), 0)
    strictEqual(toNum('abc'), 0)
  })
})
