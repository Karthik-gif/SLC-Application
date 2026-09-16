import { apiFetch, apiRequest, entityPath, list, odataString, service, toNum } from '@slc/api-client'
import { isChargeRowTouched } from '../../shared/charges.ts'
import type { ChargeRow } from '../../shared/charge-types.ts'
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
  const rows = await list<DttkRow>(dttkApi('SlcDttkDetail'), undefined, signal ? { signal } : undefined)
  return rows.filter((row) => isAssignableStatus(row.ZdttkSt))
}

export async function loadOttk(signal?: AbortSignal): Promise<OttkRow[]> {
  const rows = await list<OttkRow>(ottkApi('SlcOttkDetail'), undefined, signal ? { signal } : undefined)
  return rows.filter((row) => isAssignableStatus(row.ZottkSt))
}

/** A single ticket by key, for the display-only entry points. */
export async function loadDttkByKey(key: string): Promise<DttkRow | undefined> {
  return apiFetch<DttkRow>(dttkApi(entityPath('SlcDttkDetail', key))).catch(() => undefined)
}

export async function loadOttkByKey(key: string): Promise<OttkRow | undefined> {
  return apiFetch<OttkRow>(ottkApi(entityPath('SlcOttkDetail', key))).catch(() => undefined)
}

/**
 * Master data for the create/edit form. Each lookup degrades to an empty list on failure
 * rather than failing the rest — a missing Ref Int list must not stop the form opening.
 */
export async function loadLookups(signal?: AbortSignal): Promise<Omit<Lookups, 'traders'>> {
  const options = signal ? { signal } : undefined
  const get = async <T>(api: (path: string) => string, entity: string): Promise<T[]> =>
    list<T>(api(entity), undefined, options).catch(() => [] as T[])

  const [ottkBanks, dttkBanks, entities, coCodes, refInts, confirmationFeeTypes, otherFeeTypes] =
    await Promise.all([
      get<BankRow>(ottkApi, 'Bank'),
      get<BankRow>(dttkApi, 'Bank'),
      get<EntityRow>(ottkApi, 'EntityString'),
      get<CoCodeRow>(ottkApi, 'CoCode'),
      get<RefIntRow>(ottkApi, 'RefInt'),
      get<FeeTypeRow>(dttkApi, 'CFeeType'),
      get<FeeTypeRow>(dttkApi, 'DFeeType'),
    ])

  return { ottkBanks, dttkBanks, entities, coCodes, refInts, confirmationFeeTypes, otherFeeTypes }
}

/** Retried lazily when a Charges popup finds its list empty. */
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

/** Existing charge lines for a ticket, keyed by fee type. Both breakdowns come from one read. */
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

/** Creates the header and returns the server-generated DTTK number, or '' if unreadable. */
export async function createDttk(payload: DttkPayload): Promise<string> {
  const response = await apiRequest<DttkRow>(dttkApi('SlcDttkDetail'), {
    method: 'POST',
    body: payload,
    headers: { Prefer: 'return=representation' },
  })
  if (response.data?.ZdttkNo) return String(response.data.ZdttkNo)

  const header = response.headers.get('OData-EntityId') ?? response.headers.get('Location') ?? ''
  const match = header.match(/\('([^']+)'\)/)
  if (match?.[1]) return decodeURIComponent(match[1])

  try {
    const latest = await list<DttkRow>(dttkApi('SlcDttkDetail'), { orderby: 'ZdttkNo desc', top: 1 })
    if (latest[0]?.ZdttkNo) return String(latest[0].ZdttkNo)
  } catch {
    // Fall through to '' — the caller reports it.
  }
  return ''
}

export async function updateDttk(key: string, payload: DttkPayload): Promise<void> {
  await apiFetch(dttkApi(entityPath('SlcDttkDetail', key)), { method: 'PATCH', body: payload })
}

export type FeeSyncResult = { saved: number; failed: string[] }

/**
 * Replaces a ticket's charge lines with whatever both grids hold. Lines live in
 * ZSGSLCTR_FEEDATA keyed by (ZdttkNo, ZfeeType); the stored set is replaced wholesale
 * rather than diffed, the same approach the OTTK console takes.
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
