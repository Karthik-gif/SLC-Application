import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { AppShell, Button, EmptyState } from '@slc/ui'
import './placeholder.css'

export type PlaceholderProps = {
  title: string
  subtitle: string
  legacyFile: string
  services: string[]
  note?: string
}

/**
 * Stands in for an application whose conversion from the legacy HTML has not been done yet.
 * It states exactly what is missing instead of rendering an empty screen, so a tile opened
 * from the launcher is never a dead end.
 *
 * Replace the whole component when converting: the route, the shell, the shared client and
 * the design tokens are already in place, so a conversion only writes that app's own screens.
 */
export function AppPlaceholder({ title, subtitle, legacyFile, services, note }: PlaceholderProps) {
  return (
    <AppShell
      title={title}
      subtitle={subtitle}
      nav={
        <Link to="/" className="slc-btn slc-btn--ghost">
          ← Menu
        </Link>
      }
    >
      <div className="placeholder">
        <EmptyState
          title="Not converted yet"
          detail={
            <>
              <p>
                This application still lives in <code>{legacyFile}</code>. The route, shell, gateway and
                shared client are ready; what remains is porting the screens.
              </p>
              {note ? (
                <p>
                  <strong>Note:</strong> {note}
                </p>
              ) : null}
              <p>
                {services.length > 0 ? (
                  <>
                    Backends it uses:{' '}
                    {services.map((key, index) => (
                      <Fragment key={key}>
                        {index > 0 ? ', ' : null}
                        <code>{key}</code>
                      </Fragment>
                    ))}
                  </>
                ) : (
                  'No backend is configured for it yet.'
                )}
              </p>
            </>
          }
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
