import { fmtNum, parseAmount, toNum } from '@slc/api-client'
import type { BankRow, CoCodeRow, DttkPayload, DttkRow, EntityRow, OttkRow } from './types.ts'

/** Every field of the create/edit form, held as the string its control shows. */
export type DttkForm = {
  type1: string
  type2: string
  otkNo: string
  structure: string
  entityCode: string
  bank: string
  otkValue: string
  otkValueCcy: string
  lcdate: string
  tenor: string
  lcApplicant: string
  lcBeneficiary: string
  coCode: string
  coCodeName: string
  businessAreaCode: string
  businessAreaName: string
  rma: string
  disBank: string
  tradeValue: string
  tradeValueCcy: string
  disVal: string
  disAmt: string
  disCurr: string
  interestCategory: string
  interestRate: string
  refIntRate: string
  spreadRate: string
  interestFrequency: string
  negFee: string
  otherCharges: string
  dTrader: string
  region: string
  remarks: string
  cbank: string
  cfeeFrom: string
  cfeeTo: string
  cTrader: string
  confirmationFee: string
  cremark: string
  bankContact: string
  bankContactDetails: string
  commitmentEndDate: string
  commitmentFee: string
  reservationStartDate: string
  lcIssuanceDate: string
  docPresDate: string
  repayPrevLcDate: string
}

export const EMPTY_FORM: DttkForm = {
  type1: '',
  type2: '01',
  otkNo: '',
  structure: '',
  entityCode: '',
  bank: '',
  otkValue: '',
  otkValueCcy: 'USD',
  lcdate: '',
  tenor: '',
  lcApplicant: '',
  lcBeneficiary: '',
  coCode: '',
  coCodeName: '',
  businessAreaCode: '',
  businessAreaName: '',
  rma: '',
  disBank: '',
  tradeValue: '',
  tradeValueCcy: 'USD',
  disVal: '',
  disAmt: '',
  disCurr: 'USD',
  interestCategory: '01',
  interestRate: '',
  refIntRate: '',
  spreadRate: '',
  interestFrequency: '',
  negFee: '',
  otherCharges: '',
  dTrader: '',
  region: '',
  remarks: '',
  cbank: '',
  cfeeFrom: '',
  cfeeTo: '',
  cTrader: '',
  confirmationFee: '',
  cremark: '',
  bankContact: '',
  bankContactDetails: '',
  commitmentEndDate: '',
  commitmentFee: '',
  reservationStartDate: '',
  lcIssuanceDate: '',
  docPresDate: '',
  repayPrevLcDate: '',
}

const text = (value: unknown): string => (value === undefined || value === null ? '' : String(value))
const amount = (value: unknown): string => (value ? fmtNum(value) : '')

export function formFromRow(row: DttkRow, ottkBanks: readonly BankRow[]): DttkForm {
  const form: DttkForm = {
    ...EMPTY_FORM,
    type1: text(row.Ztype1),
    type2: text(row.Ztype2) || (row.ZottkNo ? '02' : '01'),
    otkNo: text(row.ZottkNo),
    structure: text(row.Zstr),
    entityCode: text(row.ZentId),
    bank: text(row.ZottkBank),
    otkValue: amount(row.ZottkValue),
    otkValueCcy: text(row.ZottkCurr) || 'USD',
    tradeValue: amount(row.ZdttkValue),
    tradeValueCcy: text(row.ZdttkCurr) || 'USD',
    lcdate: text(row.Zdate),
    tenor: text(row.Ztenor),
    lcApplicant: text(row.ZlcApp),
    lcBeneficiary: text(row.ZlcBen),
    coCode: text(row.Zbukrs),
    coCodeName: text(row.Butxt),
    businessAreaCode: text(row.Zrbusa),
    businessAreaName: text(row.ZbaText),
    rma: text(row.Zrma),
    cbank: text(row.Zcbank),
    cfeeFrom: text(row.ZcfeeFrom),
    cfeeTo: text(row.ZcfeeTo),
    cTrader: text(row.ZcTrader),
    confirmationFee: amount(row.Zcfee),
    cremark: text(row.Zcremark),
    disBank: text(row.ZdisBp),
    disVal: text(row.ZdisVal),
    disAmt: amount(row.ZdisAmt),
    disCurr: text(row.ZdisCurr) || 'USD',
    // The service stores more interest categories than this screen offers; anything that is
    // not "01 Fixed" is shown as "02 Floating".
    interestCategory: !row.ZintCat || row.ZintCat === '01' ? '01' : '02',
    interestRate: row.ZintRate ? Number(row.ZintRate).toFixed(5) : '',
    refIntRate: text(row.ZrefInt),
    spreadRate: text(row.Zsrate),
    interestFrequency: text(row.ZaccType),
    negFee: amount(row.Znfee),
    otherCharges: amount(row.Zofee),
    dTrader: text(row.ZdTrader),
    region: text(row.Zregion),
    remarks: text(row.Zremark),
    bankContact: text(row.ZbankContact),
    bankContactDetails: text(row.ZbankContactDet),
    commitmentEndDate: text(row.ZcommEndDate),
    commitmentFee: amount(row.ZcommFee),
    reservationStartDate: text(row.ZresrvStDate),
    lcIssuanceDate: text(row.ZlcLateDate),
    docPresDate: text(row.ZdocPresDate),
    repayPrevLcDate: text(row.ZrepPrevLcDate),
  }

  // The stored ZbaText is frequently blank for these business areas — fall back to the Bank
  // lookup the origination-bank handler uses live rather than show nothing.
  if (!row.ZbaText && row.ZottkBank) {
    const bank = ottkBanks.find((b) => String(b.Zbp) === String(row.ZottkBank))
    if (bank) {
      form.businessAreaCode = text(bank.Zrbusa) || text(row.Zrbusa)
      form.businessAreaName = text(bank.ZbaText)
    }
  }

  return form
}

export function toPayload(form: DttkForm): DttkPayload {
  const num = (value: string): number => {
    const parsed = parseAmount(value)
    return parsed === null ? toNum(value) : parsed
  }
  const date = (value: string): string | null => value.trim() || null

  return {
    Ztype1: form.type1.trim(),
    Ztype2: form.type2.trim(),
    ZottkNo: form.otkNo.trim(),
    Zstr: form.structure.trim(),
    ZentId: form.entityCode.trim(),
    ZottkBank: form.bank.trim(),
    ZottkValue: num(form.otkValue),
    ZottkCurr: form.otkValueCcy.trim() || 'USD',
    ZdttkValue: num(form.tradeValue),
    ZdttkCurr: form.tradeValueCcy.trim() || 'USD',
    Zdate: date(form.lcdate),
    Ztenor: form.tenor.trim(),
    ZlcApp: form.lcApplicant.trim(),
    ZlcBen: form.lcBeneficiary.trim(),
    Zbukrs: form.coCode.trim(),
    Zrbusa: form.businessAreaCode.trim(),
    Zrma: form.rma.trim(),
    Zcbank: form.cbank.trim(),
    ZcfeeFrom: form.cfeeFrom.trim(),
    ZcfeeTo: form.cfeeTo.trim(),
    ZcTrader: form.cTrader.trim(),
    Zcfee: num(form.confirmationFee),
    Zcremark: form.cremark.trim(),
    ZdisBp: form.disBank.trim(),
    ZdisVal: form.disVal.trim(),
    ZdisAmt: num(form.disAmt),
    ZdisCurr: form.disCurr.trim() || 'USD',
    ZintCat: form.interestCategory.trim(),
    ZintRate: num(form.interestRate),
    ZrefInt: form.refIntRate.trim(),
    Zsrate: num(form.spreadRate),
    ZaccType: form.interestFrequency.trim(),
    Znfee: num(form.negFee),
    Zofee: num(form.otherCharges),
    ZdTrader: form.dTrader.trim(),
    Zregion: form.region.trim(),
    Zremark: form.remarks.trim(),
    ZbankContact: form.bankContact.trim(),
    ZbankContactDet: form.bankContactDetails.trim(),
    ZcommEndDate: date(form.commitmentEndDate),
    ZcommFee: num(form.commitmentFee),
    ZresrvStDate: date(form.reservationStartDate),
    ZlcLateDate: date(form.lcIssuanceDate),
    ZdocPresDate: date(form.docPresDate),
    ZrepPrevLcDate: date(form.repayPrevLcDate),
  }
}

/** "01 Fixed" (and nothing selected) shows a plain Interest Rate; anything else is reference-driven. */
export function isFixedInterest(category: string): boolean {
  return category === '01' || category === ''
}

/** Hidden interest fields are cleared, so a stale value from a previous category is never sent. */
export function applyInterestCategory(form: DttkForm, category: string): DttkForm {
  const next = { ...form, interestCategory: category }
  if (isFixedInterest(category)) {
    next.refIntRate = ''
    next.spreadRate = ''
  } else {
    next.interestRate = ''
  }
  return next
}

/**
 * Related OTTK only means anything once the ticket is declared "With Ref OTTK", so switching
 * Type 2 back to "New" clears it.
 */
export function applyType2(form: DttkForm, type2: string): DttkForm {
  const next = { ...form, type2 }
  if (type2 !== '02') next.otkNo = ''
  return next
}

/**
 * Confirmation Bank only applies when the ticket carries a confirmation leg — "01 Discounting
 * & Confirmation" or "03 Confirmation Only". "02 Discounting Only" has none.
 */
export function hasConfirmationLeg(type1: string): boolean {
  return type1 !== '02'
}

/**
 * Once a DTTK is tied to an OTTK, its trade terms ARE the OTTK's trade terms, so the whole
 * Trade Details section — and DTTK Trade Value, which sits beside Discounting Bank — goes
 * non-editable and nothing there can drift from the OTTK.
 */
export function isTradeLocked(form: DttkForm): boolean {
  return Boolean(form.otkNo)
}

/**
 * Picking a Related OTTK copies that ticket's trade terms down, including the company code:
 * the service requires Zbukrs at create and the field is otherwise easy to leave blank.
 * Only fields the OTTK actually owns are touched, so discounting and confirmation entries
 * already made stay put.
 */
export function applyOttkSelection(
  form: DttkForm,
  ottkNo: string,
  ottkRows: readonly OttkRow[],
  ottkBanks: readonly BankRow[],
): DttkForm {
  const next: DttkForm = { ...form, otkNo: ottkNo }
  if (!ottkNo) return next

  const row = ottkRows.find((r) => String(r.ZottkNo) === ottkNo)
  if (!row) return next

  next.type2 = '02'
  next.structure = text(row.Zstr)
  next.entityCode = text(row.ZentId)
  next.bank = text(row.ZottkBank)
  next.otkValue = amount(row.ZottkValue)
  next.otkValueCcy = text(row.ZottkCurr) || 'USD'
  // Only defaulted, never overwritten: a DTTK value already typed is the user's decision.
  if (!next.tradeValue) {
    next.tradeValue = amount(row.ZottkValue)
    next.tradeValueCcy = text(row.ZottkCurr) || 'USD'
  }
  next.lcdate = text(row.Zdate)
  next.tenor = text(row.Ztenor)
  next.lcApplicant = text(row.ZlcApp)
  next.lcBeneficiary = text(row.ZlcBen)
  next.coCode = text(row.Zbukrs)
  next.coCodeName = text(row.Butxt)

  const bank = ottkBanks.find((b) => String(b.Zbp) === String(row.ZottkBank))
  next.businessAreaCode = text(bank?.Zrbusa)
  next.businessAreaName = text(bank?.ZbaText)
  if (row.Zrbusa && !next.businessAreaCode) next.businessAreaCode = text(row.Zrbusa)
  if (!next.dTrader) next.dTrader = text(row.Ztrader)

  return next
}

/** Entity drives the applicant/beneficiary tokens, which in turn drive the company code. */
export function applyEntitySelection(
  form: DttkForm,
  entityId: string,
  entities: readonly EntityRow[],
  coCodes: readonly CoCodeRow[],
): DttkForm {
  const entity = entities.find((e) => e.ZentId === entityId)
  const applicant = text(entity?.Zent2)
  return withCoCode(
    { ...form, entityCode: entityId, lcBeneficiary: text(entity?.Zent1), lcApplicant: applicant },
    applicant,
    coCodes,
  )
}

/** Company Code stays editable — this only fills it when the applicant matches a mapping. */
export function withCoCode(form: DttkForm, applicant: string, coCodes: readonly CoCodeRow[]): DttkForm {
  if (!applicant.trim()) return form
  const match = coCodes.find((c) => String(c.ZcomId).toUpperCase() === applicant.trim().toUpperCase())
  if (!match) return form
  return { ...form, coCode: text(match.Zbukrs), coCodeName: text(match.Butxt) }
}

/** Business Area is derived from the origination bank; both fields are read-only. */
export function applyBankSelection(form: DttkForm, zbp: string, ottkBanks: readonly BankRow[]): DttkForm {
  const bank = ottkBanks.find((b) => String(b.Zbp) === zbp)
  return {
    ...form,
    bank: zbp,
    businessAreaCode: text(bank?.Zrbusa),
    businessAreaName: text(bank?.ZbaText),
  }
}
