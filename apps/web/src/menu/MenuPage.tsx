import { Fragment, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignOutButton } from '../auth/SignOutButton.tsx'
import { apiFetch } from '@slc/api-client'
import { useAsync } from '@slc/api-client/react'
import { childrenOf } from './types.ts'
import type { AppEntry, MenuNode, MenuTile } from './types.ts'
import './menu-path.css'
import './menu-path.overrides.css'

/**
 * SLC menu path.
 *
 * A faithful reproduction of legacy/Menu Path.html: the markup below mirrors that page's
 * renderProgramTile / renderFolderTile / renderHome / renderFolderDetail element for element
 * and class for class, and menu-path.css is that page's own stylesheet with selectors scoped
 * under .mp. Anything that looks like it could be simplified is most likely load-bearing for
 * the appearance — check the original before changing it.
 *
 * What differs, and only because it must: tiles resolve through config/apps.json to an
 * in-app route instead of a hardcoded localhost port, and the menu tree is fetched rather
 * than inlined.
 */

const FOLDER_SVG =
  'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'

const BRAND_LOGO =
  'https://raw.githubusercontent.com/ryannayak/fs-assets/e82f35a83e28689167b22b4300d4994a249acee0/fs-short-logo.png'

function Tile({ icon, title, desc, tag, folder, onClick }: {
  icon: string
  title: string
  desc: string
  tag: string
  folder?: boolean
  onClick: () => void
}) {
  return (
    <div className={folder ? 'tile folder' : 'tile'} onClick={onClick}>
      <div className="tile-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d={icon} />
        </svg>
      </div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
      <div className="tile-foot">
        <span className="tile-tag">{tag}</span>
        <span className="tile-arrow">&#8594;</span>
      </div>
    </div>
  )
}

/** Exactly the wording renderFolderTile() produced. */
function folderDesc(node: MenuNode): string {
  const kids = childrenOf(node)
  if (!kids.length) return 'Not set up yet.'
  if (node.subgroups) return `${kids.length} folder${kids.length !== 1 ? 's' : ''} in this area.`
  return `${kids.length} screen${kids.length !== 1 ? 's' : ''} in this sub-process.`
}

export function MenuPage() {
  const navigate = useNavigate()
  const [path, setPath] = useState<number[]>([])
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

  const nodeAt = useCallback(
    (target: number[]): MenuNode | undefined => {
      let node: MenuNode | undefined = groups[target[0] ?? -1]
      for (let i = 1; i < target.length; i++) node = node?.subgroups?.[target[i] ?? -1]
      return node
    },
    [groups],
  )

  const trailAt = useCallback(
    (target: number[]): string[] => {
      const out: string[] = []
      let node: MenuNode | undefined = groups[target[0] ?? -1]
      if (node) out.push(node.label)
      for (let i = 1; i < target.length; i++) {
        node = node?.subgroups?.[target[i] ?? -1]
        if (node) out.push(node.label)
      }
      return out
    },
    [groups],
  )

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

  const openFolder = useCallback(
    (target: number[]) => {
      const node = nodeAt(target)
      if (!node) return
      if (!childrenOf(node).length) {
        showToast(`${node.label} has nothing in it yet.`)
        return
      }
      setPath(target)
      window.scrollTo(0, 0)
    },
    [nodeAt, showToast],
  )

  const goUp = () => {
    setPath((current) => (current.length > 2 ? current.slice(0, -1) : []))
    window.scrollTo(0, 0)
  }

  const current = path.length ? nodeAt(path) : undefined
  const trail = path.length ? trailAt(path) : []
  // Back goes up exactly one level: to the parent folder, or home from the top.
  const backLabel = path.length > 2 ? (trail[trail.length - 2] ?? 'SLC Menu Path') : 'SLC Menu Path'

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
        {path.length === 0 ? (
          <>
            <div className="hub-title">SLC</div>
            <div className="hub-sub">
              Applications on their own dedicated OData service. Anything that reaches SAP through the
              dynamic gateway lives on the Dynamic Gateway hub.
            </div>
            {/* A Fragment, not a wrapper div: .group-label:first-of-type{margin-top:0} would
                match inside every wrapper and flatten the 24px gap between sections. */}
            {groups.map((group, gi) => (
              <Fragment key={group.label}>
                <div className="group-label">{group.label}</div>
                <div className="tile-grid">
                  {group.items
                    ? group.items.map((tile) => (
                        <Tile
                          key={tile.code}
                          icon={tile.icon}
                          title={tile.title}
                          desc={tile.desc}
                          tag={tile.tag}
                          onClick={() => launch(tile)}
                        />
                      ))
                    : (group.subgroups ?? []).map((sub, si) => (
                        <Tile
                          key={sub.label}
                          icon={FOLDER_SVG}
                          title={sub.label}
                          desc={folderDesc(sub)}
                          tag="Folder"
                          folder
                          onClick={() => openFolder([gi, si])}
                        />
                      ))}
                </div>
              </Fragment>
            ))}
          </>
        ) : current ? (
          <>
            <div className="back-btn" onClick={goUp}>
              &#8592; Back to {backLabel}
            </div>
            <div className="hub-title">{current.label}</div>
            <div className="hub-sub">
              {trail.slice(0, -1).join(' › ')}. Pick a {current.subgroups ? 'folder' : 'screen'} below.
            </div>
            <div className="tile-grid">
              {current.subgroups
                ? current.subgroups.map((sub, si) => (
                    <Tile
                      key={sub.label}
                      icon={FOLDER_SVG}
                      title={sub.label}
                      desc={folderDesc(sub)}
                      tag="Folder"
                      folder
                      onClick={() => openFolder([...path, si])}
                    />
                  ))
                : (current.items ?? []).map((tile) => (
                    <Tile
                      key={tile.code}
                      icon={tile.icon}
                      title={tile.title}
                      desc={tile.desc}
                      tag={tile.tag}
                      onClick={() => launch(tile)}
                    />
                  ))}
            </div>
          </>
        ) : null}
      </main>

      <div className={toast ? 'toast show' : 'toast'}>{toast}</div>
    </div>
  )
}
