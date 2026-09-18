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

/**
 * The one menu.json group the hub shows as its own section rather than inside the menu path.
 *
 * config/menu.json stays the single source of truth for these tiles — it is still the tree
 * extracted verbatim from the legacy page — and the split happens here, at the UI layer:
 * TradeFlowsView renders this group, SlcStructureView skips it. Matching by label rather
 * than adding a field to menu.json keeps that file untouched; if the group is ever renamed
 * there, it reappears under SLC Structure rather than vanishing, which is the safe failure.
 */
export const TRADE_FLOWS_GROUP = 'Trade Flows'

/**
 * Everything inside a node, folders and screens together.
 *
 * A node can hold both: the FX menu's Front-Office group has nine transactions and two
 * folders beside them. Callers use this for "is there anything in here", so it has to count
 * both rather than pick whichever list is present.
 */
export function childrenOf(node: MenuNode): (MenuNode | MenuTile)[] {
  return [...(node.subgroups ?? []), ...(node.items ?? [])]
}

export function isFolder(node: MenuNode | MenuTile): node is MenuNode {
  return 'label' in node
}
