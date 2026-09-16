import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button, Field, FS_LOGO, Spinner } from '@slc/ui'
import { useAuth } from './AuthContext.tsx'
import './login.css'

export function LoginPage() {
  const { status, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  if (status === 'checking') {
    return (
      <div className="slc-page-center">
        <Spinner label="Checking your session" />
      </div>
    )
  }
  if (status === 'authenticated') return <Navigate to={from} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(undefined)
    setBusy(true)
    try {
      await signIn(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={onSubmit} noValidate>
        <div className="login__brand">
          <img src={FS_LOGO} alt="" className="login__mark" />
          <div>
            <h1 className="login__title">SLC</h1>
            <p className="login__tagline">FS &bull; VISTA</p>
          </div>
        </div>

        <p className="login__intro">Sign in to open the application menu.</p>

        <Field label="Username" required>
          {(id) => (
            <input
              id={id}
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          )}
        </Field>

        <Field label="Password" required>
          {(id) => (
            <input
              id={id}
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          )}
        </Field>

        {/* role="alert" so the failure is announced, not just shown. */}
        {error ? (
          <p className="login__error" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" loading={busy} className="login__submit">
          Sign in
        </Button>

        <p className="login__note">
          <strong>Demo sign-in.</strong> This checks one shared username and password and is not a security
          boundary. SAP calls still run as the technical user configured on the gateway, so SAP records that
          user rather than the person signed in here.
        </p>
      </form>
    </div>
  )
}
