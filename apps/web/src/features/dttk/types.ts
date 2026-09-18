/** Row shapes as ZFS_SB_SLCDTTKDETAIL_O4_API and ZFS_SB_SLCOTTKDETAIL_O4_API return them. */

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
  ZottkBank?: string
  BpName?: string
  ZottkValue?: string | number
  ZottkCurr?: string
  ZdttkValue?: string | number
  ZdttkCurr?: string
  Zdate?: string
  Ztenor?: string | number
  ZlcApp?: string
  ZlcBen?: string
  Zbukrs?: string
  Butxt?: string
  Zrbusa?: string
  ZbaText?: string
  Zrma?: string
  Zcbank?: string
  ZcfeeFrom?: string
  ZcfeeTo?: string
  ZcTrader?: string
  Zcfee?: string | number
  Zcremark?: string
  ZdisBp?: string
  ZdisDesc?: string
  ZdisVal?: string
  ZdisAmt?: string | number
  ZdisCurr?: string
  ZintCat?: string
  ZintCatText?: string
  ZintRate?: string | number
  ZrefInt?: string
  Zsrate?: string | number
  ZaccType?: string
  Znfee?: string | number
  Zofee?: string | number
  ZdTrader?: string
  Zregion?: string
  Zremark?: string
  ZbankContact?: string
  ZbankContactDet?: string
  ZcommEndDate?: string
  ZcommFee?: string | number
  ZresrvStDate?: string
  ZlcLateDate?: string
  ZdocPresDate?: string
  ZrepPrevLcDate?: string
  ZdttkSt?: string
  ZstatDesc?: string
  ZcreatedBy?: string
  LocalCreatedBy?: string
}

/** The origination ticket, as shown in the lower panel and the read-only view modal. */
export type OttkRow = {
  ZottkNo?: string
  Ztype?: string
  ZtypeText?: string
  Zstr?: string
  ZstrText?: string
  ZentId?: string
  ZentDesc?: string
  Ztrader?: string
  ZottkBank?: string
  BpName?: string
  ZottkValue?: string | number
  ZottkCurr?: string
  Zdate?: string
  Ztenor?: string | number
  ZpayTerms?: string
  ZothFee?: string | number
  Zbltype?: string
  ZlcApp?: string
  ZlcBen?: string
  Zbukrs?: string
  Butxt?: string
  Zrbusa?: string
  ZbaText?: string
  ZdepVal?: string
  ZdepAmt?: string | number
  ZdepCurr?: string
  ZexpDate?: string
  ZintCat?: string
  ZintCatText?: string
  ZintRate?: string | number
  ZrefInt?: string
  Zsrate?: string | number
  Zsdate?: string
  ZresFrq?: string
  AccType?: string
  ZplPer?: string | number
  ZplAmt?: string | number
  Zremark?: string
  ZbankContact?: string
  ZbankContactDet?: string
  ZcommEndDate?: string
  ZottkSt?: string
  ZstatDesc?: string
  ZcreatedBy?: string
  LocalCreatedBy?: string
}

export type BankRow = { Zbp?: string; BpName?: string; Zrbusa?: string; ZbaText?: string }
export type RefIntRow = { ZrefInt?: string; ZrefDesc?: string }

export type { ChargeRow, FeeTypeRow } from '../../shared/charge-types.ts'
export type { CoCodeRow } from '../../shared/co-code.ts'
export type { EntityRow } from '../../shared/entity-string.ts'
import type { CoCodeRow } from '../../shared/co-code.ts'
import type { EntityRow } from '../../shared/entity-string.ts'
import type { FeeTypeRow } from '../../shared/charge-types.ts'

export type Lookups = {
  /** Origination banks, used for the Origination Bank select and its business-area derivation. */
  ottkBanks: BankRow[]
  /** Discounting/confirmation banks. */
  dttkBanks: BankRow[]
  entities: EntityRow[]
  coCodes: CoCodeRow[]
  refInts: RefIntRow[]
  /** Fee types for the two breakdowns: confirmation (CFeeType) and other charges (DFeeType). */
  confirmationFeeTypes: FeeTypeRow[]
  otherFeeTypes: FeeTypeRow[]
  /** Trader codes, collected from the loaded tickets rather than a master list. */
  traders: string[]
}

export const EMPTY_LOOKUPS: Lookups = {
  ottkBanks: [],
  dttkBanks: [],
  entities: [],
  coCodes: [],
  refInts: [],
  confirmationFeeTypes: [],
  otherFeeTypes: [],
  traders: [],
}

export type DttkPayload = Record<string, string | number | null>

/** Which of the two breakdowns a Charges popup is showing. */
export type ChargesContext = 'confirmation' | 'other'
