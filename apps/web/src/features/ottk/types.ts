/** Row shapes as ZFS_SB_SLCOTTKDETAIL_O4_API and ZFS_SB_SLCDTTKDETAIL_O4_API return them. */

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

export type DttkRow = {
  ZdttkNo?: string
  Ztype1?: string
  Ztype1Text?: string
  Ztype2?: string
  Ztype2Text?: string
  ZottkNo?: string
  ZdttkValue?: string | number
  ZdttkCurr?: string
  Zdate?: string
  Ztenor?: string | number
  ZlcApp?: string
  ZlcBen?: string
  Zbukrs?: string
  Butxt?: string
  ZdttkSt?: string
  ZstatDesc?: string
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
  banks: BankRow[]
  entities: EntityRow[]
  coCodes: CoCodeRow[]
  refInts: RefIntRow[]
  feeTypes: FeeTypeRow[]
}

export const EMPTY_LOOKUPS: Lookups = {
  banks: [],
  entities: [],
  coCodes: [],
  refInts: [],
  feeTypes: [],
}


/** The OTTK header as the service expects it on create and update. */
export type OttkPayload = Record<string, string | number | null>
