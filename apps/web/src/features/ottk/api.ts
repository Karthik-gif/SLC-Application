import { apiFetch, entityPath, list, odataQuery, odataString, service, toNum } from '@slc/api-client'
import { isChargeRowTouched } from '../../shared/charges.ts'
import { loadCoCodes } from '../../shared/co-code.ts'
import { loadEntityStrings } from '../../shared/entity-string.ts'
import { mwCreate, mwList, mwUpdate, nextNumber } from '../../shared/middleware.ts'
import type {
  BankRow,
  ChargeRow,
  CoCodeRow,
  DttkRow,
  EntityRow,
  FeeTypeRow,
  Lookups,
  OttkPayload,
  OttkRow,
  RefIntRow,
} from './types.ts'

const ottkApi = service('ottk')

/**
 * This console only handles tickets still open for assignment. Anything past
 * "05 - Partially Assigned" never enters the lists. A blank status counts as eligible.
 */
export function isAssignableStatus(code: string | undefined): boolean {
  const n = Number.parseInt(code ?? '', 10)
  return !Number.isFinite(n) || n <= 5
}

export async function loadOttk(signal?: AbortSignal): Promise<OttkRow[]> {
  const rows = await mwList<OttkRow>('ottk', undefined, signal)
  return rows.filter((row) => isAssignableStatus(row.ZottkSt))
}

export async function loadDttk(signal?: AbortSignal): Promise<DttkRow[]> {
  const rows = await mwList<DttkRow>('dttk', undefined, signal)
  return rows.filter((row) => isAssignableStatus(row.ZdttkSt))
}

/**
 * The five master-data lookups the create/edit form depends on. A lookup that fails yields
 * an empty list rather than failing the others — a missing Ref Int list must not stop the
 * form opening.
 *
 * Bank and Fee Type are still read from SAP OData: the middleware exposes no equivalent
 * resource for either, so they cannot move until it does.
 */
export async function loadLookups(signal?: AbortSignal): Promise<Lookups> {
  const options = signal ? { signal } : undefined
  const get = async <T>(entity: string): Promise<T[]> =>
    list<T>(ottkApi(entity), undefined, options).catch(() => [] as T[])

  const [banks, entities, coCodes, refInts, feeTypes] = await Promise.all([
    get<BankRow>('Bank'),
    loadEntityStrings(signal).catch(() => [] as EntityRow[]),
    loadCoCodes(signal).catch(() => [] as CoCodeRow[]),
    mwList<RefIntRow>('refInt', undefined, signal).catch(() => [] as RefIntRow[]),
    get<FeeTypeRow>('FeeType'),
  ])
  return { banks, entities, coCodes, refInts, feeTypes }
}

export async function loadFeeTypes(): Promise<FeeTypeRow[]> {
  return list<FeeTypeRow>(ottkApi('FeeType')).catch(() => [])
}

/**
 * Existing charge lines for a ticket, keyed by fee type.
 *
 * Still on SAP OData. The middleware's 'fee' resource is the fee-type master, not the
 * per-ticket charge lines, so there is nothing to migrate this onto.
 */
export async function fetchFeeRowsByType(ottkNo: string): Promise<Record<string, Record<string, unknown>>> {
  const byType: Record<string, Record<string, unknown>> = {}
  const rows = await list<Record<string, unknown>>(ottkApi('SlcOttkFee'), {
    filter: `ZottkNo eq ${odataString(ottkNo)}`,
  })
  for (const row of rows) byType[String(row['ZfeeType'] ?? '')] = row
  return byType
}

/**
 * Creates the header and returns the OTTK number.
 *
 * The number is allocated up front because the middleware does not generate keys — a POST
 * without one inserts a blank-keyed row. That removes the guesswork the OData path needed to
 * learn the number after the fact, but it also means the number is only as unique as
 * `nextNumber` can make it; see the caveat there.
 */
export async function createOttk(payload: OttkPayload): Promise<string> {
  const ZottkNo = await nextNumber('ottk', 'ZottkNo')
  await mwCreate('ottk', { ...payload, ZottkNo })
  return ZottkNo
}

export async function updateOttk(key: string, payload: OttkPayload): Promise<void> {
  await mwUpdate('ottk', { ZottkNo: key }, payload)
}

export type FeeSyncResult = { saved: number; failed: string[] }

/**
 * Replaces a ticket's charge lines with whatever the Charges grid holds: every existing line
 * is deleted, then every touched row is posted.
 *
 * A delete that fails is ignored on purpose — a stale line is preferable to blocking the
 * whole OTTK save. A post that fails is collected and reported in the success dialog, not a
 * toast: the toast is replaced within seconds and sits behind the dialog, so a failed charge
 * line was invisible in practice.
 *
 * Still on SAP OData for the same reason as fetchFeeRowsByType: the middleware's 'fee'
 * resource is the fee-type master, not per-ticket charge lines.
 */
export async function syncOttkFeeRows(
  ottkNo: string,
  currency: string,
  chargeRows: readonly ChargeRow[],
): Promise<FeeSyncResult> {
  const result: FeeSyncResult = { saved: 0, failed: [] }

  let existing: Array<Record<string, unknown>> = []
  try {
    existing = await list<Record<string, unknown>>(ottkApi('SlcOttkFee'), {
      filter: `ZottkNo eq ${odataString(ottkNo)}`,
    })
  } catch {
    // Treat an unreadable list as none.
  }

  for (const row of existing) {
    try {
      await apiFetch(
        ottkApi(entityPath('SlcOttkFee', { ZottkNo: ottkNo, ZfeeType: String(row['ZfeeType'] ?? '') })),
        { method: 'DELETE' },
      )
    } catch {
      // Best effort.
    }
  }

  for (const row of chargeRows) {
    if (!isChargeRowTouched(row)) continue
    try {
      await apiFetch(ottkApi('SlcOttkFee'), {
        method: 'POST',
        body: {
          ZottkNo: ottkNo,
          ZfeeType: row.ZfeeType,
          Zcat: row.Zcat || '',
          Zcode: row.Zcode || '',
          ZottkCurr: currency || 'USD',
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
  await apiFetch(ottkApi('Bank')).catch(() => undefined)
}

/** Exposed for the filter dropdowns, which label banks "code — name". */
export const bankLabel = (bank: BankRow): string => `${bank.Zbp ?? ''} — ${bank.BpName ?? ''}`

export { odataQuery }
