import type { CashflowRow, IrsForm, LoanRecord } from './types.ts'

/** Thousands-separated amount with two decimals, as the original's money(). */
export function money(value: number | string): string {
  const parts = Number(value || 0)
    .toFixed(2)
    .split('.')
  parts[0] = (parts[0] ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function rateFmt(value: number | string): string {
  return Number(value || 0).toFixed(4)
}

function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n
}

export function isValidDMY(text: string): boolean {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(text ?? ''))
  if (!m) return false
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000 || year > 9999) return false
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

export function parseDMY(text: string): Date | null {
  if (!isValidDMY(text)) return null
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(text))
  if (!m) return null
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
}

export function formatDMY(d: Date): string {
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`
}

export function isoToDMY(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''))
  if (!m) return iso ?? ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

function addDaysDMY(text: string, days: number): string {
  const d = parseDMY(text)
  if (!d) return text
  d.setDate(d.getDate() + Number(days || 0))
  return formatDMY(d)
}

function diffDaysDMY(startText: string, endText: string): number {
  const a = parseDMY(startText)
  const b = parseDMY(endText)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function calcInterestRate(r: LoanRecord): number {
  return (Number(r.refInterestRate) || 0) + (Number(r.spreadRate) || 0)
}

function calcInterestDue(amount: number, rate: number, days: number): number {
  return ((Number(amount) || 0) * (Number(rate) || 0) * (Number(days) || 0)) / 36000
}

export function irsStatus(r: LoanRecord): string {
  return r.irsTxn ? 'Assigned to IRS' : 'Not Assigned to IRS'
}

export function statusBadgeClass(status: string): string {
  if (status === 'Assigned to IRS') return 'badge badge-closed'
  return 'badge badge-open'
}

export function descriptionFor(row: CashflowRow): string {
  const ft = String(row.flowType || '')
  if (ft.indexOf('Notional') >= 0 || ft.indexOf('Drawdown') >= 0 || ft.indexOf('Repayment') >= 0) {
    return 'Principal'
  }
  return 'IRS Interest'
}

export function amountColorClass(value: number | string): string {
  const n = Number(value || 0)
  if (n > 0) return ' amount-pos'
  if (n < 0) return ' amount-neg'
  return ''
}

export function amountDisplay(value: number | string): string {
  const n = Number(value || 0)
  if (n > 0) return `+${money(n)}`
  return money(n)
}

function frqStepDays(frq: string): number {
  if (frq === 'Monthly') return 30
  if (frq === 'Quarterly') return 90
  if (frq === 'Half Yearly') return 180
  return 0
}

/** The IRS terms implied by a record that already carries one, used to rebuild its cashflow. */
export function irsFromRecord(r: LoanRecord): IrsForm {
  return {
    coCode: r.companyCode,
    partnerName: r.partnerName,
    startDate: r.startDate,
    endDate: r.endDate,
    incomingRef1: String(r.refInterestRate),
    incomingRef2: String(r.spreadRate),
    outgoingIntCat: '01',
    outgoingIntFrq: r.resetFrequency,
    interestPaymentDate: 'Start of Period',
    specialCase: r.specialCase,
    outgoingRate1: String(r.refInterestRate),
    outgoingRate2: String(r.spreadRate),
  }
}

function pushInterestRow(
  rows: CashflowRow[],
  r: LoanRecord,
  irs: IrsForm,
  paymentDate: string,
  fixDate: string,
  days: number,
  loanRate: number,
  incomingRate: number,
  outgoingRate: number,
  adjStatus: string,
): void {
  const notional = r.discLoanAmount
  rows.push({
    paymentDate,
    name: irs.partnerName,
    discLoan: -calcInterestDue(notional, loanRate, days || 0),
    irsIncoming: calcInterestDue(notional, incomingRate, days || 0),
    irsOutgoing: -calcInterestDue(notional, outgoingRate, days || 0),
    curr: r.currency,
    flowType: 'Interest',
    intFixDate: fixDate,
    status: 'Planned',
    pctRate: outgoingRate,
    adjStatus,
  })
}

/** Derives the cashflow schedule from the loan notional and the IRS terms. */
export function generateCashflow(r: LoanRecord, irs: IrsForm): CashflowRow[] {
  if (r.exampleCashflow) return [...r.exampleCashflow]

  const rows: CashflowRow[] = []
  const notional = r.discLoanAmount
  const loanRate = calcInterestRate(r)
  rows.push({
    paymentDate: r.startDate,
    name: r.bankName,
    discLoan: notional,
    irsIncoming: notional,
    irsOutgoing: -notional,
    curr: r.currency,
    flowType: 'Notional Exchange',
    intFixDate: r.startDate,
    status: '-',
    pctRate: 0,
    adjStatus: 'Fixed',
  })

  const outgoingRate = Number(irs.outgoingRate1 || 0) + Number(irs.outgoingRate2 || 0)
  const incomingRate = Number(irs.incomingRef1 || 0) + Number(irs.incomingRef2 || 0)
  const frq = irs.outgoingIntFrq
  const step = frqStepDays(frq)
  const adjStatus = irs.outgoingIntCat === '02' ? 'Not fixed' : 'Fixed'

  if (frq === 'Upfront') {
    pushInterestRow(rows, r, irs, r.startDate, r.startDate, 0, loanRate, incomingRate, outgoingRate, adjStatus)
  } else if (frq === 'Rear End') {
    pushInterestRow(
      rows,
      r,
      irs,
      r.endDate,
      r.endDate,
      diffDaysDMY(r.startDate, r.endDate),
      loanRate,
      incomingRate,
      outgoingRate,
      adjStatus,
    )
  } else if (step > 0) {
    const end = parseDMY(irs.endDate)
    let cur = irs.startDate
    let prev = irs.startDate
    let curDate = parseDMY(cur)
    // The original called parseDMY(irs.endDate) inside the loop condition and would have
    // thrown on an unparseable end date; here an invalid end simply yields no interest rows.
    while (end && curDate && curDate.getTime() < end.getTime()) {
      cur = addDaysDMY(cur, step)
      curDate = parseDMY(cur)
      if (curDate && curDate.getTime() > end.getTime()) {
        cur = irs.endDate
        curDate = parseDMY(cur)
      }
      pushInterestRow(
        rows,
        r,
        irs,
        cur,
        cur,
        diffDaysDMY(prev, cur),
        loanRate,
        incomingRate,
        outgoingRate,
        adjStatus,
      )
      prev = cur
      if (cur === irs.endDate) break
    }
  }

  rows.push({
    paymentDate: r.endDate,
    name: r.bankName,
    discLoan: -notional,
    irsIncoming: notional,
    irsOutgoing: -notional,
    curr: r.currency,
    flowType: 'Notional Exchange',
    intFixDate: r.endDate,
    status: '-',
    pctRate: 100,
    adjStatus: 'Fixed',
  })
  return rows
}

export function genIrsTxnNo(): string {
  return `IRSTX${Math.floor(80000 + Math.random() * 19999)}`
}

export function genIrsId(): string {
  return `IRS${Math.floor(4000 + Math.random() * 999)}`
}
