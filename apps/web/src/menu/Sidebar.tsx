import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const STORAGE_KEY = 'slc.hub.sidebar'

const ICON_MASTER_DATA =
  'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z'
const ICON_OVERVIEW = 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
const ICON_FUNCTIONALITY =
  'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z'
const ICON_REPORTING =
  'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'
const ICON_ADMIN =
  'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'

const CHEVRON_LEFT = 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
const CHEVRON_RIGHT = 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'

type SidebarItem = { to: string; label: string; icon: string; end?: boolean }

/** Order is the order the sections were asked for; Functionality keeps `/`. */
const ITEMS: SidebarItem[] = [
  { to: '/master-data', label: 'Master Data', icon: ICON_MASTER_DATA },
  { to: '/overview', label: 'Overview', icon: ICON_OVERVIEW },
  { to: '/', label: 'Functionality', icon: ICON_FUNCTIONALITY, end: true },
  { to: '/reporting', label: 'Reporting', icon: ICON_REPORTING },
  { to: '/admin', label: 'Admin', icon: ICON_ADMIN },
]

/** Read during the state initialiser, not in an effect, so a collapsed sidebar never
 * renders expanded for a frame and then snaps. A blocked store just means expanded. */
function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'collapsed'
  } catch {
    return false
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggle = () => {
    setCollapsed((current) => {
      const next = !current
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'collapsed' : 'expanded')
      } catch {
        // Private browsing can refuse the write; the choice then just does not survive a reload.
      }
      return next
    })
  }

  return (
    <nav className={collapsed ? 'mp-side collapsed' : 'mp-side'} aria-label="SLC sections">
      <div className="mp-side-items">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? false}
            className={({ isActive }) => (isActive ? 'mp-side-item active' : 'mp-side-item')}
            title={collapsed ? item.label : ''}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            <span className="mp-side-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <button
        type="button"
        className="mp-side-toggle"
        onClick={toggle}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d={collapsed ? CHEVRON_RIGHT : CHEVRON_LEFT} />
        </svg>
        <span className="mp-side-label">Collapse</span>
      </button>
    </nav>
  )
}
