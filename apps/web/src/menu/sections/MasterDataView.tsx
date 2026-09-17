import { Fragment } from 'react'
import { Tile } from '../Tile.tsx'
import { MASTER_DATA_GROUPS } from '../mock/master-data.ts'

/**
 * Reference data behind the SLC screens. The tiles are placeholders — see
 * mock/master-data.ts — so clicking one says so rather than navigating, which is the same
 * thing the launcher does for an application that is not wired up.
 */
export function MasterDataView({ onToast }: { onToast: (message: string) => void }) {
  return (
    <>
      <div className="hub-title">Master Data</div>
      <div className="hub-sub">
        Reference data behind the SLC screens. These tiles are placeholders — none of them is
        wired to SAP yet.
      </div>
      {/* A Fragment, not a wrapper div: .group-label:first-of-type{margin-top:0} would match
          inside every wrapper and flatten the 24px gap between sections. */}
      {MASTER_DATA_GROUPS.map((group) => (
        <Fragment key={group.label}>
          <div className="group-label">{group.label}</div>
          <div className="tile-grid">
            {group.items.map((tile) => (
              <Tile
                key={tile.code}
                icon={tile.icon}
                title={tile.title}
                desc={tile.desc}
                tag={tile.tag}
                onClick={() => onToast(`${tile.title} is not set up yet.`)}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </>
  )
}
