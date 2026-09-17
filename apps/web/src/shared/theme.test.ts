import { strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveTheme } from './theme.ts'

describe('resolveTheme', () => {
  it('honours an explicit choice over the OS preference', () => {
    strictEqual(resolveTheme('light', true), 'light')
    strictEqual(resolveTheme('dark', false), 'dark')
  })

  it('falls back to the OS preference when nothing was chosen', () => {
    strictEqual(resolveTheme(null, true), 'dark')
    strictEqual(resolveTheme(null, false), 'light')
  })

  it('ignores a value it does not recognise rather than trusting it', () => {
    // localStorage is editable by hand, so a junk value must not become a theme.
    strictEqual(resolveTheme('midnight', true), 'dark')
    strictEqual(resolveTheme('', false), 'light')
  })
})
