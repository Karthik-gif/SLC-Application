import { strictEqual, throws } from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import { loadServices } from './config.ts'

const dir = mkdtempSync(join(tmpdir(), 'slc-config-'))
let counter = 0

function configFile(contents: unknown): string {
  const path = join(dir, `services-${counter++}.json`)
  writeFileSync(path, JSON.stringify(contents))
  return path
}

const BASE = 'https://sap.example.test/sap/opu/odata4/x/0001'

afterEach(() => {
  delete process.env['TEST_SAP_PASSWORD']
})

describe('loadServices', () => {
  it('rejects an unknown kind, because a typo must not become a runtime 404', () => {
    const path = configFile({ services: { a: { kind: 'sopa', base: BASE, client: '100' } } })
    throws(() => loadServices(path), /kind must be one of/)
  })

  it('rejects a relative base URL', () => {
    const path = configFile({ services: { a: { kind: 'rest', base: '/api/thing' } } })
    throws(() => loadServices(path), /absolute http\(s\) URL/)
  })

  it('requires sap-client for an SAP service but not for a REST one', () => {
    throws(() => loadServices(configFile({ services: { a: { kind: 'odata', base: BASE } } })), /needs "client"/)
    const services = loadServices(configFile({ services: { a: { kind: 'rest', base: BASE } } }))
    strictEqual(services.get('a')?.kind, 'rest')
  })

  it('rejects a reference to an auth block that does not exist', () => {
    const path = configFile({ services: { a: { kind: 'rest', base: BASE, auth: 'ghost' } } })
    throws(() => loadServices(path), /auth "ghost" is not defined/)
  })

  it('rejects a config with no services at all', () => {
    throws(() => loadServices(configFile({ services: {} })), /defines no services/)
  })

  it('marks a service unavailable when its secret is missing, and still loads the rest', () => {
    const path = configFile({
      auth: { sap: { kind: 'basic', user: 'FS_DEV3', passwordEnv: 'TEST_SAP_PASSWORD' } },
      services: {
        withSecret: { kind: 'odata', base: BASE, client: '100', auth: 'sap' },
        noAuth: { kind: 'rest', base: BASE },
      },
    })
    const services = loadServices(path)
    // One missing password disables one backend; it must not take the gateway down.
    strictEqual(services.size, 2)
    strictEqual(services.get('withSecret')?.unavailable?.includes('TEST_SAP_PASSWORD'), true)
    strictEqual(services.get('withSecret')?.authHeader, undefined)
    strictEqual(services.get('noAuth')?.unavailable, undefined)
  })

  it('builds the Basic header when the secret is present', () => {
    process.env['TEST_SAP_PASSWORD'] = 'hunter2'
    const path = configFile({
      auth: { sap: { kind: 'basic', user: 'FS_DEV3', passwordEnv: 'TEST_SAP_PASSWORD' } },
      services: { a: { kind: 'odata', base: BASE, client: '100', auth: 'sap' } },
    })
    const service = loadServices(path).get('a')
    strictEqual(service?.unavailable, undefined)
    strictEqual(service?.authHeader, 'Basic ' + Buffer.from('FS_DEV3:hunter2').toString('base64'))
  })

  it('strips a trailing slash from base so path joining cannot double it', () => {
    const path = configFile({ services: { a: { kind: 'rest', base: BASE + '/' } } })
    strictEqual(loadServices(path).get('a')?.base, BASE)
  })
})
