import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, apiFetch } from '@slc/api-client'

export type User = { username: string; displayName: string }

type AuthState =
  | { status: 'checking'; user: undefined }
  | { status: 'authenticated'; user: User }
  | { status: 'anonymous'; user: undefined }

type AuthApi = AuthState & {
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthApi | undefined>(undefined)

export function useAuth(): AuthApi {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>.')
  return auth
}

/**
 * Holds who is signed in. The session itself lives in an httpOnly cookie the gateway sets,
 * so no token is ever readable from JavaScript and a page reload re-establishes state from
 * GET /auth/me rather than from anything stored in the browser.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'checking', user: undefined })

  useEffect(() => {
    let cancelled = false
    apiFetch<{ user: User }>('/auth/me')
      .then((data) => {
        if (!cancelled) setState({ status: 'authenticated', user: data.user })
      })
      .catch(() => {
        // A 401 here is the normal "not signed in yet" case, not an error worth surfacing.
        if (!cancelled) setState({ status: 'anonymous', user: undefined })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const data = await apiFetch<{ user: User }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      setState({ status: 'authenticated', user: data.user })
    } catch (error) {
      setState({ status: 'anonymous', user: undefined })
      throw error instanceof ApiError ? error : new Error('Sign-in failed.')
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } finally {
      // Whatever the gateway said, stop treating this browser as signed in.
      setState({ status: 'anonymous', user: undefined })
    }
  }, [])

  const value = useMemo<AuthApi>(() => ({ ...state, signIn, signOut }), [state, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
