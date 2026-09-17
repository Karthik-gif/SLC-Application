/**
 * A TrdFlow row as the gateway returns it. Property names are the OData field names, so a
 * row can be PATCHed back without a translation layer. Every field is optional: SAP omits
 * nulls from a JSON projection rather than sending them as null.
 */
export type TrdFlowRow = {
  ZtfNo?: string
  ZtfSplit?: string
  ZtfDate?: string
  Zbu?: string
  Zoprtr?: string
  ZblVsslName?: string
  Zcmmd?: string
  ZconNum1?: string
  ZpurInc?: string
  Zpaypur?: string
  Zbplsb?: string
  Zbplbb?: string
  ZconNum2?: string
  Zsalesinc?: string
  Zptss?: string
  Zbslsb?: string
  Zbslbb?: string
  Zotfd?: string
  Zottd?: string
  Zquantity?: number
  Zunit?: number
  Zcprice?: number
  Zttv?: number
  Zpol?: string
  Zpod?: string
  Zsldate?: string
  Zblno?: string
  Zdays?: string
  ZetaDsPort?: string
  Zcob?: string
  Znotify?: string
  Zlc?: string
  Zoentity?: string
  Zsod?: string
  Zbod?: string
  Zaobf13?: string
  Zaobt13?: string
  Zaobf33?: string
  Zaobt33?: string
  Zremark?: string
  ZblRcpdt?: string
  ZflwSts?: string
  ZpolCtry?: string
  ZpodCtry?: string
  ZogbsStatId?: string
}

/** The composite key identifying one row. */
export type TrdFlowKey = { ZtfNo: string; ZtfSplit: string }

/**
 * Filter state for the list. Empty string means "no filter on this column".
 *
 * These are the four of the legacy page's five filter dropdowns that have a TrdFlow field
 * behind them. Its fifth, Blocked Status, has no SAP source and renders disabled, as do the
 * Include Expired / Include Deleted checkboxes.
 */
export type TfFilters = {
  Zbu: string
  Zcmmd: string
  ZflwSts: string
  ZogbsStatId: string
}

export const EMPTY_FILTERS: TfFilters = { Zbu: '', Zcmmd: '', ZflwSts: '', ZogbsStatId: '' }
