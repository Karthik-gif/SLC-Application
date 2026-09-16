import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Spinner } from '@slc/ui'
import { useAuth } from './AuthContext.tsx'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  // Render nothing decisive until the session check finishes, or a reload would flash the
  // login page at an already-signed-in user before bouncing them back.
  if (status === 'checking') {
    return (
      <div className="slc-page-center">
        <Spinner label="Checking your session" />
      </div>
    )
  }

  if (status === 'anonymous') {
    // Remember where they were headed so sign-in returns them there, not to the menu.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return <>{children}</>
}
