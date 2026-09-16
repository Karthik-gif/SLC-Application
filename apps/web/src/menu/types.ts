/** Shapes of config/menu.json and config/apps.json, both served by the gateway. */

export type MenuTile = {
  code: string
  title: string
  tag: string
  desc: string
  icon: string
  /** Present on tiles the legacy launcher pointed at a localhost port. */
  url?: string
  /** Present on tiles that record an intent with no application behind it. */
  action?: string
}

export type MenuNode = {
  label: string
  items?: MenuTile[]
  subgroups?: MenuNode[]
}

export type AppStatus = 'ready' | 'scaffold' | 'planned'

export type AppEntry = {
  code: string
  id: string
  route: string
  title: string
  status: AppStatus
  services: string[]
  legacy?: string
  legacyPort?: number
  note?: string
}

export function childrenOf(node: MenuNode): MenuNode[] | MenuTile[] {
  return node.subgroups ?? node.items ?? []
}

export function isFolder(node: MenuNode | MenuTile): node is MenuNode {
  return 'label' in node
}
