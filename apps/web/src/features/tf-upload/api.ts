import { apiFetch, service } from '@slc/api-client'
import { TF_FIELD_MAP, buildRowPayload, isCreateRow, padKey } from './fields.ts'
import type { BusinessUnit, CommodityRow } from './fields.ts'
import type { CellValue } from './xlsx.ts'

const tfApi = service('tf')

/**
 * Commodity master, exposed by the same service as TrdFlow. A failure yields an empty list:
 * the enrichment it feeds is optional, and losing it must not stop an upload.
 */
export async function loadCommodities(): Promise<CommodityRow[]> {
  return apiFetch<{ value?: CommodityRow[] }>(tfApi('ChComm'))
    .then((data) => data?.value ?? [])
    .catch(() => [])
}

/**
 * Uploads one row. A blank Trade Flow ID creates (POST, backend generates the number and
 * hardcodes split '01' plus today's date); anything else updates the existing row, addressed
 * by its zero-padded key.
 */
export async function uploadRow(
  row: readonly CellValue[],
  buCode: string,
  tfTypeCode: string,
  businessUnits: readonly BusinessUnit[],
  commodities: readonly CommodityRow[],
): Promise<void> {
  const isCreate = isCreateRow(row)
  const body = buildRowPayload(row, buCode, tfTypeCode, isCreate, businessUnits, commodities)

  if (isCreate) {
    await apiFetch(tfApi('TrdFlow'), { method: 'POST', body })
    return
  }

  const ztfNo = padKey(row[0], 10)
  const ztfSplit = padKey(row[1], 2)
  if (!ztfSplit) throw new Error('Missing TF Split ID')

  const key = `TrdFlow(ZtfNo='${encodeURIComponent(ztfNo)}',ZtfSplit='${encodeURIComponent(ztfSplit)}')`
  await apiFetch(tfApi(key), { method: 'PATCH', body })
}

/** Keeps the connection dot honest while the user is idle. */
export async function pingBackend(): Promise<void> {
  await apiFetch(tfApi('ChComm')).catch(() => undefined)
}

export { TF_FIELD_MAP }
