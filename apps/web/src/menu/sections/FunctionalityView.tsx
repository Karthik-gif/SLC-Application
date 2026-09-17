import { Fragment, useCallback, useState } from 'react'
import { FOLDER_SVG, Tile } from '../Tile.tsx'
import { childrenOf } from '../types.ts'
import type { MenuNode, MenuTile } from '../types.ts'

/** Exactly the wording renderFolderTile() produced. */
function folderDesc(node: MenuNode): string {
  const kids = childrenOf(node)
  if (!kids.length) return 'Not set up yet.'
  if (node.subgroups) return `${kids.length} folder${kids.length !== 1 ? 's' : ''} in this area.`
  return `${kids.length} screen${kids.length !== 1 ? 's' : ''} in this sub-process.`
}

/**
 * The SLC menu path itself: the tile grid, folder drill-down and launcher that were
 * legacy/Menu Path.html. Moved out of MenuPage unchanged when the hub gained a sidebar —
 * the markup below is still that page's, element for element and class for class.
 */
export function FunctionalityView({ groups, onLaunch, onToast, scrollToTop }: {
  groups: MenuNode[]
  onLaunch: (tile: MenuTile) => void
  onToast: (message: string) => void
  // <main>, not the document, is the scroll container here (see MenuPage), so drilling in or
  // going up must scroll that element back to the top, not call window.scrollTo.
  scrollToTop: () => void
}) {
  const [path, setPath] = useState<number[]>([])

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

  const openFolder = useCallback(
    (target: number[]) => {
      const node = nodeAt(target)
      if (!node) return
      if (!childrenOf(node).length) {
        onToast(`${node.label} has nothing in it yet.`)
        return
      }
      setPath(target)
      scrollToTop()
    },
    [nodeAt, onToast, scrollToTop],
  )

  const goUp = () => {
    setPath((current) => (current.length > 2 ? current.slice(0, -1) : []))
    scrollToTop()
  }

  const current = path.length ? nodeAt(path) : undefined
  const trail = path.length ? trailAt(path) : []
  // Back goes up exactly one level: to the parent folder, or home from the top.
  const backLabel = path.length > 2 ? (trail[trail.length - 2] ?? 'SLC Menu Path') : 'SLC Menu Path'

  if (path.length === 0) {
    return (
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
                      onClick={() => onLaunch(tile)}
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
    )
  }

  if (!current) return null

  return (
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
                onClick={() => onLaunch(tile)}
              />
            ))}
      </div>
    </>
  )
}
