# Manage Trade Flows — React conversion (Stage 1)

Date: 2026-09-16
Status: approved, not yet implemented
Legacy source: `legacy/Manage TF.html` (2,752 lines, legacy port 8770)
Route: `/apps/tf-manage` — already registered, currently an `AppPlaceholder`

## Why this needs a design rather than a straight port

`docs/ADDING-AN-APP.md` singles out two pages:

> `Manage TF` and `Invoice` have **never** called an API. […] Their SAP contract does not
> exist yet, so converting them means designing that contract — not porting one. Decide what
> they talk to before starting.

The legacy page runs entirely on a client-side `DUMMY_MASTER_DATA` literal (commodities, TF
types, deal structures, 17 deal statuses, incoterms). There is no legacy API usage to port.

## Decision

**Hybrid.** Wire the part of the screen that maps onto an entity that already exists and is
already proven; do not invent contracts for the part that does not.

`TrdFlow(ZtfNo, ZtfSplit)` is exercised today by `tf-upload`, whose `TF_FIELD_MAP` is the
45-field source of truth for the entity. The Manage TF list columns map onto it 1:1 — the
legacy table *is* `TrdFlow`.

**Staged.** Stage 1 delivers the live-wired half and is reviewable on its own. Stage 2 (a
separate spec) adds the half with no backend.

## Stage 1 scope

In:

- TF list — columns, filters, clear-filters, refresh, subtotal
- Basic Data tab
- Shipping Data tab
- Purchase / Sales Data tab
- Status tab (see the honesty note below)
- `BackButton` / `SignOutButton` header controls

Out, deferred to Stage 2:

- BL Data 1 / BL Data 2 tabs, BL grid pagination, insert/delete row, split
- Assign Deal modal (target amount, balance-to-assign arithmetic)
- Compliance modal and its exception path
- BL PDF upload

Stage 2 tabs render a short "not yet backed by SAP" panel. They are not built half-working.

## Conversion rules (from `docs/ADDING-AN-APP.md`)

- Generate the stylesheet, never hand-write it:
  `node tools/scope-css.mjs "legacy/Manage TF.html" ".tfmanage" "apps/web/src/features/tf-manage/tf-manage.legacy.css"`
- Mirror the original markup element for element, class for class, wrapped in
  `<div className="tfmanage">`. Structural drift changes the appearance, because the
  generated CSS is that page's own.
- **No `@slc/ui`** — those components are for new screens and their markup differs.
  `@slc/api-client` is behaviour, not appearance, and is used freely.
- `getElementById` + `innerHTML` becomes state and JSX — not `useRef` and
  `dangerouslySetInnerHTML`.
- Do not port `esc()`; React escapes interpolated values.
- Do not port `runLimited(tasks, 3)`; load lookups with plain `Promise.all`.

## File layout

```
apps/web/src/features/tf-manage/
  index.tsx              list + workspace shell, tab routing
  types.ts               TrdFlow row and per-tab view models
  api.ts                 loadTradeFlows, loadTradeFlow, patchTradeFlow
  fields.ts              legacy field id <-> TrdFlow field mapping
  fields.test.ts         pure mapping + coercion tests (node --test)
  TfTable.tsx            list, filters, subtotal
  BasicDataTab.tsx
  ShippingDataTab.tsx
  PurchSalesTab.tsx
  StatusTab.tsx
  masterData.ts          quarantined DUMMY_MASTER_DATA
  tf-manage.legacy.css   generated — do not hand-edit
```

## Data flow

| Action | Call |
|---|---|
| Load list | `GET /api/tf/TrdFlow` |
| Commodity lookup | `GET /api/tf/ChComm` |
| Save a tab | `PATCH /api/tf/TrdFlow(ZtfNo='…',ZtfSplit='…')` |

`GET /api/tf/TrdFlow` was confirmed `200` against live SAP on 2026-09-16.

Key construction and zero-padding are reused from `tf-upload/api.ts`, which already encodes
this entity's key correctly. `TF_FIELD_MAP` is imported from `tf-upload/fields.ts` rather
than redeclared — one source of truth per entity.

Selecting a list row hydrates the tabs from that row; no per-row round trip is needed,
because the list projection and the detail fields come from the same entity.

## Field mapping

List columns follow `TF_FIELD_MAP` order:

| Legacy column | Field |
|---|---|
| Trade Flow ID / TF Split ID | `ZtfNo` / `ZtfSplit` |
| TF Upload Date | `ZtfDate` |
| Business Unit Name | `Zbu` |
| Operator | `Zoprtr` |
| BL-Vessel Name | `ZblVsslName` |
| BU Commodity | `Zcmmd` |
| P/S Contract Number | `ZconNum1` / `ZconNum2` |
| Purchase / Sales Incoterms | `ZpurInc` / `Zsalesinc` |
| Payment terms purchase / sales | `Zpaypur` / `Zptss` |
| Purchase leg seller / buyer bank | `Zbplsb` / `Zbplbb` |
| Sales leg seller / buyer bank | `Zbslsb` / `Zbslbb` |
| OGA Title From / Till | `Zotfd` / `Zottd` |
| Quantity | `Zquantity` |
| Contract Price | `Zcprice` |
| CMP (MT) | `Zunit` |
| Contract Amt (USD) | `Zttv` |
| Port of Loading / Destination | `Zpol` / `Zpod` |
| Sailing Date | `Zsldate` |
| BL Number | `Zblno` |
| Number of Days | `Zdays` |
| ETA at Discharge Port | `ZetaDsPort` |

Shipping tab adds `ZblRcpdt`, `Znotify`, `Zlc`, `Zcob`, `ZpolCtry`, `ZpodCtry`,
`Zaobf13`/`Zaobt13`, `Zaobf33`/`Zaobt33`.

Note that `TF_FIELD_MAP` order is the *upload template's* column order
(`Zquantity, Zunit, Zcprice, Zttv`), which is not the Manage TF display order above. The
mapping is by meaning, not by position — this list must not be derived from the map index.
The one pairing to confirm against live data is `CMP (MT)` → `Zunit`, inferred from the
label and the field's numeric type.

## Honesty note: the Status tab is only partly live

This refines the approved design, which said the four tabs map to real fields. Extracting
the legacy field ids shows the Status tab mostly does not:

Live (`TrdFlow`): `stTfStatus` → `ZflwSts`, `stOgbsStatus` → `ZogbsStatId`.

No TrdFlow counterpart: `stOgbsRemarks`, `stBlockedStatus`, `stBlockedAmount`,
`stBlockedFrom`, `stBlockedTo`, `stBlockedRemarks`, `stTrader`, `stCpmtAmount`, `stDealId`,
`stOttkNo`, `stDttkNo`, `stTfExpired`, `stTfDeleted`, and all six created/changed audit
fields.

A handful in the other tabs are also unmapped: `bdBuCode`, `bdBuCommodity`, `bdChild1`,
`bdChild2`, `shSustain`, `slBuyerLoc`.

These render disabled and visibly empty, with the tab carrying one line saying the fields
have no SAP source yet. They are not faked from master data and not quietly dropped from the
markup — dropping them would change the layout the generated CSS expects.

## Error handling

- List load failure: message shown in-page, table left empty. No silent catch.
- PATCH failure: edits stay on screen with the message, so nothing typed is lost.
- Commodity lookup failure: degrades to an empty list, matching `tf-upload`, because the
  enrichment is optional and must not block the screen.

## Testing

- `fields.test.ts` — mapping, date coercion and number coercion as pure functions under
  `node --test`, mirroring `tf-upload/fields.test.ts`.
- `npm run verify` (typecheck + test + build) must pass.
- Browser drive: load the list, select a row, edit a field on each live tab, save, refresh,
  confirm the value persisted.

## Menu wiring

Already in place and needs no new plumbing:

- `config/menu.json` — tile `tf-manage-console` exists
- `config/apps.json` — entry exists, `route: /apps/tf-manage`
- `apps/web/src/features/registry.ts` — lazy import exists

The only edits: `status` `"scaffold"` → `"ready"`, and `services: []` → `["tf"]`. Per
`ADDING-AN-APP.md`, `ready` is set only once the app works against its real backends — so
this flip happens after the browser verification below, not before.

## Blocked on

SAP is currently unreachable from this machine: `GET /api/tf/TrdFlow` returns
`502 Connect Timeout Error (vhnlqds4ap01.sap.niififl.in:44300)`, and the host does not
respond to a direct TLS connect either. Almost certainly the VPN.

Stage 1 can be built, typechecked and unit-tested without it. It **cannot** be verified
against live data, and `status` must stay `scaffold` until it has been. Verification is the
last step of the plan, not an assumption.
