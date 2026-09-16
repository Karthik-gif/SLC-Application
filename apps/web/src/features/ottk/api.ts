import { apiFetch, apiRequest, entityPath, list, odataQuery, odataString, service, toNum } from '@slc/api-client'
import { isChargeRowTouched } from '../../shared/charges.ts'
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
const dttkApi = service('dttk')

/**
 * This console only handles tickets still open for assignment. Anything past
 * "05 - Partially Assigned" never enters the lists. A blank status counts as eligible.
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
 * The five master-data lookups the create/edit form depends on. A lookup that fails yields
 * an empty list rather than failing the others — a missing Ref Int list must not stop the
 * form opening.
 */
export async function loadLookups(signal?: AbortSignal): Promise<Lookups> {
  const options = signal ? { signal } : undefined
  const get = async <T>(entity: string): Promise<T[]> =>
    list<T>(ottkApi(entity), undefined, options).catch(() => [] as T[])

  const [banks, entities, coCodes, refInts, feeTypes] = await Promise.all([
    get<BankRow>('Bank'),
    get<EntityRow>('EntityString'),
    get<CoCodeRow>('CoCode'),
    get<RefIntRow>('RefInt'),
    get<FeeTypeRow>('FeeType'),
  ])
  return { banks, entities, coCodes, refInts, feeTypes }
}

export async function loadFeeTypes(): Promise<FeeTypeRow[]> {
  return list<FeeTypeRow>(ottkApi('FeeType')).catch(() => [])
}

/** Existing charge lines for a ticket, keyed by fee type. */
export async function fetchFeeRowsByType(ottkNo: string): Promise<Record<string, Record<string, unknown>>> {
  const byType: Record<string, Record<string, unknown>> = {}
  const rows = await list<Record<string, unknown>>(ottkApi('SlcOttkFee'), {
    filter: `ZottkNo eq ${odataString(ottkNo)}`,
  })
  for (const row of rows) byType[String(row['ZfeeType'] ?? '')] = row
  return byType
}

/**
 * Creates the header and returns the server-generated OTTK number.
 *
 * `Prefer: return=representation` asks the service to echo the created entity, which is the
 * cheapest of the three ways the number can come back; createEntity falls through to the
 * OData-EntityId/Location header and then a highest-number re-read.
 */
export async function createOttk(payload: OttkPayload): Promise<string> {
  const response = await apiRequest<OttkRow>(ottkApi('SlcOttkDetail'), {
    method: 'POST',
    body: payload,
    headers: { Prefer: 'return=representation' },
  })
  if (response.data?.ZottkNo) return String(response.data.ZottkNo)

  const header = response.headers.get('OData-EntityId') ?? response.headers.get('Location') ?? ''
  const match = header.match(/\('([^']+)'\)/)
  if (match?.[1]) return decodeURIComponent(match[1])

  try {
    const latest = await list<OttkRow>(ottkApi('SlcOttkDetail'), { orderby: 'ZottkNo desc', top: 1 })
    if (latest[0]?.ZottkNo) return String(latest[0].ZottkNo)
  } catch {
    // Fall through to '' — the caller reports it rather than swallowing it.
  }
  return ''
}

export async function updateOttk(key: string, payload: OttkPayload): Promise<void> {
  await apiFetch(ottkApi(entityPath('SlcOttkDetail', key)), { method: 'PATCH', body: payload })
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
