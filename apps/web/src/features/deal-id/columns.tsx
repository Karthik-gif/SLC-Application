import type { ReactNode } from 'react'
import { codeText, fmtDate, fmtNum, toNum } from '@slc/api-client'
import type { AssignedTotals, DttkRow, OttkRow } from './types.ts'

/**
 * A table column. `className` lands on the <td> so the legacy cell classes — num, link —
 * keep doing their work: `td.num` right-aligns with tabular numerals, `td.link` is the
 * underlined blue ticket number.
 */
export type Col<Row> = {
  header: string
  cell: (row: Row) => ReactNode
  className?: string
}

/** Exactly the legacy statusPill(): anything not matching open/pend still renders as open. */
export function StatusPill({ status }: { status: string | undefined }) {
  const text = status || 'Draft'
  const cls = /open/i.test(text) ? 'open' : /pend/i.test(text) ? 'pending' : 'open'
  return <span className={`status-pill ${cls}`}>{text}</span>
}

function interest(row: { ZintCat?: string; ZintCatText?: string; ZintRate?: string | number }): string {
  if (!row.ZintCat) return ''
  return `${row.ZintCatText ?? row.ZintCat} ${fmtNum(row.ZintRate)}%`
}

function balance(tradeValue: unknown, assigned: number | undefined): string {
  return fmtNum(toNum(tradeValue) - (assigned ?? 0))
}

export function ottkColumns(totals: AssignedTotals, onOpen: (key: string) => void): Array<Col<OttkRow>> {
  return [
    {
      header: 'OTTK No',
      className: 'link',
      // The underlined number opens the read-only ticket view; the rest of the row selects
      // the ticket. stopPropagation keeps the two apart, as the legacy console did.
      cell: (r) => (
        <span
          onClick={(event) => {
            event.stopPropagation()
            onOpen(r.ZottkNo ?? '')
          }}
        >
          {r.ZottkNo ?? ''}
        </span>
      ),
    },
    { header: 'Type', cell: (r) => codeText(r.Ztype, r.ZtypeText) },
    { header: 'Structure', cell: (r) => codeText(r.Zstr, r.ZstrText) },
    { header: 'Entity ID', cell: (r) => r.ZentId ?? '' },
    { header: 'Entity String', cell: (r) => r.ZentDesc ?? '' },
    { header: 'LC Issuing Bank', cell: (r) => (r.ZottkBank ? `${r.ZottkBank} — ${r.BpName ?? ''}` : '') },
    { header: 'Trade Value', className: 'num', cell: (r) => fmtNum(r.ZottkValue) },
    { header: 'Crcy', cell: (r) => r.ZottkCurr ?? '' },
    { header: 'Balance', className: 'num', cell: (r) => balance(r.ZottkValue, totals.byOttk.get(r.ZottkNo ?? '')) },
    { header: 'Expected LC Date', cell: (r) => fmtDate(r.Zdate) },
    { header: 'Tenor', className: 'num', cell: (r) => String(r.Ztenor ?? '') },
    { header: 'LC Applicant', cell: (r) => r.ZlcApp ?? '' },
    { header: 'LC Beneficiary', cell: (r) => r.ZlcBen ?? '' },
    { header: 'CoCode', cell: (r) => r.Zbukrs ?? '' },
    { header: 'Deposit Amt', className: 'num', cell: (r) => fmtNum(r.ZdepAmt) },
    { header: 'Interest', cell: interest },
    { header: 'Status', cell: (r) => <StatusPill status={r.ZstatDesc ?? r.ZottkSt} /> },
  ]
}

export function dttkColumns(totals: AssignedTotals, onOpen: (key: string) => void): Array<Col<DttkRow>> {
  return [
    {
      header: 'DTTK No',
      className: 'link',
      cell: (r) => (
        <span
          onClick={(event) => {
            event.stopPropagation()
            onOpen(r.ZdttkNo ?? '')
          }}
        >
          {r.ZdttkNo ?? ''}
        </span>
      ),
    },
    { header: 'Type 1', cell: (r) => codeText(r.Ztype1, r.Ztype1Text) },
    { header: 'Type 2', cell: (r) => codeText(r.Ztype2, r.Ztype2Text) },
    { header: 'Related OTTK', cell: (r) => r.ZottkNo ?? '' },
    { header: 'Structure', cell: (r) => codeText(r.Zstr, r.ZstrText) },
    { header: 'Entity String', cell: (r) => r.ZentDesc ?? '' },
    { header: 'DTTK Value', className: 'num', cell: (r) => fmtNum(r.ZdttkValue) },
    { header: 'Crcy', cell: (r) => r.ZdttkCurr ?? '' },
    { header: 'Balance', className: 'num', cell: (r) => balance(r.ZdttkValue, totals.byDttk.get(r.ZdttkNo ?? '')) },
    {
      header: 'Discounting Bank',
      cell: (r) => (r.ZdisBp ? `${r.ZdisBp}${r.ZdisDesc ? ` — ${r.ZdisDesc}` : ''}` : ''),
    },
    { header: 'Expected LC Date', cell: (r) => fmtDate(r.Zdate) },
    { header: 'Tenor', className: 'num', cell: (r) => String(r.Ztenor ?? '') },
    { header: 'LC Applicant', cell: (r) => r.ZlcApp ?? '' },
    { header: 'LC Beneficiary', cell: (r) => r.ZlcBen ?? '' },
    { header: 'CoCode', cell: (r) => r.Zbukrs ?? '' },
    { header: 'Interest', cell: interest },
    { header: 'Status', cell: (r) => <StatusPill status={r.ZstatDesc ?? r.ZdttkSt} /> },
  ]
}

/** The fixed option lists the legacy console hardcoded in its <select> markup. */
export const STRUCTURE_OPTIONS = [
  { value: 'DSX', label: 'DSX — Deposit Set Off - Cross Border' },
  { value: 'LCP', label: 'LCP — LC Prepayment' },
  { value: 'CC DSX', label: 'CC DSX — Cross Currency DSX' },
  { value: 'CC LCP', label: 'CC LCP — Cross Currency LCP' },
]

export const OTTK_TYPE_OPTIONS = [
  { value: '01', label: '01 New' },
  { value: '02', label: '02 With Ref DTTK' },
]

export const DTTK_TYPE1_OPTIONS = [
  { value: '01', label: '01 Discounting & Confirmation' },
  { value: '02', label: '02 Discounting Only' },
  { value: '03', label: '03 Confirmation Only' },
]

export const DTTK_TYPE2_OPTIONS = [
  { value: '01', label: '01 New' },
  { value: '02', label: '02 With Ref OTTK' },
]
