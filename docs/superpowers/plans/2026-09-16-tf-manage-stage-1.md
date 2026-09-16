# Manage Trade Flows (Stage 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `tf-manage` placeholder with a working React conversion of `legacy/Manage TF.html` whose trade-flow list and four mappable tabs read and write the live `TrdFlow` OData entity.

**Architecture:** One feature folder under `apps/web/src/features/tf-manage/`. The list and the tabs are driven from a single `TrdFlowRow` loaded from `GET /api/tf/TrdFlow`; editing a tab and saving issues a `PATCH` against the composite key `(ZtfNo, ZtfSplit)`. Appearance comes from a generated scoped stylesheet, not hand-written CSS. Fields with no SAP counterpart render disabled rather than being removed, because the generated CSS expects the original element structure.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, `@slc/api-client`, `node --test`.

**Spec:** `docs/superpowers/specs/2026-09-16-tf-manage-conversion-design.md`

## Global Constraints

Copied verbatim from the spec and `docs/ADDING-AN-APP.md`:

- **Do not use `@slc/ui` in a converted app.** Those components are for new screens; their markup differs from the legacy pages. `@slc/api-client` is behaviour, not appearance, and may be used freely.
- **Keep the original look exactly.** Generate the stylesheet with `tools/scope-css.mjs`; never hand-write or hand-edit it.
- Mirror the original markup element for element and class for class, wrapped in `<div className="tfmanage">`.
- `getElementById` + `innerHTML` becomes state and JSX — **not** `useRef` and `dangerouslySetInnerHTML`.
- Do not port `esc()`; React escapes interpolated values.
- Do not port `runLimited(tasks, 3)`; use plain `Promise.all`.
- `<BackButton />` goes first in the header's left group, `<SignOutButton />` last in its action group.
- `TF_FIELD_MAP` is imported from `tf-upload/fields.ts`, never redeclared.
- `status: "ready"` in `config/apps.json` is set **only** once the app works against its real backends.
- Stage 2 scope (BL Data 1/2, BL grid, split, Assign Deal, Compliance, PDF upload) is **out of scope**. Those tabs render a "not yet backed by SAP" panel.
- Every task ends with `npm run verify` passing (typecheck + test + build).

---

### Task 1: Generate the stylesheet and establish types

**Files:**
- Create: `apps/web/src/features/tf-manage/tf-manage.legacy.css` (generated)
- Create: `apps/web/src/features/tf-manage/types.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `TrdFlowRow` — the row type every later task uses. Field names are the OData property names exactly as they appear in `TF_FIELD_MAP`.

- [ ] **Step 1: Generate the scoped stylesheet**

```bash
node tools/scope-css.mjs "legacy/Manage TF.html" ".tfmanage" "apps/web/src/features/tf-manage/tf-manage.legacy.css"
```

Expected: the file is written. Do not edit it by hand at any point in this plan.

- [ ] **Step 2: Write `types.ts`**

```ts
/**
 * A TrdFlow row as the gateway returns it. Property names are the OData field names, so a
 * row can be PATCHed back without a translation layer. Every field is optional: SAP omits
 * nulls from a JSON projection rather than sending them as null.
 */
export type TrdFlowRow = {
  ZtfNo?: string
  ZtfSplit?: string
  ZtfDate?: string
  Zbu?: string
  Zoprtr?: string
  ZblVsslName?: string
  Zcmmd?: string
  ZconNum1?: string
  ZpurInc?: string
  Zpaypur?: string
  Zbplsb?: string
  Zbplbb?: string
  ZconNum2?: string
  Zsalesinc?: string
  Zptss?: string
  Zbslsb?: string
  Zbslbb?: string
  Zotfd?: string
  Zottd?: string
  Zquantity?: number
  Zunit?: number
  Zcprice?: number
  Zttv?: number
  Zpol?: string
  Zpod?: string
  Zsldate?: string
  Zblno?: string
  Zdays?: string
  ZetaDsPort?: string
  Zcob?: string
  Znotify?: string
  Zlc?: string
  Zoentity?: string
  Zsod?: string
  Zbod?: string
  Zaobf13?: string
  Zaobt13?: string
  Zaobf33?: string
  Zaobt33?: string
  Zremark?: string
  ZblRcpdt?: string
  ZflwSts?: string
  ZpolCtry?: string
  ZpodCtry?: string
  ZogbsStatId?: string
}

/** The composite key identifying one row. */
export type TrdFlowKey = { ZtfNo: string; ZtfSplit: string }

/** Filter state for the list. Empty string means "no filter on this column". */
export type TfFilters = {
  ZtfNo: string
  Zbu: string
  Zcmmd: string
  ZblVsslName: string
}

export const EMPTY_FILTERS: TfFilters = { ZtfNo: '', Zbu: '', Zcmmd: '', ZblVsslName: '' }
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc -p apps/web --noEmit`
Expected: exit 0, no output.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/features/tf-manage/tf-manage.legacy.css apps/web/src/features/tf-manage/types.ts
git commit -m "feat(tf-manage): generate scoped stylesheet and TrdFlow types"
```

---

### Task 2: Field descriptors and row filtering (TDD)

**Files:**
- Create: `apps/web/src/features/tf-manage/fields.ts`
- Test: `apps/web/src/features/tf-manage/fields.test.ts`

**Interfaces:**
- Consumes: `TrdFlowRow`, `TfFilters`, `EMPTY_FILTERS` from Task 1.
- Produces:
  - `type FieldDescriptor = { id: string; label: string; field?: keyof TrdFlowRow; type: 'text' | 'date' | 'number' }`
  - `BASIC_FIELDS`, `SHIPPING_FIELDS`, `PURCH_SALES_FIELDS`, `STATUS_FIELDS`: `readonly FieldDescriptor[]`
  - `filterRows(rows: readonly TrdFlowRow[], filters: TfFilters): TrdFlowRow[]`
  - `subtotal(rows: readonly TrdFlowRow[]): number`
  - `rowKey(row: TrdFlowRow): TrdFlowKey | null`

A descriptor with **no** `field` is one of the legacy inputs that has no SAP source; it renders disabled.

- [ ] **Step 1: Write the failing test**

```ts
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  BASIC_FIELDS,
  SHIPPING_FIELDS,
  STATUS_FIELDS,
  filterRows,
  rowKey,
  subtotal,
} from './fields.ts'
import { EMPTY_FILTERS } from './types.ts'
import type { TrdFlowRow } from './types.ts'

const ROWS: TrdFlowRow[] = [
  { ZtfNo: '0000000001', ZtfSplit: '01', Zbu: 'B01', Zcmmd: 'C106', ZblVsslName: 'ALPHA', Zttv: 1000 },
  { ZtfNo: '0000000002', ZtfSplit: '01', Zbu: 'B02', Zcmmd: 'C108', ZblVsslName: 'BRAVO', Zttv: 250.5 },
  { ZtfNo: '0000000003', ZtfSplit: '02', Zbu: 'B01', Zcmmd: 'C106', ZblVsslName: 'ALPHA TWO' },
]

describe('filterRows', () => {
  it('returns every row when no filter is set', () => {
    strictEqual(filterRows(ROWS, EMPTY_FILTERS).length, 3)
  })

  it('matches a substring case-insensitively', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, ZblVsslName: 'alpha' })
    deepStrictEqual(out.map((r) => r.ZtfNo), ['0000000001', '0000000003'])
  })

  it('ands multiple filters together', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, Zbu: 'B01', Zcmmd: 'C106' })
    strictEqual(out.length, 2)
  })

  it('treats a row missing the filtered field as not matching', () => {
    const out = filterRows(ROWS, { ...EMPTY_FILTERS, ZblVsslName: 'BRAVO' })
    deepStrictEqual(out.map((r) => r.ZtfNo), ['0000000002'])
  })
})

describe('subtotal', () => {
  it('sums Zttv across rows, ignoring rows without it', () => {
    strictEqual(subtotal(ROWS), 1250.5)
  })

  it('is zero for an empty list', () => {
    strictEqual(subtotal([]), 0)
  })
})

describe('rowKey', () => {
  it('builds the composite key', () => {
    deepStrictEqual(rowKey(ROWS[0]!), { ZtfNo: '0000000001', ZtfSplit: '01' })
  })

  it('returns null when either half is missing', () => {
    strictEqual(rowKey({ ZtfNo: '1' }), null)
    strictEqual(rowKey({ ZtfSplit: '01' }), null)
  })
})

describe('field descriptors', () => {
  it('maps the shipping fields the spec lists as live', () => {
    const byId = new Map(SHIPPING_FIELDS.map((f) => [f.id, f.field]))
    strictEqual(byId.get('shVessel'), 'ZblVsslName')
    strictEqual(byId.get('shLoadPort'), 'Zpol')
    strictEqual(byId.get('shPodCountry'), 'ZpodCtry')
    strictEqual(byId.get('shSailingDate'), 'Zsldate')
    strictEqual(byId.get('shLcDetails'), 'Zlc')
  })

  it('leaves the fields with no SAP source unmapped', () => {
    const unmapped = [...BASIC_FIELDS, ...SHIPPING_FIELDS, ...STATUS_FIELDS]
      .filter((f) => f.field === undefined)
      .map((f) => f.id)
    // Enumerated in the spec's honesty note.
    strictEqual(unmapped.includes('bdChild1'), true)
    strictEqual(unmapped.includes('shSustain'), true)
    strictEqual(unmapped.includes('stBlockedAmount'), true)
    strictEqual(unmapped.includes('stCreatedBy'), true)
  })

  it('maps the two status fields that do exist', () => {
    const byId = new Map(STATUS_FIELDS.map((f) => [f.id, f.field]))
    strictEqual(byId.get('stTfStatus'), 'ZflwSts')
    strictEqual(byId.get('stOgbsStatus'), 'ZogbsStatId')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test "apps/web/src/features/tf-manage/fields.test.ts"`
Expected: FAIL — cannot resolve `./fields.ts`.

- [ ] **Step 3: Write `fields.ts`**

```ts
import type { TfFilters, TrdFlowKey, TrdFlowRow } from './types.ts'

/**
 * One control on a tab. `field` is the TrdFlow property it binds to; a descriptor without
 * one is a legacy input that has no SAP source yet — it is rendered disabled rather than
 * dropped, because the generated stylesheet expects the original element structure.
 */
export type FieldDescriptor = {
  id: string
  label: string
  field?: keyof TrdFlowRow
  type: 'text' | 'date' | 'number'
}

export const BASIC_FIELDS: readonly FieldDescriptor[] = [
  { id: 'bdBu', label: 'Business Unit', field: 'Zbu', type: 'text' },
  { id: 'bdBuCode', label: 'BU Code', type: 'text' },
  { id: 'bdGtCommod', label: 'GT Commodity', field: 'Zcmmd', type: 'text' },
  { id: 'bdBuCommodity', label: 'BU Commodity', type: 'text' },
  { id: 'bdChild1', label: 'Child 1', type: 'text' },
  { id: 'bdChild2', label: 'Child 2', type: 'text' },
]

export const SHIPPING_FIELDS: readonly FieldDescriptor[] = [
  { id: 'shVessel', label: 'Vessel Name', field: 'ZblVsslName', type: 'text' },
  { id: 'shBlNumber', label: 'BL Number', field: 'Zblno', type: 'text' },
  { id: 'shSustain', label: 'Sustainability', type: 'text' },
  { id: 'shLoadPort', label: 'Port of Loading', field: 'Zpol', type: 'text' },
  { id: 'shDischargePort', label: 'Port of Destination', field: 'Zpod', type: 'text' },
  { id: 'shTransit', label: 'Number of Days', field: 'Zdays', type: 'text' },
  { id: 'shPolCountry', label: 'POL Country', field: 'ZpolCtry', type: 'text' },
  { id: 'shPodCountry', label: 'POD Country', field: 'ZpodCtry', type: 'text' },
  { id: 'shSailingDate', label: 'Sailing Date', field: 'Zsldate', type: 'date' },
  { id: 'shReceiptDate', label: 'BL Receipt Date', field: 'ZblRcpdt', type: 'date' },
  { id: 'shEta', label: 'ETA at Discharge Port', field: 'ZetaDsPort', type: 'date' },
  { id: 'shNotifyParty', label: 'Notify Party', field: 'Znotify', type: 'text' },
  { id: 'shFromDate', label: 'OGA Title From', field: 'Zotfd', type: 'date' },
  { id: 'shToDate', label: 'OGA Title Till', field: 'Zottd', type: 'date' },
  { id: 'shBlConsignee', label: 'BL Consignee', field: 'Zcob', type: 'text' },
  { id: 'shLcDetails', label: 'LC Details', field: 'Zlc', type: 'text' },
  { id: 'shBl13From', label: 'BL 1/3 From', field: 'Zaobf13', type: 'date' },
  { id: 'shBl13To', label: 'BL 1/3 To', field: 'Zaobt13', type: 'date' },
  { id: 'shBl33From', label: 'BL 3/3 From', field: 'Zaobf33', type: 'date' },
  { id: 'shBl33To', label: 'BL 3/3 To', field: 'Zaobt33', type: 'date' },
]

export const PURCH_SALES_FIELDS: readonly FieldDescriptor[] = [
  { id: 'slContract', label: 'S Contract Number', field: 'ZconNum2', type: 'text' },
  { id: 'slIncoterms', label: 'Sales Incoterms', field: 'Zsalesinc', type: 'text' },
  { id: 'slPayTerms', label: 'Payment Terms - Sales', field: 'Zptss', type: 'text' },
  { id: 'slSellerBank', label: 'Sale Leg Seller Bank', field: 'Zbslsb', type: 'text' },
  { id: 'slBuyerBank', label: 'Sale Leg Buyer Bank', field: 'Zbslbb', type: 'text' },
  { id: 'slBuyerLoc', label: 'Buyer Location', type: 'text' },
]

export const STATUS_FIELDS: readonly FieldDescriptor[] = [
  { id: 'stTfStatus', label: 'TF Status', field: 'ZflwSts', type: 'text' },
  { id: 'stOgbsStatus', label: 'OGBS Status', field: 'ZogbsStatId', type: 'text' },
  { id: 'stOgbsRemarks', label: 'OGBS Remarks', type: 'text' },
  { id: 'stBlockedStatus', label: 'Blocked Status', type: 'text' },
  { id: 'stBlockedAmount', label: 'Blocked Amount', type: 'number' },
  { id: 'stBlockedFrom', label: 'Blocked From', type: 'date' },
  { id: 'stBlockedTo', label: 'Blocked To', type: 'date' },
  { id: 'stBlockedRemarks', label: 'Blocked Remarks', type: 'text' },
  { id: 'stTrader', label: 'Trader', type: 'text' },
  { id: 'stCpmtAmount', label: 'CPMT Amount', type: 'number' },
  { id: 'stDealId', label: 'Deal ID', type: 'text' },
  { id: 'stOttkNo', label: 'OTTK No', type: 'text' },
  { id: 'stDttkNo', label: 'DTTK No', type: 'text' },
  { id: 'stTfExpired', label: 'TF Expired', type: 'text' },
  { id: 'stTfDeleted', label: 'TF Deleted', type: 'text' },
  { id: 'stCreatedBy', label: 'Created By', type: 'text' },
  { id: 'stCreatedDate', label: 'Created Date', type: 'date' },
  { id: 'stCreatedTime', label: 'Created Time', type: 'text' },
  { id: 'stChangedBy', label: 'Changed By', type: 'text' },
  { id: 'stChangedDate', label: 'Changed Date', type: 'date' },
  { id: 'stChangedTime', label: 'Changed Time', type: 'text' },
]

/** Case-insensitive substring match on each non-empty filter; all must match. */
export function filterRows(rows: readonly TrdFlowRow[], filters: TfFilters): TrdFlowRow[] {
  const active = Object.entries(filters).filter(([, value]) => value.trim() !== '')
  if (active.length === 0) return [...rows]
  return rows.filter((row) =>
    active.every(([key, value]) => {
      const cell = row[key as keyof TrdFlowRow]
      if (cell === undefined || cell === null) return false
      return String(cell).toLowerCase().includes(value.trim().toLowerCase())
    }),
  )
}

/** Sums the contract amount. Rows without one contribute nothing rather than NaN. */
export function subtotal(rows: readonly TrdFlowRow[]): number {
  return rows.reduce((sum, row) => sum + (Number.isFinite(row.Zttv) ? Number(row.Zttv) : 0), 0)
}

/** The composite key, or null when the row cannot address itself. */
export function rowKey(row: TrdFlowRow): TrdFlowKey | null {
  if (!row.ZtfNo || !row.ZtfSplit) return null
  return { ZtfNo: row.ZtfNo, ZtfSplit: row.ZtfSplit }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test "apps/web/src/features/tf-manage/fields.test.ts"`
Expected: PASS, all assertions green.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/tf-manage/fields.ts apps/web/src/features/tf-manage/fields.test.ts
git commit -m "feat(tf-manage): field descriptors, row filtering and subtotal"
```

---

### Task 3: API layer

**Files:**
- Create: `apps/web/src/features/tf-manage/api.ts`

**Interfaces:**
- Consumes: `TrdFlowRow`, `TrdFlowKey` from Task 1.
- Produces:
  - `loadTradeFlows(): Promise<TrdFlowRow[]>`
  - `patchTradeFlow(key: TrdFlowKey, changes: Partial<TrdFlowRow>): Promise<void>`
  - `loadCommodities(): Promise<CommodityRow[]>`

- [ ] **Step 1: Write `api.ts`**

```ts
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc -p apps/web --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/features/tf-manage/api.ts
git commit -m "feat(tf-manage): TrdFlow list, commodity lookup and patch"
```

---

### Task 4: The trade flow list

**Files:**
- Create: `apps/web/src/features/tf-manage/TfTable.tsx`

**Interfaces:**
- Consumes: `TrdFlowRow`, `TfFilters` (Task 1); `filterRows`, `subtotal`, `rowKey` (Task 2).
- Produces: `TfTable` — props `{ rows, filters, onFiltersChange, selected, onSelect, showFilters }` where `selected: TrdFlowRow | null` and `onSelect: (row: TrdFlowRow) => void`.

Column order and headers are taken from the legacy `#tfTable` `<thead>`, in the spec's field-mapping table. Mirror the original `<table>` / `<thead>` / `<tbody>` structure and its class names; the generated stylesheet targets them.

- [ ] **Step 1: Write `TfTable.tsx`**

```tsx
import { fmtDate, fmtNum } from '@slc/api-client'
import { filterRows, rowKey, subtotal } from './fields.ts'
import type { TfFilters, TrdFlowRow } from './types.ts'

const COLUMNS: ReadonlyArray<{ label: string; field: keyof TrdFlowRow; kind?: 'date' | 'num' }> = [
  { label: 'Trade Flow ID', field: 'ZtfNo' },
  { label: 'TF Split ID', field: 'ZtfSplit' },
  { label: 'TF Upload Date', field: 'ZtfDate', kind: 'date' },
  { label: 'Business Unit Name', field: 'Zbu' },
  { label: 'Operator', field: 'Zoprtr' },
  { label: 'BL-Vessel Name', field: 'ZblVsslName' },
  { label: 'BU Commodity', field: 'Zcmmd' },
  { label: 'P - Contract Number', field: 'ZconNum1' },
  { label: 'Purchase Incoterms', field: 'ZpurInc' },
  { label: 'Payment terms - Purchase Side', field: 'Zpaypur' },
  { label: 'Banks-Purchase Leg-Seller Bank', field: 'Zbplsb' },
  { label: 'Banks-Purchase Leg-Buyer Bank', field: 'Zbplbb' },
  { label: 'S Contract Number', field: 'ZconNum2' },
  { label: 'Sales Incoterms', field: 'Zsalesinc' },
  { label: 'Payment terms - Sales Side', field: 'Zptss' },
  { label: 'Banks-Sale Leg-Seller Bank', field: 'Zbslsb' },
  { label: 'Banks-Sale Leg-Buyer Bank', field: 'Zbslbb' },
  { label: 'OGA Title From - Date', field: 'Zotfd', kind: 'date' },
  { label: 'OGA Title Till - Date', field: 'Zottd', kind: 'date' },
  { label: 'Quantity', field: 'Zquantity', kind: 'num' },
  { label: 'Contract Price', field: 'Zcprice', kind: 'num' },
  { label: 'CMP (MT)', field: 'Zunit', kind: 'num' },
  { label: 'Contract Amt(USD)', field: 'Zttv', kind: 'num' },
  { label: 'Port of Loading', field: 'Zpol' },
  { label: 'Port of Destination', field: 'Zpod' },
  { label: 'Sailing Date', field: 'Zsldate', kind: 'date' },
  { label: 'BL Number', field: 'Zblno' },
  { label: 'Number of Days', field: 'Zdays' },
  { label: 'ETA at Discharge Port', field: 'ZetaDsPort', kind: 'date' },
]

const FILTER_COLUMNS: ReadonlyArray<{ key: keyof TfFilters; label: string }> = [
  { key: 'ZtfNo', label: 'Trade Flow ID' },
  { key: 'Zbu', label: 'Business Unit' },
  { key: 'Zcmmd', label: 'Commodity' },
  { key: 'ZblVsslName', label: 'Vessel' },
]

function cell(row: TrdFlowRow, col: (typeof COLUMNS)[number]): string {
  const raw = row[col.field]
  if (raw === undefined || raw === null || raw === '') return ''
  if (col.kind === 'date') return fmtDate(String(raw))
  if (col.kind === 'num') return fmtNum(Number(raw))
  return String(raw)
}

export type TfTableProps = {
  rows: readonly TrdFlowRow[]
  filters: TfFilters
  onFiltersChange: (filters: TfFilters) => void
  showFilters: boolean
  selected: TrdFlowRow | null
  onSelect: (row: TrdFlowRow) => void
}

export function TfTable({
  rows,
  filters,
  onFiltersChange,
  showFilters,
  selected,
  onSelect,
}: TfTableProps) {
  const visible = filterRows(rows, filters)
  const selectedKey = selected ? rowKey(selected) : null

  return (
    <>
      {showFilters ? (
        <div className="filter-bar">
          {FILTER_COLUMNS.map((col) => (
            <label key={col.key} className="filter-field">
              {col.label}
              <input
                value={filters[col.key]}
                onChange={(event) =>
                  onFiltersChange({ ...filters, [col.key]: event.target.value })
                }
              />
            </label>
          ))}
        </div>
      ) : null}

      <table id="tfTable">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.field}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody id="tfTableBody">
          {visible.map((row) => {
            const key = rowKey(row)
            const id = key ? `${key.ZtfNo}-${key.ZtfSplit}` : ''
            const isSelected =
              key !== null &&
              selectedKey !== null &&
              key.ZtfNo === selectedKey.ZtfNo &&
              key.ZtfSplit === selectedKey.ZtfSplit
            return (
              <tr
                key={id}
                className={isSelected ? 'selected' : undefined}
                onClick={() => onSelect(row)}
              >
                {COLUMNS.map((col) => (
                  <td key={col.field}>{cell(row, col)}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="tf-subtotal">
        Showing {visible.length} of {rows.length} — Contract Amt subtotal:{' '}
        {fmtNum(subtotal(visible))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc -p apps/web --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/features/tf-manage/TfTable.tsx
git commit -m "feat(tf-manage): trade flow list with filters and subtotal"
```

---

### Task 5: The tab panel component

**Files:**
- Create: `apps/web/src/features/tf-manage/FieldGrid.tsx`

**Interfaces:**
- Consumes: `FieldDescriptor` (Task 2), `TrdFlowRow` (Task 1).
- Produces: `FieldGrid` — props `{ fields, draft, onChange }` where `draft: TrdFlowRow` and `onChange: (field: keyof TrdFlowRow, value: string) => void`.

One component renders all four tabs: they differ only in their descriptor list. A descriptor with no `field` renders a disabled input — the spec requires these stay in the markup so the generated CSS lays the tab out correctly.

- [ ] **Step 1: Write `FieldGrid.tsx`**

```tsx
import type { FieldDescriptor } from './fields.ts'
import type { TrdFlowRow } from './types.ts'

export type FieldGridProps = {
  fields: readonly FieldDescriptor[]
  draft: TrdFlowRow
  onChange: (field: keyof TrdFlowRow, value: string) => void
}

export function FieldGrid({ fields, draft, onChange }: FieldGridProps) {
  const unmapped = fields.some((f) => f.field === undefined)
  return (
    <>
      <div className="field-grid">
        {fields.map((descriptor) => {
          const bound = descriptor.field
          const value = bound ? (draft[bound] ?? '') : ''
          return (
            <div className="field" key={descriptor.id}>
              <label htmlFor={descriptor.id}>{descriptor.label}</label>
              <input
                id={descriptor.id}
                type={descriptor.type === 'date' ? 'date' : 'text'}
                value={String(value)}
                disabled={bound === undefined}
                title={bound === undefined ? 'No SAP source for this field yet' : undefined}
                onChange={(event) => bound && onChange(bound, event.target.value)}
              />
            </div>
          )
        })}
      </div>
      {unmapped ? (
        <p className="field-note">
          Greyed fields have no SAP source yet and are not saved.
        </p>
      ) : null}
    </>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc -p apps/web --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/features/tf-manage/FieldGrid.tsx
git commit -m "feat(tf-manage): tab field grid with unmapped-field handling"
```

---

### Task 6: The screen — list, tabs, save

**Files:**
- Modify: `apps/web/src/features/tf-manage/index.tsx` (replaces the `AppPlaceholder`)

**Interfaces:**
- Consumes: everything from Tasks 1–5, plus `BackButton` from `../../auth/BackButton.tsx` and `SignOutButton` from `../../auth/SignOutButton.tsx`.
- Produces: the default-exported `TfManageApp` that `registry.ts` already imports.

- [ ] **Step 1: Write `index.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { extractMessage } from '@slc/api-client'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { loadTradeFlows, patchTradeFlow } from './api.ts'
import { BASIC_FIELDS, PURCH_SALES_FIELDS, SHIPPING_FIELDS, STATUS_FIELDS, rowKey } from './fields.ts'
import { FieldGrid } from './FieldGrid.tsx'
import { TfTable } from './TfTable.tsx'
import { EMPTY_FILTERS } from './types.ts'
import type { TfFilters, TrdFlowRow } from './types.ts'
import './tf-manage.legacy.css'

const TABS = [
  { id: 'basicData', label: 'Basic Data', fields: BASIC_FIELDS },
  { id: 'shippingData', label: 'Shipping Data', fields: SHIPPING_FIELDS },
  { id: 'purchSalesData', label: 'Purchase / Sales Data', fields: PURCH_SALES_FIELDS },
  { id: 'statusTab', label: 'Status', fields: STATUS_FIELDS },
] as const

/** Built in Stage 2; they announce that rather than rendering a half-working grid. */
const DEFERRED_TABS = [
  { id: 'blData1', label: 'BL Data 1' },
  { id: 'blData2', label: 'BL Data 2' },
] as const

type TabId = (typeof TABS)[number]['id'] | (typeof DEFERRED_TABS)[number]['id']

export default function TfManageApp() {
  const [rows, setRows] = useState<TrdFlowRow[]>([])
  const [filters, setFilters] = useState<TfFilters>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(true)
  const [selected, setSelected] = useState<TrdFlowRow | null>(null)
  const [draft, setDraft] = useState<TrdFlowRow>({})
  const [tab, setTab] = useState<TabId>('basicData')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void refresh()
  }, [])

  async function refresh() {
    setError(undefined)
    setBusy(true)
    try {
      setRows(await loadTradeFlows())
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setBusy(false)
    }
  }

  function select(row: TrdFlowRow) {
    setSelected(row)
    setDraft({ ...row })
    setSaved(false)
  }

  async function save() {
    if (!selected) return
    const key = rowKey(selected)
    if (!key) {
      setError('This row has no Trade Flow ID and split, so it cannot be updated.')
      return
    }
    const active = TABS.find((t) => t.id === tab)
    if (!active) return

    // Only the current tab's mapped fields are sent; an unmapped control has no field.
    const changes: Partial<TrdFlowRow> = {}
    for (const descriptor of active.fields) {
      const field = descriptor.field
      if (!field) continue
      if (draft[field] !== selected[field]) {
        Object.assign(changes, { [field]: draft[field] })
      }
    }
    if (Object.keys(changes).length === 0) {
      setSaved(true)
      return
    }

    setError(undefined)
    setBusy(true)
    try {
      await patchTradeFlow(key, changes)
      // Keep the edited values on screen and fold them into the list.
      const merged = { ...selected, ...changes }
      setSelected(merged)
      setRows((current) =>
        current.map((row) => {
          const candidate = rowKey(row)
          return candidate &&
            candidate.ZtfNo === key.ZtfNo &&
            candidate.ZtfSplit === key.ZtfSplit
            ? merged
            : row
        }),
      )
      setSaved(true)
    } catch (err) {
      // The draft is deliberately left untouched so nothing typed is lost.
      setError(extractMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div className="tfmanage">
      <header className="app-header">
        <div className="header-left">
          <BackButton />
          <h1>Manage Trade Flows</h1>
        </div>
        <div className="header-actions">
          <button type="button" onClick={() => setShowFilters((on) => !on)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button type="button" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear Filters
          </button>
          <button type="button" onClick={() => void refresh()} disabled={busy}>
            Refresh
          </button>
          <SignOutButton />
        </div>
      </header>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <TfTable
        rows={rows}
        filters={filters}
        onFiltersChange={setFilters}
        showFilters={showFilters}
        selected={selected}
        onSelect={select}
      />

      {selected ? (
        <section className="workspace" id="wsTabBar">
          <div className="tab-bar" role="tablist">
            {[...TABS, ...DEFERRED_TABS].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'tab active' : 'tab'}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab ? (
            <div className="tab-panel" id={`tabPanel-${activeTab.id}`}>
              <FieldGrid
                fields={activeTab.fields}
                draft={draft}
                onChange={(field, value) => {
                  setDraft((current) => ({ ...current, [field]: value }))
                  setSaved(false)
                }}
              />
              <div className="tab-actions">
                <button type="button" onClick={() => void save()} disabled={busy}>
                  Update
                </button>
                <button type="button" onClick={() => setDraft({ ...selected })} disabled={busy}>
                  Cancel
                </button>
                {saved ? <span className="saved-note">Saved.</span> : null}
              </div>
            </div>
          ) : (
            <div className="tab-panel" id={`tabPanel-${tab}`}>
              <p>
                This tab is not yet backed by SAP. BL line items, deal assignment and
                compliance have no OData entity, so they are deferred to Stage 2 rather
                than run on placeholder data.
              </p>
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Run the full verification**

Run: `npm run verify`
Expected: typecheck clean, 114+ tests pass, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/features/tf-manage/index.tsx
git commit -m "feat(tf-manage): replace placeholder with live TrdFlow screen"
```

---

### Task 7: Verify against live SAP, then flip the status

**Files:**
- Modify: `config/apps.json` — the `tf-manage` entry

**Interfaces:**
- Consumes: the working screen from Task 6.
- Produces: nothing code-level; this is the gate that lets the launcher stop advertising the app as unconverted.

**This task is blocked until SAP is reachable.** At the time of writing,
`GET /api/tf/TrdFlow` returns `502 Connect Timeout Error` and the host does not answer a
direct TLS connect — almost certainly the VPN. Do not do Step 3 without Step 2 passing.

- [ ] **Step 1: Confirm SAP is reachable**

```bash
curl -sk -o /dev/null -w "%{http_code}\n" https://vhnlqds4ap01.sap.niififl.in:44300/
```

Expected: `404` — the host answers. `000` means still unreachable; stop here.

- [ ] **Step 2: Drive the screen in a browser**

Start the app (`npm run dev`), sign in, open `/apps/tf-manage`, and confirm each of:

1. The list loads rows from SAP and the subtotal is non-zero.
2. Typing in a filter narrows the list; Clear Filters restores it.
3. Selecting a row opens the workspace and populates Basic and Shipping tabs.
4. Editing a Shipping field and pressing Update reports "Saved."
5. Pressing Refresh re-reads from SAP and the edited value is still there.
6. `CMP (MT)` shows the value expected for `Zunit` — the one inferred pairing in the spec.
7. BL Data 1 / 2 show the Stage 2 message.

- [ ] **Step 3: Flip the status**

In `config/apps.json`, in the `tf-manage` entry only:

```json
"status": "ready",
"services": ["tf"],
```

Leave `legacy` and `legacyPort` as they are.

- [ ] **Step 4: Re-verify and commit**

```bash
npm run verify
git add config/apps.json
git commit -m "feat(tf-manage): mark ready after live SAP verification"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Generated scoped stylesheet | 1 |
| `TrdFlowRow` types | 1 |
| Field mapping incl. unmapped fields | 2 |
| List columns, filters, subtotal | 2 (logic), 4 (render) |
| `GET TrdFlow` / `ChComm` / `PATCH` | 3 |
| Four live tabs | 5, 6 |
| Stage 2 tabs deferred with a message | 6 |
| Error handling: list, patch, lookup | 3, 6 |
| `fields.test.ts` under `node --test` | 2 |
| `BackButton` / `SignOutButton` placement | 6 |
| Menu wiring — status flip | 7 |
| Live verification before `ready` | 7 |

No gaps.

**Placeholder scan:** none — every step carries its actual content. The one "confirm against live data" item (`CMP (MT)` → `Zunit`) is a spec-level known unknown with an explicit verification step (Task 7, Step 2.6), not an unwritten instruction.

**Type consistency:** `TrdFlowRow`, `TrdFlowKey`, `TfFilters`, `EMPTY_FILTERS` defined in Task 1 and used unchanged in 2–6. `FieldDescriptor` defined in Task 2, consumed in 5. `rowKey`/`filterRows`/`subtotal` defined in Task 2, used in 4 and 6. `loadTradeFlows`/`patchTradeFlow` defined in Task 3, used in 6. `FieldGrid` props defined in Task 5, matched at the call site in Task 6.

**One deviation to flag at execution time:** the plan uses `fmtDate`, `fmtNum`, `extractMessage`, `entityPath`, `list`, `apiFetch` and `service` from `@slc/api-client`. All are confirmed exports of `packages/api-client/src/index.ts`. If `fmtDate` does not accept an OData date string as-is, adjust in Task 4 rather than widening the API client.
