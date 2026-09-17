import { Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { AppShell, Button, EmptyState, Spinner, ToastProvider } from '@slc/ui'
import { AuthProvider } from './auth/AuthContext.tsx'
import { LoginPage } from './auth/LoginPage.tsx'
import { RequireAuth } from './auth/RequireAuth.tsx'
import { MenuPage } from './menu/MenuPage.tsx'
import { FEATURES } from './features/registry.ts'
import './app.css'

/**
 * One SPA on one origin, replacing seven pages served by seven proxy.py processes on
 * ports 8765-8775. Each application is a lazy route, so the browser downloads only the
 * one that was opened.
 */
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireAuth><MenuPage section="functionality" /></RequireAuth>} />
            <Route path="/master-data" element={<RequireAuth><MenuPage section="master-data" /></RequireAuth>} />
            <Route path="/overview" element={<RequireAuth><MenuPage section="overview" /></RequireAuth>} />
            <Route path="/reporting" element={<RequireAuth><MenuPage section="reporting" /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><MenuPage section="admin" /></RequireAuth>} />
            <Route
              path="/apps/:appId"
              element={
                <RequireAuth>
                  <FeatureRoute />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function FeatureRoute() {
  const { appId } = useParams()
  const Feature = appId ? FEATURES[appId] : undefined

  if (!Feature) {
    return (
      <NotFound detail={`No application is registered at /apps/${appId ?? ''}.`} />
    )
  }

  return (
    <Suspense
      fallback={
        <div className="slc-page-center">
          <Spinner label="Opening application" />
        </div>
      }
    >
      <Feature />
    </Suspense>
  )
}

function NotFound({ detail }: { detail?: string }) {
  return (
    <AppShell title="SLC" subtitle="FS • VISTA">
      <div className="app-notfound">
        <EmptyState
          title="Page not found"
          detail={detail ?? 'That address does not match anything in this application.'}
          action={
            <Link to="/">
              <Button variant="primary">Back to menu</Button>
            </Link>
          }
        />
      </div>
    </AppShell>
  )
}
