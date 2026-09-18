import { apiFetch } from '@slc/api-client'
import { useAsync } from '@slc/api-client/react'
import { MenuBrowser } from './MenuBrowser.tsx'
import type { MenuNode, MenuTile } from '../types.ts'

/**
 * FX Structure: the SAP FX menu tree, browsed with the same tiles and folders as SLC
 * Structure.
 *
 * The tree is config/fx-menu.json — the transactions as the SAP menu lists them, codes and
 * all — and it is fetched here rather than in MenuPage because this is the only section that
 * reads it; the hub's other five pages should not pull it down.
 *
 * None of these transactions has a converted screen behind it yet. They are still tiles
 * rather than a list, because launching one is what will eventually happen, and until then
 * config/apps.json has no entry for the code and the launcher says so in a toast.
 */
export function FxStructureView({ onLaunch, onToast, scrollToTop }: {
  onLaunch: (tile: MenuTile) => void
  onToast: (message: string) => void
  scrollToTop: () => void
}) {
  const menu = useAsync<MenuNode[]>(() => apiFetch<MenuNode[]>('/config/fx-menu.json'), [])

  return (
    <MenuBrowser
      title="FX Structure"
      sub="Master contract, front office, mid office and settlement transactions from the SAP FX menu. None of them is converted yet — the tiles are the map, not the applications."
      groups={menu.data ?? []}
      onLaunch={onLaunch}
      onToast={onToast}
      scrollToTop={scrollToTop}
    />
  )
}
