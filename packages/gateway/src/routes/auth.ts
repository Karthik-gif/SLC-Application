import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const SESSION_COOKIE = 'slc_session'

/**
 * DEMO AUTHENTICATION — NOT A SECURITY BOUNDARY.
 *
 * It exists so the application has a real sign-in flow and a real session to hang the
 * shell on. It checks one shared username/password from the environment and does not
 * touch SAP: every OData call still runs as the technical user in config/services.json,
 * so SAP records the technical user, not the person signed in here.
 *
 * Replacing this with real authentication means changing this file only — the shell,
 * the launcher, and every app already treat "who is signed in" as gateway state read
 * through GET /auth/me. See docs/ARCHITECTURE.md, "Replacing demo auth".
 */
type SessionUser = { username: string; displayName: string }

/**
 * The gateway parses no request bodies — it forwards them byte-for-byte for the proxy — so
 * routes that do want JSON decode it themselves. Malformed input is an empty object, which
 * the caller then rejects as bad credentials rather than a 500.
 */
function readJson<T>(body: unknown): Partial<T> {
  if (!Buffer.isBuffer(body)) return (body ?? {}) as Partial<T>
  try {
    return JSON.parse(body.toString('utf8')) as Partial<T>
  } catch {
    return {}
  }
}

function credentials(): { user: string; password: string } {
  return {
    user: process.env['DEMO_USER'] ?? 'demo',
    password: process.env['DEMO_PASSWORD'] ?? 'demo',
  }
}

function readSession(req: FastifyRequest): SessionUser | undefined {
  const raw = req.cookies[SESSION_COOKIE]
  if (!raw) return undefined
  const unsigned = req.unsignCookie(raw)
  if (!unsigned.valid || !unsigned.value) return undefined
  try {
    return JSON.parse(Buffer.from(unsigned.value, 'base64url').toString('utf8')) as SessionUser
  } catch {
    return undefined
  }
}

export function requireSession(req: FastifyRequest, reply: FastifyReply): SessionUser | undefined {
  const session = readSession(req)
  if (!session) {
    reply.code(401).send({ error: { message: { value: 'Not signed in.' } } })
    return undefined
  }
  return session
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/login', async (req, reply) => {
    const body = readJson<{ username?: string; password?: string }>(req.body)
    const expected = credentials()
    const username = (body.username ?? '').trim()

    if (username.toLowerCase() !== expected.user.toLowerCase() || body.password !== expected.password) {
      // One message for both wrong-user and wrong-password: no hint about which half was right.
      return reply.code(401).send({ error: { message: { value: 'Incorrect username or password.' } } })
    }

    const session: SessionUser = { username, displayName: username }
    const value = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
    reply.setCookie(SESSION_COOKIE, value, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      signed: true,
      secure: process.env['NODE_ENV'] === 'production',
      maxAge: 60 * 60 * 8,
    })
    return { user: session }
  })

  app.post('/auth/logout', async (_req, reply) => {
    reply.clearCookie(SESSION_COOKIE, { path: '/' })
    return { ok: true }
  })

  app.get('/auth/me', async (req, reply) => {
    const session = readSession(req)
    if (!session) return reply.code(401).send({ error: { message: { value: 'Not signed in.' } } })
    return { user: session, mode: 'demo' }
  })
}
