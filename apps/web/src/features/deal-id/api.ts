import { apiFetch, list, service, toNum } from '@slc/api-client'
import { loadEntityStrings } from '../../shared/entity-string.ts'
import { mwCreate, mwList, nextNumber } from '../../shared/middleware.ts'
import type { AssignedTotals, BankRow, DealIdRow, DttkRow, OttkRow } from './types.ts'

const ottkApi = service('ottk')
const dttkApi = service('dttk')

/**
 * Two Deal ID fields do not survive the move intact. The currency column is ZCURR on the
 * table where the OData service projected it as ZdealCurr, so it is renamed back here rather
 * than at every call site; the status description was computed by the service and has no
 * column behind it, so it simply is not there. Everything else matches DealIdRow as it
 * stands, which is why the grids and dialogs did not change.
 */
type MiddlewareDealRow = Omit<DealIdRow, 'ZdealCurr' | 'ZdealStatDesc'> & { Zcurr?: string }

function toDealIdRow(row: MiddlewareDealRow): DealIdRow {
  const { Zcurr, ...rest } = row
  return Zcurr === undefined ? rest : { ...rest, ZdealCurr: Zcurr }
}

/**
 * This console only handles tickets still open for assignment. Anything past
 * "05 - Partially Assigned" never enters the lists at all, so search and the advanced
 * filters never see it. A blank status (not yet set) counts as eligible.
 *
 * A hard rule, not a togglable filter — same as the legacy console.
 *
 * Still applied here rather than pushed to the middleware: its filter matches one value
 * exactly, and "status at or below 05, or blank" is a range the query cannot express.
 */
export function isAssignableStatus(code: string | undefined): boolean {
  const n = Number.parseInt(code ?? '', 10)
  return !Number.isFinite(n) || n <= 5
}

export async function loadOttk(signal?: AbortSignal): Promise<OttkRow[]> {
  const [rows, { entityById, bankByCode }] = await Promise.all([
    mwList<OttkRow>('ottk', undefined, signal),
    joinDescriptions(signal),
  ])
  return rows
    .filter((row) => isAssignableStatus(row.ZottkSt))
    .map((row) => ({
      ...row,
      ZentDesc: entityById.get(row.ZentId ?? '') ?? '',
      BpName: bankByCode.get(row.ZottkBank ?? '') ?? '',
    }))
}

export async function loadDttk(signal?: AbortSignal): Promise<DttkRow[]> {
  const [rows, { entityById }] = await Promise.all([
    mwList<DttkRow>('dttk', undefined, signal),
    joinDescriptions(signal),
  ])
  return rows
    .filter((row) => isAssignableStatus(row.ZdttkSt))
    .map((row) => ({ ...row, ZentDesc: entityById.get(row.ZentId ?? '') ?? '' }))
}

/**
 * Bank names for the filter dropdowns come from the Bank master list, not from the loaded
 * ticket rows: a bank with no open ticket should still be selectable, and the master list
 * carries the friendly name.
 *
 * Left on SAP OData deliberately — the middleware exposes the ticket and Deal ID tables but
 * no business-partner master, so there is nothing to point this at.
 */
export async function loadBanks(signal?: AbortSignal): Promise<{ ottk: BankRow[]; dttk: BankRow[] }> {
  const options = signal ? { signal } : undefined
  const [ottk, dttk] = await Promise.all([
    list<BankRow>(ottkApi('Bank'), undefined, options).catch(() => [] as BankRow[]),
    list<BankRow>(dttkApi('Bank'), undefined, options).catch(() => [] as BankRow[]),
  ])
  return { ottk, dttk }
}

/**
 * Entity description and bank name used to arrive on the row: the OData services joined them
 * in, and every grid and dialog here reads row.ZentDesc / row.BpName directly. The middleware
 * serves raw table columns, so the join is restored here rather than by threading two lookups
 * through each column builder and dialog.
 *
 * Both lookups degrade to empty. A description that cannot be fetched should leave its cell
 * blank, exactly as it would have when the field was absent — it must not fail the list.
 */
async function joinDescriptions(signal?: AbortSignal): Promise<{
  entityById: Map<string, string>
  bankByCode: Map<string, string>
}> {
  const [entities, banks] = await Promise.all([
    loadEntityStrings(signal).catch(() => []),
    loadBanks(signal).catch(() => ({ ottk: [] as BankRow[], dttk: [] as BankRow[] })),
  ])
  return {
    entityById: new Map(entities.map((entity) => [entity.ZentId ?? '', entity.ZentDesc ?? ''])),
    bankByCode: new Map(
      [...banks.ottk, ...banks.dttk].map((bank) => [bank.Zbp ?? '', bank.BpName ?? '']),
    ),
  }
}

export async function loadDealIds(signal?: AbortSignal): Promise<DealIdRow[]> {
  const [rows, { entityById }] = await Promise.all([
    mwList<MiddlewareDealRow>('dealid', undefined, signal),
    joinDescriptions(signal),
  ])
  return rows.map((row) => ({ ...toDealIdRow(row), ZentDesc: entityById.get(row.ZentId ?? '') ?? '' }))
}

/**
 * No ticket carries an "assigned" or "balance" field, so both are derived from the Deal ID
 * entity: assigned is the sum of ZdealAmt for that ticket, and balance is trade value minus it.
 *
 * Read in ONE request and grouped here. The legacy console issued a separate filtered query
 * per visible row — with 17 OTTK rows and 17 DTTK rows on screen that was 34 round trips per
 * render, throttled three at a time to avoid exhausting the browser's connection pool. The
 * totals are identical; only the request count changes.
 *
 * The three-column projection is gone with OData: the middleware returns whole rows and has
 * no $select. That costs bandwidth on one request, which is well inside what the round-trip
 * saving bought, and the arithmetic is unchanged.
 */
export async function loadAssignedTotals(signal?: AbortSignal): Promise<AssignedTotals> {
  const rows = await mwList<MiddlewareDealRow>('dealid', undefined, signal)
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
 * Creates the Deal ID and returns the id allocated for it.
 *
 * ZSBLC_TXN is the second half of the table's composite key and is deliberately always sent
 * blank: the SBLC transaction number is issued by Treasury when the standby is raised, and
 * this console neither collects it nor receives it on the ticket it creates against.
 *
 * The consequence is worth knowing. The middleware reads a blank key field as a missing one,
 * so a row written this way cannot be addressed by a later PATCH. That costs nothing while
 * Deal IDs are only listed and created here, and would have to be revisited before this
 * console grows an edit path.
 *
 * Currency is sent as Zcurr, not ZdealCurr: the table column is ZCURR, and the OData service's
 * projected name has no column behind it, so it would be dropped from the payload in silence.
 */
export async function createDealId(input: CreateDealIdInput): Promise<string | undefined> {
  const ZdealId = await nextNumber('dealid', 'ZdealId')
  await mwCreate('dealid', {
    ZdealId,
    ZsblcTxn: '',
    ZottkNo: input.ottkNo,
    ZdttkNo: input.dttkNo,
    ZentId: input.entityId,
    Zstr: input.structure,
    ZdealAmt: input.amount,
    Zcurr: input.currency,
    ZdealIdDesc: input.description,
    ZdealStat: input.status,
  })
  return ZdealId
}

/** Used only to keep the connection indicator honest while the user is idle. */
export async function pingBackend(): Promise<void> {
  await apiFetch(ottkApi('Bank')).catch(() => undefined)
}
