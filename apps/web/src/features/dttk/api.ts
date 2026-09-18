import { apiFetch, entityPath, list, odataString, service, toNum } from '@slc/api-client'
import { isChargeRowTouched } from '../../shared/charges.ts'
import type { ChargeRow } from '../../shared/charge-types.ts'
import { loadCoCodes } from '../../shared/co-code.ts'
import { loadEntityStrings } from '../../shared/entity-string.ts'
import { mwCreate, mwList, mwUpdate, nextNumber } from '../../shared/middleware.ts'
import type {
  BankRow,
  CoCodeRow,
  DttkPayload,
  DttkRow,
  EntityRow,
  FeeTypeRow,
  Lookups,
  OttkRow,
  RefIntRow,
} from './types.ts'

const ottkApi = service('ottk')
const dttkApi = service('dttk')

/**
 * This console only handles tickets still open for assignment. Anything past
 * "05 - Partially Assigned" never enters the lists. A blank status counts as eligible.
 */
export function isAssignableStatus(code: string | undefined): boolean {
  const n = Number.parseInt(code ?? '', 10)
  return !Number.isFinite(n) || n <= 5
}

export async function loadDttk(signal?: AbortSignal): Promise<DttkRow[]> {
  const rows = await mwList<DttkRow>('dttk', undefined, signal)
  return rows.filter((row) => isAssignableStatus(row.ZdttkSt))
}

export async function loadOttk(signal?: AbortSignal): Promise<OttkRow[]> {
  const rows = await mwList<OttkRow>('ottk', undefined, signal)
  return rows.filter((row) => isAssignableStatus(row.ZottkSt))
}

/**
 * A single ticket by key, for the display-only entry points. The middleware has no by-key
 * read, so the key goes through the ordinary filter and the one row is taken. A miss and a
 * failed read both come back as undefined, which is all the callers distinguish.
 */
export async function loadDttkByKey(key: string): Promise<DttkRow | undefined> {
  return mwList<DttkRow>('dttk', { ZdttkNo: key })
    .then((rows) => rows[0])
    .catch(() => undefined)
}

export async function loadOttkByKey(key: string): Promise<OttkRow | undefined> {
  return mwList<OttkRow>('ottk', { ZottkNo: key })
    .then((rows) => rows[0])
    .catch(() => undefined)
}

/**
 * Master data for the create/edit form. Each lookup degrades to an empty list on failure
 * rather than failing the rest — a missing Ref Int list must not stop the form opening.
 *
 * Only Ref Int has moved to the middleware. Both bank lists and the two fee-type lists have
 * no middleware resource behind them, so they stay on SAP OData until one exists.
 */
export async function loadLookups(signal?: AbortSignal): Promise<Omit<Lookups, 'traders'>> {
  const options = signal ? { signal } : undefined
  const get = async <T>(api: (path: string) => string, entity: string): Promise<T[]> =>
    list<T>(api(entity), undefined, options).catch(() => [] as T[])

  const [ottkBanks, dttkBanks, entities, coCodes, refInts, confirmationFeeTypes, otherFeeTypes] =
    await Promise.all([
      get<BankRow>(ottkApi, 'Bank'),
      get<BankRow>(dttkApi, 'Bank'),
      loadEntityStrings(signal).catch(() => [] as EntityRow[]),
      loadCoCodes(signal).catch(() => [] as CoCodeRow[]),
      mwList<RefIntRow>('refInt', undefined, signal).catch(() => [] as RefIntRow[]),
      get<FeeTypeRow>(dttkApi, 'CFeeType'),
      get<FeeTypeRow>(dttkApi, 'DFeeType'),
    ])

  return { ottkBanks, dttkBanks, entities, coCodes, refInts, confirmationFeeTypes, otherFeeTypes }
}

/**
 * Retried lazily when a Charges popup finds its list empty. Stays on SAP OData: the
 * middleware's 'fee' resource is the master for a different fee table, so it cannot answer
 * for CFeeType/DFeeType.
 */
export async function loadFeeTypes(kind: 'confirmation' | 'other'): Promise<FeeTypeRow[]> {
  return list<FeeTypeRow>(dttkApi(kind === 'confirmation' ? 'CFeeType' : 'DFeeType')).catch(() => [])
}

/**
 * Trader codes are collected from the tickets actually loaded rather than a master list —
 * there is no trader lookup service, and a hardcoded list would go stale.
 */
export function collectTraders(dttkRows: readonly DttkRow[], ottkRows: readonly OttkRow[]): string[] {
  const seen = new Set<string>()
  for (const row of dttkRows) {
    if (row.ZdTrader) seen.add(row.ZdTrader)
    if (row.ZcTrader) seen.add(row.ZcTrader)
  }
  for (const row of ottkRows) if (row.Ztrader) seen.add(row.Ztrader)
  return [...seen].sort((a, b) => a.localeCompare(b))
}

/**
 * Existing charge lines for a ticket, keyed by fee type. Both breakdowns come from one read.
 *
 * Still SAP OData. The middleware exposes no per-ticket charge lines at all — its 'fee'
 * resource is the fee-type master, not ZSGSLCTR_FEEDATA — so there is nothing to move to.
 */
export async function fetchFeeRowsByType(dttkNo: string): Promise<Record<string, Record<string, unknown>>> {
  const byType: Record<string, Record<string, unknown>> = {}
  const rows = await list<Record<string, unknown>>(dttkApi('SlcDttkFee'), {
    filter: `ZdttkNo eq ${odataString(dttkNo)}`,
  })
  for (const row of rows) byType[String(row['ZfeeType'] ?? '')] = row
  return byType
}

/**
 * Writable properties the screen has no field for, carried over from the stored row on
 * update. The BO used to overwrite the whole row on PATCH, blanking anything omitted; that
 * is fixed, but preserving them keeps the console safe against a system where the fix has
 * not been transported yet.
 *
 * ZnoCbank is in this list deliberately: the "No Confirmation Bank" checkbox was removed
 * from the modal, so the console has no user input for the flag and must not invent one.
 */
export const PASSTHROUGH_FIELDS = [
  'ZccOttkValue',
  'ZccOttkCurr',
  'ZccDttkValue',
  'ZccDttkCurr',
  'ZresFrq',
  'ZdttkSt',
  'ZdrefRate',
  'ZcfTenor',
  'ZcfPerc',
  'ZnfeeFrom',
  'ZnfeeTo',
  'ZnfTenor',
  'ZnfPerc',
  'Zdealer',
  'ZresidRelChk',
  'ZnoCbank',
] as const

export function withUntouchedFields(
  payload: DttkPayload,
  stored: DttkRow | undefined,
): DttkPayload {
  if (!stored) return payload
  const next = { ...payload }
  const record = stored as Record<string, unknown>
  for (const field of PASSTHROUGH_FIELDS) {
    const value = record[field]
    if (value !== undefined) next[field] = value as string | number | null
  }
  return next
}

/**
 * Creates the header and returns its DTTK number.
 *
 * The middleware writes only what it is given and generates no key, so the number is
 * allocated first and posted as part of the row. Knowing it up front retires the three-way
 * key recovery the OData service needed: there is no representation to prefer, no entity
 * header to parse and no highest-number re-read, and the number can no longer come back
 * unreadable — a failure to allocate throws before anything is written.
 */
export async function createDttk(payload: DttkPayload): Promise<string> {
  const ZdttkNo = await nextNumber('dttk', 'ZdttkNo')
  await mwCreate('dttk', { ...payload, ZdttkNo })
  return ZdttkNo
}

export async function updateDttk(key: string, payload: DttkPayload): Promise<void> {
  await mwUpdate('dttk', { ZdttkNo: key }, payload)
}

export type FeeSyncResult = { saved: number; failed: string[] }

/**
 * Replaces a ticket's charge lines with whatever both grids hold. Lines live in
 * ZSGSLCTR_FEEDATA keyed by (ZdttkNo, ZfeeType); the stored set is replaced wholesale
 * rather than diffed, the same approach the OTTK console takes.
 *
 * Left on SAP OData with the rest of the charge handling: the middleware carries the
 * fee-type master only, never per-ticket lines, so there is no equivalent to write to.
 */
export async function syncDttkFeeRows(
  dttkNo: string,
  currency: string,
  confirmationRows: readonly ChargeRow[],
  otherRows: readonly ChargeRow[],
): Promise<FeeSyncResult> {
  const result: FeeSyncResult = { saved: 0, failed: [] }

  let existing: Array<Record<string, unknown>> = []
  try {
    existing = await list<Record<string, unknown>>(dttkApi('SlcDttkFee'), {
      filter: `ZdttkNo eq ${odataString(dttkNo)}`,
    })
  } catch {
    // Treat an unreadable list as none.
  }

  for (const row of existing) {
    try {
      await apiFetch(
        dttkApi(entityPath('SlcDttkFee', { ZdttkNo: dttkNo, ZfeeType: String(row['ZfeeType'] ?? '') })),
        { method: 'DELETE' },
      )
    } catch {
      // Best effort — a stale line is preferable to blocking the DTTK save.
    }
  }

  for (const row of [...confirmationRows, ...otherRows]) {
    if (!isChargeRowTouched(row)) continue
    try {
      await apiFetch(dttkApi('SlcDttkFee'), {
        method: 'POST',
        body: {
          ZdttkNo: dttkNo,
          ZfeeType: row.ZfeeType,
          Zcat: row.Zcat || '',
          Zcode: row.Zcode || '',
          // ZdttkCurr is read-only on the BO but must still be in the body: OData V4 rejects
          // an amount without its paired currency property.
          ZdttkCurr: currency || 'USD',
          ZbAmt: toNum(row.ZbAmt),
          Zrate: toNum(row.Zrate),
          Zday: row.Zday || '',
          Zamt: toNum(row.Zamt),
          ZfAmt: toNum(row.ZfAmt),
        },
      })
      result.saved++
    } catch (error) {
      result.failed.push(`${row.ZfeeType}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return result
}

/** Keeps the connection dot honest while the user is idle. */
export async function pingBackend(): Promise<void> {
  await apiFetch(dttkApi('Bank')).catch(() => undefined)
}
