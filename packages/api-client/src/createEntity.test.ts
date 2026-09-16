import { strictEqual } from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { createEntity } from './odata.ts'

type Call = { url: string; method: string }
const calls: Call[] = []

function stubFetch(responses: Array<{ status?: number; body: unknown; headers?: Record<string, string> }>) {
  let index = 0
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), method: init?.method ?? 'GET' })
    const next = responses[Math.min(index++, responses.length - 1)]!
    return new Response(JSON.stringify(next.body), {
      status: next.status ?? 200,
      headers: { 'content-type': 'application/json', ...next.headers },
    })
  }) as typeof fetch
}

afterEach(() => {
  calls.length = 0
})

describe('createEntity key recovery', () => {
  it('prefers the key in the response body', async () => {
    stubFetch([{ body: { ZottkNo: '100042' } }])
    const result = await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')
    strictEqual(result.key, '100042')
    // The body answered, so no extra round trip is made.
    strictEqual(calls.length, 1)
  })

  it('falls back to the OData-EntityId header', async () => {
    stubFetch([
      { body: {}, headers: { 'OData-EntityId': "https://sap/srv/SlcOttkDetail('100043')" } },
    ])
    strictEqual((await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')).key, '100043')
    strictEqual(calls.length, 1)
  })

  it('falls back to the Location header when OData-EntityId is absent', async () => {
    stubFetch([{ body: {}, headers: { Location: "https://sap/srv/SlcOttkDetail('100044')" } }])
    strictEqual((await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')).key, '100044')
  })

  it('percent-decodes a key taken from the header', async () => {
    stubFetch([{ body: {}, headers: { Location: "https://sap/srv/Thing('A%2FB')" } }])
    strictEqual((await createEntity('/api/ottk/Thing', {}, 'Id')).key, 'A/B')
  })

  it('re-reads the highest key when the create answers with nothing usable', async () => {
    stubFetch([{ body: {} }, { body: { value: [{ ZottkNo: '100045' }] } }])
    const result = await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')
    strictEqual(result.key, '100045')
    strictEqual(calls.length, 2)
    // The re-read must sort descending and take one row, or it returns the oldest ticket.
    strictEqual(calls[1]?.url.includes('%24orderby=ZottkNo+desc'), true, calls[1]?.url)
    strictEqual(calls[1]?.url.includes('%24top=1'), true, calls[1]?.url)
  })

  it('sorts by fallbackOrder when the key field is not the sortable one', async () => {
    stubFetch([{ body: {} }, { body: { value: [] } }])
    await createEntity('/api/tf/TrdFlow', {}, 'Uuid', { fallbackOrder: 'CreatedAt' })
    strictEqual(calls[1]?.url.includes('%24orderby=CreatedAt+desc'), true, calls[1]?.url)
  })

  it('returns undefined rather than inventing a key when every source is empty', async () => {
    stubFetch([{ body: {} }, { body: { value: [] } }])
    strictEqual((await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')).key, undefined)
  })

  it('does not treat an empty-string key in the body as an answer', async () => {
    stubFetch([{ body: { ZottkNo: '' } }, { body: { value: [{ ZottkNo: '100046' }] } }])
    strictEqual((await createEntity('/api/ottk/SlcOttkDetail', {}, 'ZottkNo')).key, '100046')
  })
})
