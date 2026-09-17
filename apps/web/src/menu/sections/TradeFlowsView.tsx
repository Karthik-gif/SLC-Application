import { Tile } from '../Tile.tsx'
import { TRADE_FLOWS_GROUP } from '../types.ts'
import type { MenuNode, MenuTile } from '../types.ts'

/**
 * Trade Flows, promoted out of the menu path into a section of its own.
 *
 * The tiles are the real applications, not placeholders: they come from the same
 * config/menu.json group Functionality used to show and launch through config/apps.json
 * exactly as before, so moving them changed where they live and nothing about what they do.
 */
export function TradeFlowsView({ groups, onLaunch }: {
  groups: MenuNode[]
  onLaunch: (tile: MenuTile) => void
}) {
  const group = groups.find((candidate) => candidate.label === TRADE_FLOWS_GROUP)
  const tiles = group?.items ?? []

  return (
    <>
      <div className="hub-title">Trade Flows</div>
      <div className="hub-sub">
        Upload trade flows from the Excel template, then review and maintain the ones already
        posted.
      </div>
      <div className="tile-grid">
        {tiles.map((tile) => (
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
