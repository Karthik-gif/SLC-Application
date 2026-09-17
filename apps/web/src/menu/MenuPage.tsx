import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignOutButton } from '../auth/SignOutButton.tsx'
import { apiFetch } from '@slc/api-client'
import { useAsync } from '@slc/api-client/react'
import { FunctionalityView } from './sections/FunctionalityView.tsx'
import type { AppEntry, MenuNode, MenuTile } from './types.ts'
import './menu-path.css'
import './menu-path.overrides.css'

/**
 * SLC hub shell: header, sign-out and the toast, hosting the menu path section below.
 *
 * Fetches the menu tree and the app registry, resolves tiles through config/apps.json to an
 * in-app route, and owns the toast shown when a tile launches or fails to. The tile browser
 * itself — the faithful reproduction of legacy/Menu Path.html — lives in FunctionalityView.
 */

const BRAND_LOGO =
  'https://raw.githubusercontent.com/ryannayak/fs-assets/e82f35a83e28689167b22b4300d4994a249acee0/fs-short-logo.png'

export function MenuPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<string>()

  const menu = useAsync<MenuNode[]>(() => apiFetch<MenuNode[]>('/config/menu.json'), [])
  const registry = useAsync<{ apps: AppEntry[] }>(() => apiFetch('/config/apps.json'), [])

  const appsByCode = useMemo(() => {
    const map = new Map<string, AppEntry>()
    for (const app of registry.data?.apps ?? []) map.set(app.code, app)
    return map
  }, [registry.data])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(undefined), 2200)
  }, [])

  const groups = menu.data ?? []

  const launch = useCallback(
    (tile: MenuTile) => {
      const app = appsByCode.get(tile.code)
      if (!app || app.status === 'planned') {
        showToast(`${tile.title} is not wired up yet.`)
        return
      }
      showToast(`Opening ${tile.title}…`)
      navigate(app.route)
    },
    [appsByCode, navigate, showToast],
  )

  return (
    <div className="mp">
      <header>
        <div className="brand">
          <img className="brand-logo" alt="Fourth Signal" src={BRAND_LOGO} />
          <div className="brand-text">
            <h1>SLC</h1>
            <p>FS &bull; VISTA</p>
          </div>
        </div>
        <div className="header-right">
          <a
            className="path-switch"
            href="http://localhost:8775/"
            title="Applications that reach SAP through the dynamic gateway"
            onClick={(event) => {
              // The dynamic gateway hub has not been converted, so this does not navigate yet.
              event.preventDefault()
              showToast('The Dynamic Gateway hub is not part of this application yet.')
            }}
          >
            <span className="ps-label">Other path</span> Dynamic Gateway &rarr;
          </a>
          <div className="status-dot" title="SAP TRM connected" />
          <SignOutButton className="path-switch mp-signout" showIcon={false} />
        </div>
      </header>

      <main>
        <FunctionalityView groups={groups} onLaunch={launch} onToast={showToast} />
      </main>

      <div className={toast ? 'toast show' : 'toast'}>{toast}</div>
    </div>
  )
}
