import { apiFetch, createEntity, list, service, toNum } from '@slc/api-client'
import type { AssignedTotals, BankRow, DealIdRow, DttkRow, OttkRow } from './types.ts'

const ottkApi = service('ottk')
const dttkApi = service('dttk')
const dealIdApi = service('dealid')

/**
 * This console only handles tickets still open for assignment. Anything past
 * "05 - Partially Assigned" never enters the lists at all, so search and the advanced
 * filters never see it. A blank status (not yet set) counts as eligible.
 *
 * A hard rule, not a togglable filter — same as the legacy console.
 */
export function isAssignableStatus(code: string | undefined): boolean {
  const n = Number.parseInt(code ?? '', 10)
  return !Number.isFinite(n) || n <= 5
}

export async function loadOttk(signal?: AbortSignal): Promise<OttkRow[]> {
  const rows = await list<OttkRow>(ottkApi('SlcOttkDetail'), undefined, signal ? { signal } : undefined)
  return rows.filter((row) => isAssignableStatus(row.ZottkSt))
}

export async function loadDttk(signal?: AbortSignal): Promise<DttkRow[]> {
  const rows = await list<DttkRow>(dttkApi('SlcDttkDetail'), undefined, signal ? { signal } : undefined)
  return rows.filter((row) => isAssignableStatus(row.ZdttkSt))
}

/**
 * Bank names for the filter dropdowns come from the Bank master list, not from the loaded
 * ticket rows: a bank with no open ticket should still be selectable, and the master list
 * carries the friendly name.
 */
export async function loadBanks(signal?: AbortSignal): Promise<{ ottk: BankRow[]; dttk: BankRow[] }> {
  const options = signal ? { signal } : undefined
  const [ottk, dttk] = await Promise.all([
    list<BankRow>(ottkApi('Bank'), undefined, options).catch(() => [] as BankRow[]),
    list<BankRow>(dttkApi('Bank'), undefined, options).catch(() => [] as BankRow[]),
  ])
  return { ottk, dttk }
}

export async function loadDealIds(signal?: AbortSignal): Promise<DealIdRow[]> {
  return list<DealIdRow>(dealIdApi('DealId'), undefined, signal ? { signal } : undefined)
}

/**
 * No ticket carries an "assigned" or "balance" field, so both are derived from the Deal ID
 * entity: assigned is the sum of ZdealAmt for that ticket, and balance is trade value minus it.
 *
 * Read in ONE request and grouped here. The legacy console issued a separate filtered query
 * per visible row — with 17 OTTK rows and 17 DTTK rows on screen that was 34 round trips per
 * render, throttled three at a time to avoid exhausting the browser's connection pool. The
 * totals are identical; only the request count changes.
 */
export async function loadAssignedTotals(signal?: AbortSignal): Promise<AssignedTotals> {
  const rows = await list<DealIdRow>(
    dealIdApi('DealId'),
    { select: ['ZottkNo', 'ZdttkNo', 'ZdealAmt'] },
    signal ? { signal } : undefined,
  )
  const byOttk = new Map<string, number>()
  const byDttk = new Map<string, number>()
  for (const row of rows) {
    const amount = toNum(row.ZdealAmt)
    if (row.ZottkNo) byOttk.set(row.ZottkNo, (byOttk.get(row.ZottkNo) ?? 0) + amount)
    if (row.ZdttkNo) byDttk.set(row.ZdttkNo, (byDttk.get(row.ZdttkNo) ?? 0) + amount)
  }
  return { byOttk, byDttk }
}

export type CreateDealIdInput = {
  ottkNo: string
  dttkNo: string
  entityId: string
  structure: string
  amount: number
  currency: string
  description: string
  status: string
}

/**
 * Creates the Deal ID and returns the number SAP generated. The key is recovered by the
 * shared createEntity helper, which reads the response body, then the OData-EntityId /
 * Location header, then falls back to a highest-value re-read.
 */
export async function createDealId(input: CreateDealIdInput): Promise<string | undefined> {
  const payload = {
    ZottkNo: input.ottkNo,
    ZdttkNo: input.dttkNo,
    ZentId: input.entityId,
    Zstr: input.structure,
    ZdealAmt: input.amount,
    ZdealCurr: input.currency,
    ZdealIdDesc: input.description,
    ZdealStat: input.status,
  }
  const { key } = await createEntity<DealIdRow & Record<string, unknown>>(
    dealIdApi('DealId'),
    payload,
    'ZdealId',
  )
  return key
}

/** Used only to keep the connection indicator honest while the user is idle. */
export async function pingBackend(): Promise<void> {
  await apiFetch(ottkApi('Bank')).catch(() => undefined)
}
