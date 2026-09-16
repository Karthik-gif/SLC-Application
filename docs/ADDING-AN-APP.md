# Adding or converting an application

## Add a backend

Add an entry to `config/services.json`. No code changes.

```json
"quotes": {
  "kind": "rest",
  "base": "https://api.example.internal/v1",
  "auth": "quotes-token"
}
```

`kind` is `odata`, `dyngw` or `rest`. Anything needing credentials references an entry in
the `auth` block, which names an **environment variable** — never a secret in the file.
Restart the gateway; `GET /health` shows whether each backend resolved.

## Add an application

Three edits, no changes to the shell.

1. **`config/apps.json`** — add an entry. `code` must match the tile's `code` in
   `config/menu.json`; that is how the launcher resolves a tile to a route.

   ```json
   { "code": "quotes-console", "id": "quotes", "route": "/apps/quotes",
     "title": "Quotes", "status": "scaffold", "services": ["quotes"] }
   ```

   `status` is `ready`, `scaffold`, or `planned`. A `planned` tile tells the user it is not
   built rather than opening an empty screen.

2. **`apps/web/src/features/<id>/index.tsx`** — a default-exported component.

3. **`apps/web/src/features/registry.ts`** — one line. The import path must be a literal
   string so Vite can split the app into its own chunk.

If the application should appear in the launcher, add its tile to `config/menu.json` too.

## Converting a legacy page

The originals are in `legacy/`. Work through one app at a time.

**Keep the original look exactly.** Generate the stylesheet, do not write one:

```bash
node tools/scope-css.mjs "legacy/OTTK.html" ".ottk" "apps/web/src/features/ottk/ottk.legacy.css"
```

Then mirror the original markup element for element and class for class, and wrap it in
`<div className="ottk">`. The generated CSS is that page's own, so any structural change —
a different wrapper, a generic table component, a `<span>` where the original had an
`<input readonly>` — changes how it looks. Screenshot the original (see below) and compare.

**Do not use `@slc/ui` in a converted app.** Those components are for new screens; their
markup differs from the legacy pages. Reach for `@slc/api-client` freely — it is behaviour,
not appearance.

**Replace, don't translate.** `getElementById` + `innerHTML` becomes state and JSX, not
`useRef` and `dangerouslySetInnerHTML`. Across the seven pages there are 657
`getElementById` calls, 126 `addEventListener`, 97 click handlers and 63 `innerHTML` — all
of it goes.

**Leave the socket workaround behind.** `runLimited(tasks, 3)` in the legacy pages worked
around HTTP/1.0 socket exhaustion that no longer exists. Load lookups with plain
`Promise.all` unless the fan-out is genuinely large.

**Don't port `esc()`.** React escapes interpolated values.

**Add the header controls.** `<BackButton />` goes first in the header's left group,
`<SignOutButton />` last in its action group. Neither carries styling of its own — they
borrow the host page's button class, so pass `className` when the page does not use `.btn`
(the menu passes `path-switch`). Their icons set their own width and height, because not
every legacy stylesheet has a `.btn svg` rule; where one exists it still wins.

Back uses real history rather than a link to the menu, so opening DTTK from an OTTK ticket
number and pressing Back returns to OTTK. It falls back to the menu only when this route is
the first page the tab visited — a deep link, a refresh, or a fresh sign-in — since there is
then no in-app page behind it.

The legacy pages had neither control, so there is no original to match for either.

**Pull shared behaviour up, not shared styling.** Amount parsing and OData helpers belong in
`@slc/api-client`. Colours and layout stay in the app's own generated stylesheet.

**Markup may be shared when the originals agree.** `apps/web/src/shared/` holds the ticket
panel, the charges grid and the fee calculation, because the OTTK and DTTK originals carry
them identically — the components emit class names only, and each app's scoped stylesheet
does the styling. Share a component there only after checking both originals match; Deal ID
has its own panel precisely because its original differs.

Set `status` to `ready` in `config/apps.json` once the app works against its real backends.

### Two apps need a decision first

`Manage TF` and `Invoice` have **never** called an API. `Invoice` reads a global `FTI_DEALS`
that nothing defines and falls back to `DUMMY.deals`; `Manage TF` runs on
`DUMMY_MASTER_DATA`. Their SAP contract does not exist yet, so converting them means
designing that contract — not porting one. Decide what they talk to before starting.

## Running against a stub backend

Converting without SAP credentials, or wanting a repeatable dataset, is what
`SLC_SERVICES_CONFIG` is for: point it at a registry whose `base` URLs are a local stub and
the real gateway runs unchanged against it.

```bash
SLC_SERVICES_CONFIG=/path/to/services.mock.json npm start
```

`packages/gateway/src/proxy.integration.test.ts` does exactly this in-process, and is the
place to add a case whenever proxy behaviour changes.

## Verify

```bash
npm run verify     # typecheck + test + build
```
