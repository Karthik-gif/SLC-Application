import { strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ALLOWED_TYPES, MAX_BYTES, validateAvatarFile } from './avatar.ts'

describe('validateAvatarFile', () => {
  it('accepts every allowed raster type at a reasonable size', () => {
    for (const type of ALLOWED_TYPES) {
      strictEqual(validateAvatarFile({ type, size: 50_000 }), undefined)
    }
  })

  it('rejects SVG, which can carry script', () => {
    const error = validateAvatarFile({ type: 'image/svg+xml', size: 1_000 })
    strictEqual(error, 'Choose a PNG, JPEG, WebP or GIF image.')
  })

  it('rejects a non-image outright', () => {
    strictEqual(
      validateAvatarFile({ type: 'application/pdf', size: 1_000 }),
      'Choose a PNG, JPEG, WebP or GIF image.',
    )
  })

  it('rejects an empty type, which is what a browser reports for an unknown file', () => {
    strictEqual(
      validateAvatarFile({ type: '', size: 1_000 }),
      'Choose a PNG, JPEG, WebP or GIF image.',
    )
  })

  it('rejects a file over the size cap', () => {
    const error = validateAvatarFile({ type: 'image/png', size: MAX_BYTES + 1 })
    strictEqual(error, 'That image is larger than 1MB. Choose a smaller one.')
  })

  it('accepts one exactly at the cap', () => {
    strictEqual(validateAvatarFile({ type: 'image/png', size: MAX_BYTES }), undefined)
  })

  it('checks the type before the size, so a huge PDF is reported as the wrong kind', () => {
    strictEqual(
      validateAvatarFile({ type: 'application/pdf', size: MAX_BYTES * 10 }),
      'Choose a PNG, JPEG, WebP or GIF image.',
    )
  })
})
