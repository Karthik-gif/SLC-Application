import { useMemo } from 'react'
import { MenuBrowser } from './MenuBrowser.tsx'
import { TRADE_FLOWS_GROUP } from '../types.ts'
import type { MenuNode, MenuTile } from '../types.ts'

/**
 * SLC Structure: the menu path from config/menu.json, browsed as tiles and folders.
 *
 * Everything that draws that browser lives in MenuBrowser, which FX Structure shares. What
 * belongs to this section alone is the one group it hides and the wording at the top.
 */
export function SlcStructureView({ groups: allGroups, onLaunch, onToast, scrollToTop }: {
  groups: MenuNode[]
  onLaunch: (tile: MenuTile) => void
  onToast: (message: string) => void
  scrollToTop: () => void
}) {
  // Trade Flows has its own section now, so it is filtered out here rather than removed from
  // config/menu.json. Filtering before anything else matters: the browser's `path` indexes
  // into this array, so the drill-down must never see the unfiltered one.
  const groups = useMemo(
    () => allGroups.filter((group) => group.label !== TRADE_FLOWS_GROUP),
    [allGroups],
  )

  return (
    <MenuBrowser
      title="SLC Structure"
      sub="Applications on their own dedicated OData service. Anything that reaches SAP through the dynamic gateway lives on the Dynamic Gateway hub."
      groups={groups}
      onLaunch={onLaunch}
      onToast={onToast}
      scrollToTop={scrollToTop}
    />
  )
}
