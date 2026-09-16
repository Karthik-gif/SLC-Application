/**
 * Row shapes as the SAP services return them. Every field is optional because these are
 * SAP-generated OData entities: a field absent from a projection must not become `undefined`
 * that TypeScript swears is a string.
 */

export type OttkRow = {
  ZottkNo?: string
  Ztype?: string
  ZtypeText?: string
  Zstr?: string
  ZstrText?: string
  ZentId?: string
  ZentDesc?: string
  ZottkBank?: string
  BpName?: string
  ZottkValue?: string | number
  ZottkCurr?: string
  Zdate?: string
  Ztenor?: string | number
  ZlcApp?: string
  ZlcBen?: string
  Zbukrs?: string
  ZdepAmt?: string | number
  ZintCat?: string
  ZintCatText?: string
  ZintRate?: string | number
  ZottkSt?: string
  ZstatDesc?: string
}

export type DttkRow = {
  ZdttkNo?: string
  Ztype1?: string
  Ztype1Text?: string
  Ztype2?: string
  Ztype2Text?: string
  ZottkNo?: string
  Zstr?: string
  ZstrText?: string
  ZentId?: string
  ZentDesc?: string
  ZdttkValue?: string | number
  ZdttkCurr?: string
  ZdisBp?: string
  ZdisDesc?: string
  Zdate?: string
  Ztenor?: string | number
  ZlcApp?: string
  ZlcBen?: string
  Zbukrs?: string
  ZintCat?: string
  ZintCatText?: string
  ZintRate?: string | number
  ZdttkSt?: string
  ZstatDesc?: string
}

export type DealIdRow = {
  ZdealId?: string
  ZottkNo?: string
  ZdttkNo?: string
  ZentId?: string
  Zstr?: string
  ZdealAmt?: string | number
  ZdealCurr?: string
  ZdealIdDesc?: string
  ZdealStat?: string
  ZdealStatDesc?: string
}

export type BankRow = { Zbp?: string; BpName?: string }

/** How much of each ticket is already committed to Deal IDs, keyed by ticket number. */
export type AssignedTotals = {
  byOttk: Map<string, number>
  byDttk: Map<string, number>
}
