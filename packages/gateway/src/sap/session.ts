import { CookieJar } from 'tough-cookie'
import { request } from 'undici'
import type { Service } from '../config.ts'

/**
 * Per-service SAP session: the cookie jar SAP's stateful CSRF handshake depends on,
 * plus the token itself. Kept per service key because each OData service issues its
 * own session — proxy.py made the same split, one _sessions entry per key.
 *
 * Created lazily: a service nobody calls opens no session and costs nothing.
 */
export type SapSession = {
  jar: CookieJar
  token: string | undefined
}

const sessions = new Map<string, SapSession>()

export function sessionFor(key: string): SapSession {
  let session = sessions.get(key)
  if (!session) {
    session = { jar: new CookieJar(), token: undefined }
    sessions.set(key, session)
  }
  return session
}

/** Drops a service's session. Used by tests and by a future re-login. */
export function resetSession(key: string): void {
  sessions.delete(key)
}

export function serviceUrl(service: Service, path: string, query: string): string {
  const base = service.base
  const trimmed = path.replace(/^\/+/, '')
  const qs = service.client
    ? query
      ? `${query}&sap-client=${service.client}`
      : `sap-client=${service.client}`
    : query
  const tail = trimmed ? `/${trimmed}` : '/'
  return qs ? `${base}${tail}?${qs}` : `${base}${tail}`
}

export async function cookieHeader(session: SapSession, url: string): Promise<string> {
  return session.jar.getCookieString(url)
}

export async function storeCookies(
  session: SapSession,
  url: string,
  setCookie: string | string[] | undefined,
): Promise<void> {
  if (!setCookie) return
  const list = Array.isArray(setCookie) ? setCookie : [setCookie]
  await Promise.all(
    // A cookie SAP sends that tough-cookie rejects (bad domain, malformed expiry) must not
    // fail the user's request — the call itself may still be perfectly valid.
    list.map((cookie) => session.jar.setCookie(cookie, url).catch(() => undefined)),
  )
}

/**
 * Fetches a CSRF token. SAP answers the fetch on the service root; some releases answer
 * with an error status and still return a usable token in the header, which is why the
 * failure path reads the header too rather than throwing.
 */
export async function fetchCsrfToken(service: Service): Promise<string | undefined> {
  const session = sessionFor(service.key)
  const url = serviceUrl(service, '', '')
  const headers: Record<string, string> = { 'x-csrf-token': 'Fetch', accept: 'application/json' }
  if (service.authHeader) headers['authorization'] = service.authHeader
  const cookie = await cookieHeader(session, url)
  if (cookie) headers['cookie'] = cookie

  try {
    const res = await request(url, { method: 'GET', headers, dispatcher: service.agent })
    await storeCookies(session, url, res.headers['set-cookie'])
    session.token = firstHeader(res.headers['x-csrf-token'])
    await res.body.dump()
  } catch {
    session.token = undefined
  }
  return session.token
}

export function firstHeader(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value[0] : value
}
