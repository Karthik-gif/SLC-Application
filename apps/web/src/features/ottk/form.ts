import { fmtNum, parseAmount, toNum } from '@slc/api-client'
import type { BankRow, OttkPayload, OttkRow } from './types.ts'

/**
 * Every field of the create/edit form, held as the string the control shows. Keeping the
 * form as strings (rather than a half-typed number) is what lets "1.5M" and a blank date
 * exist in state without being coerced into something the user did not type.
 */
export type OttkForm = {
  type: string
  structure: string
  entityCode: string
  entityString: string
  trader: string
  bank: string
  tradeValue: string
  tradeValueCcy: string
  lcdate: string
  tenor: string
  paymentTerms: string
  otherCharges: string
  bl: string
  lcApplicant: string
  lcBeneficiary: string
  coCode: string
  coCodeName: string
  businessAreaCode: string
  businessAreaName: string
  depositValue: string
  depositAmount: string
  depositAmountCcy: string
  depositDate: string
  interestCategory: string
  interestRate: string
  refIntRate: string
  spreadRate: string
  firstInterestDate: string
  resetFrequency: string
  interestFrequency: string
  expectedPLPercent: string
  expectedPLAmt: string
  remarks: string
  bankContact: string
  bankContactDetails: string
  commitmentEndDate: string
}

export const EMPTY_FORM: OttkForm = {
  type: '01',
  structure: '',
  entityCode: '',
  entityString: '',
  trader: '',
  bank: '',
  tradeValue: '',
  tradeValueCcy: 'USD',
  lcdate: '',
  tenor: '',
  paymentTerms: '',
  otherCharges: '',
  bl: '',
  lcApplicant: '',
  lcBeneficiary: '',
  coCode: '',
  coCodeName: '',
  businessAreaCode: '',
  businessAreaName: '',
  depositValue: '',
  depositAmount: '',
  depositAmountCcy: 'USD',
  depositDate: '',
  interestCategory: '',
  interestRate: '',
  refIntRate: '',
  spreadRate: '',
  firstInterestDate: '',
  resetFrequency: '',
  interestFrequency: '',
  expectedPLPercent: '',
  expectedPLAmt: '',
  remarks: '',
  bankContact: '',
  bankContactDetails: '',
  commitmentEndDate: '',
}

const text = (value: unknown): string => (value === undefined || value === null ? '' : String(value))
const amount = (value: unknown): string => (value ? fmtNum(value) : '')

/**
 * Fills the form from a stored ticket.
 *
 * Business Area falls back to the Bank lookup: a persisted OTTK's own ZbaText is joined
 * server-side off a classic business-area master table and frequently comes back blank, so
 * rather than show nothing the same live source applyBankSelection() uses is consulted,
 * keyed by the ticket's own bank.
 */
export function formFromRow(row: OttkRow, banks: readonly BankRow[]): OttkForm {
  const form: OttkForm = {
    ...EMPTY_FORM,
    type: text(row.Ztype) || '01',
    structure: text(row.Zstr),
    entityCode: text(row.ZentId),
    entityString: text(row.ZentDesc),
    trader: text(row.Ztrader),
    bank: text(row.ZottkBank),
    tradeValue: amount(row.ZottkValue),
    tradeValueCcy: text(row.ZottkCurr) || 'USD',
    lcdate: text(row.Zdate),
    tenor: text(row.Ztenor),
    paymentTerms: text(row.ZpayTerms),
    otherCharges: amount(row.ZothFee),
    bl: text(row.Zbltype),
    lcApplicant: text(row.ZlcApp),
    lcBeneficiary: text(row.ZlcBen),
    coCode: text(row.Zbukrs),
    coCodeName: text(row.Butxt),
    businessAreaCode: text(row.Zrbusa),
    businessAreaName: text(row.ZbaText),
    depositValue: text(row.ZdepVal),
    depositAmount: amount(row.ZdepAmt),
    depositAmountCcy: text(row.ZdepCurr) || 'USD',
    depositDate: text(row.ZexpDate),
    interestCategory: text(row.ZintCat),
    interestRate: row.ZintRate ? Number(row.ZintRate).toFixed(5) : '',
    refIntRate: text(row.ZrefInt),
    spreadRate: text(row.Zsrate),
    firstInterestDate: text(row.Zsdate),
    resetFrequency: text(row.ZresFrq),
    interestFrequency: text(row.AccType),
    expectedPLPercent: text(row.ZplPer),
    expectedPLAmt: amount(row.ZplAmt),
    remarks: text(row.Zremark),
    bankContact: text(row.ZbankContact),
    bankContactDetails: text(row.ZbankContactDet),
    commitmentEndDate: text(row.ZcommEndDate),
  }

  if (!row.ZbaText && row.ZottkBank) {
    const bank = banks.find((b) => b.Zbp === row.ZottkBank)
    if (bank) {
      form.businessAreaCode = text(bank.Zrbusa) || text(row.Zrbusa)
      form.businessAreaName = text(bank.ZbaText)
    }
  }

  return form
}

/**
 * Builds the service payload. Amounts are parsed from what the control shows, so "1.5M"
 * and "1,500,000" both reach SAP as 1500000; a date left blank is null, not "".
 */
export function toPayload(form: OttkForm): OttkPayload {
  const num = (value: string): number => {
    const parsed = parseAmount(value)
    return parsed === null ? toNum(value) : parsed
  }
  const date = (value: string): string | null => value.trim() || null

  return {
    Ztype: form.type.trim(),
    Zstr: form.structure.trim(),
    ZentId: form.entityCode.trim(),
    Ztrader: form.trader.trim(),
    ZottkBank: form.bank.trim(),
    ZottkValue: num(form.tradeValue),
    ZottkCurr: form.tradeValueCcy.trim() || 'USD',
    Zdate: date(form.lcdate),
    Ztenor: form.tenor.trim(),
    ZpayTerms: form.paymentTerms.trim(),
    ZothFee: num(form.otherCharges),
    Zbltype: form.bl.trim(),
    ZlcApp: form.lcApplicant.trim(),
    ZlcBen: form.lcBeneficiary.trim(),
    Zbukrs: form.coCode.trim(),
    Zrbusa: form.businessAreaCode.trim(),
    ZdepVal: form.depositValue.trim(),
    ZdepAmt: num(form.depositAmount),
    ZdepCurr: form.depositAmountCcy.trim() || 'USD',
    ZexpDate: date(form.depositDate),
    ZintCat: form.interestCategory.trim(),
    ZintRate: num(form.interestRate),
    ZrefInt: form.refIntRate.trim(),
    Zsrate: num(form.spreadRate),
    Zsdate: date(form.firstInterestDate),
    ZresFrq: form.resetFrequency.trim(),
    AccType: form.interestFrequency.trim(),
    ZplPer: num(form.expectedPLPercent),
    ZplAmt: num(form.expectedPLAmt),
    Zremark: form.remarks.trim(),
    ZbankContact: form.bankContact.trim(),
    ZbankContactDet: form.bankContactDetails.trim(),
    ZcommEndDate: date(form.commitmentEndDate),
  }
}

/**
 * "01 Fixed" (and nothing selected) shows a plain Interest Rate. Every other category —
 * Variable, Fixed with Benchmark, Bank COF — is reference-rate driven, so it shows Ref Int
 * Rate and Spread Rate instead.
 */
export function isFixedInterest(category: string): boolean {
  return category === '01' || category === ''
}

/** Hidden interest fields are cleared, so a stale value from a previous category is never sent. */
export function applyInterestCategory(form: OttkForm, category: string): OttkForm {
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
 * The Deposit / Prepayment block is shared by both structure families: the DSX structures
 * put money on deposit, the LCP ones prepay the LC. Same fields, so only the labels move.
 */
export function isPrepayStructure(structure: string): boolean {
  return structure === 'LCP' || structure === 'CC LCP'
}
