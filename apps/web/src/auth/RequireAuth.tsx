import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Spinner } from '@slc/ui'
import { useAuth } from './AuthContext.tsx'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()

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
    // Sign-in always lands on Overview, so there is nothing to remember about where they were headed.
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
