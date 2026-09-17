import { apiFetch, entityPath, list, service } from '@slc/api-client'
import type { TrdFlowKey, TrdFlowRow } from './types.ts'

const tfApi = service('tf')

export type CommodityRow = {
  ZchComm?: string
  ZchName1?: string
  ZchName2?: string
  ZcommId?: string
  ZcommDesc?: string
}

/**
 * The trade flow list. A failure propagates: an empty table with no explanation is worse
 * than an error message, and the caller renders one.
 */
export async function loadTradeFlows(): Promise<TrdFlowRow[]> {
  return list<TrdFlowRow>(tfApi('TrdFlow'), { orderby: 'ZtfNo desc' })
}

/**
 * Commodity master. A failure yields an empty list: it feeds an optional label lookup and
 * must not stop the screen, which is how tf-upload treats the same call.
 */
export async function loadCommodities(): Promise<CommodityRow[]> {
  return apiFetch<{ value?: CommodityRow[] }>(tfApi('ChComm'))
    .then((data) => data?.value ?? [])
    .catch(() => [])
}

/**
 * Updates one row. entityPath builds the composite key in the form SAP's own services use
 * and escapes each value exactly once.
 */
export async function patchTradeFlow(
  key: TrdFlowKey,
  changes: Partial<TrdFlowRow>,
): Promise<void> {
  await apiFetch(tfApi(entityPath('TrdFlow', { ...key })), { method: 'PATCH', body: changes })
}
