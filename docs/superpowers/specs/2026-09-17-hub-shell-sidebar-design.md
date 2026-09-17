# SLC hub shell — collapsible left navigation

Date: 2026-09-17
Status: approved, not yet implemented
Affects: `apps/web/src/menu/` and `apps/web/src/App.tsx`
Legacy source: none — the sidebar does not exist in `legacy/Menu Path.html`

## What this changes

`MenuPage.tsx` is today a single component: header, tile/folder browser, toast. It becomes a
shell with a collapsible left navigation and five sections. The tile browser is one of those
five; the other four are new.

Sidebar order is the order they were asked for, top to bottom:

| # | Section       | Route          | Content                                               |
| - | ------------- | -------------- | ----------------------------------------------------- |
| 1 | Master Data   | `/master-data` | Dummy tiles, no behaviour behind them                 |
| 2 | Overview      | `/overview`    | KPI cards, charts, recent activity — static mock data |
| 3 | Functionality | `/`            | Today's tile/folder browser, moved verbatim           |
| 4 | Reporting     | `/reporting`   | Stub                                                  |
| 5 | Admin         | `/admin`       | Stub                                                  |

## Decisions

**`/` stays Functionality.** Every converted app's Back button and `navigate('/')` already
mean "the tile browser". Making `/` something else would silently change where ~20 screens
return to. So Functionality keeps `/` even though it sits third in the sidebar, and the other
four sections get named routes.

**Real routes, not local state.** Five explicit routes in `App.tsx`, each rendering
`<MenuPage section="…" />`. Deep-linkable and browser Back works. The folder drill-down
inside Functionality stays in `useState`, exactly as it is now.

**Static mock data.** Overview's figures live in `mock/overview.ts` behind a header comment
saying so. No gateway call, no `config/services.json` key. Swapping in a live feed later is a
change to that one module.

**Inline SVG charts, no dependency.** The monorepo has no chart library and this does not add
one. Bar, donut, line and sparkline are small enough to hand-roll, and drawing them with the
existing `--blue-*` custom properties keeps them matched to the page without theming work.

## The generated stylesheet stays generated

`menu-path.css` carries the same warning every converted app's stylesheet does: it is output
from `tools/scope-css.mjs` and must not be hand-edited. All new styling goes in a new
`menu-shell.css`. The two declarations that the shell has to override live in
`menu-path.overrides.css`, which exists for exactly this and already documents its deviations.

The overrides:

- `.mp` becomes a flex column and stops being the scroll container. `.mp main` scrolls
  instead. The `::-webkit-scrollbar` rules scoped under `.mp` still reach it, so the blue
  scrollbar the existing override was written to preserve is preserved.
- `.mp main {width:75%}` is dropped. That 75% left a quarter of the viewport empty on the
  right; with a sidebar taking space on the left it would squeeze the tile grid. Main takes
  the remaining width and keeps its `max-width:1700px`, so on wide screens the content area
  is unchanged and on narrow ones it gains room.

## File layout

```
apps/web/src/menu/
  MenuPage.tsx              shell: header, Sidebar, active section, toast
  Sidebar.tsx               nav items, collapse toggle, persistence
  Tile.tsx                  extracted from MenuPage unchanged
  sections/
    FunctionalityView.tsx   today's browser: home grid + folder detail + launch
    OverviewView.tsx
    MasterDataView.tsx
    ReportingView.tsx
    AdminView.tsx
  charts/
    Charts.tsx              BarChart, DonutChart, LineChart, Sparkline
    geometry.ts             pure scale / arc / polyline math
    geometry.test.ts
  mock/
    overview.ts             KPI figures, series, activity rows
    master-data.ts          dummy tile definitions
  menu-shell.css            new
  menu-path.css             untouched
  menu-path.overrides.css   + the two overrides above
  types.ts                  unchanged
```

`MenuPage` keeps ownership of the menu/registry fetches, the toast and `launch()`, and passes
what Functionality needs down as props. Nothing else fetches.

## Sidebar

Sits below the 52px header, full height, white on `--border`. Items are a 20px SVG icon plus
a label, in the same visual language as the tile icons. The active item takes a `--blue-pale`
fill, a 3px `--blue-dark` left accent bar and `--blue-dark` text.

**Collapse.** A toggle at the foot of the sidebar, above a `border-top` separator, flips it
between 224px expanded and 64px collapsed. Collapsed: labels hidden, icons centred, the
active accent bar still visible, and each item carries a `title` so the label is recoverable
on hover. The chevron points left when expanded and right when collapsed. Width transitions
at `0.18s ease` — the timing the tiles already use.

**Persistence.** The choice is stored in `localStorage` under `slc.hub.sidebar` as
`expanded` | `collapsed`, and read during the `useState` initialiser rather than in an
effect, so a collapsed sidebar does not render expanded for one frame and then snap. A read
that throws — Safari private mode, blocked site data — falls back to expanded.

**Narrow screens.** Below 900px the sidebar becomes a horizontally scrollable strip above the
content and the collapse toggle is hidden; the stored state is left alone, so widening the
window restores whichever state was chosen. No hamburger and no overlay — five items fit in a
strip, and an overlay would be more machinery than the content warrants.

## Section content

**Overview.** Five KPI cards — Active Trade Flows, Open ICLs, LCs Outstanding, Total
Exposure, Limit Utilisation — each with a label, a value, a period-over-period delta with
direction, and a sparkline. Then exposure by product as horizontal bars, deal status split as
a donut, twelve months of volume as a line, and a six-row recent-activity table. Deltas are
coloured by direction, never by colour alone: each carries an arrow glyph.

**Master Data.** Roughly twelve tiles across three `.group-label` sections — Counterparties,
Instruments, Configuration — rendered with the same `<Tile>` as the hub. Clicking one fires
the launcher's existing "not set up yet" toast rather than navigating. These are placeholders
for a real master-data area and the mock module says so.

**Functionality.** Today's markup and behaviour, moved without edits. The generated
stylesheet makes structural drift a visual regression, so this is a move, not a rewrite.

**Reporting, Admin.** `hub-title`, `hub-sub` and a single card naming what will live there.
Not built half-working.

## Charts

`geometry.ts` holds the arithmetic and returns plain numbers and path strings:

- `scaleLinear(domain, range)` → value → pixel
- `donutArc(startFraction, endFraction, radius, thickness)` → SVG path `d`
- `polylinePoints(values, width, height)` → `x,y` pairs for a line or sparkline
- `niceTicks(max, count)` → axis values

`Charts.tsx` is presentational: it takes data and geometry output and emits SVG. Charts use
`viewBox` with no fixed pixel size so they scale with their container, and every chart has a
`<title>` for screen readers.

## Error handling

The existing menu and registry `useAsync` paths are untouched. Mock data is a static import
and cannot fail. The only new failure is the `localStorage` read, handled above.

## Testing

`charts/geometry.test.ts` under `node --test`, matching `tf-manage/dates.test.ts`. It covers
the pure math: linear scaling including a zero-width domain, donut arcs including a single
100% segment and the large-arc flag crossing half a turn, polyline points for flat and
single-value series, and tick generation.

The rest is appearance and is verified in the browser: `npm run dev` from the root so the
gateway serves `config/menu.json`, sign in, then walk all five sections expanded and
collapsed, confirm the collapse choice survives a reload, check the strip below 900px, and
confirm Functionality's tile grid, folder drill-down and app launch are unchanged.

Then `npm run verify` (typecheck, tests, build).

## Out of scope

- The sidebar inside feature screens. Each converted app's scoped stylesheet assumes it owns
  the viewport; putting the shell around them is its own piece of work.
- Real data behind Overview, Reporting or Admin.
- Anything in `legacy/Menu Path.html`. It stays the historical original.
