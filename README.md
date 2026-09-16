# SLC Application

An API- and OData-driven application platform. One Node gateway fronts every backend — SAP
OData services, the SAP dynamic gateway, and non-SAP REST APIs — and one React SPA hosts
every application behind a sign-in page and a launcher.

```
browser ──▶ React SPA (one origin)
                │  /api/<service>/*
                ▼
            Node gateway ──┬─▶ odata  ZFS_SB_*_O4_API          (one service per object)
                           ├─▶ dyngw  ZFS_SB_DYNGW_O4_API      (Registry-brokered)
                           └─▶ rest   non-SAP JSON APIs
```

The gateway injects credentials and the SAP CSRF token, so the browser never holds either,
and everything is same-origin by construction — no CORS configuration on the SAP Gateway.

## Quick start

```bash
npm ci
cp .env.example .env      # then fill in SAP_DS4_100_NIIF_PASSWORD
npm run dev               # gateway on :8080, Vite on :5173 — open :5173
```

Sign in with `DEMO_USER` / `DEMO_PASSWORD` (`demo` / `demo` by default).

Without a SAP password the gateway still starts: it logs each unusable backend and answers
calls to them with `503` naming the missing variable, so sign-in, the launcher and any app
that does not need SAP all work.

For a production-shaped run: `npm run build && npm start`, then open `:8080` — the gateway
serves the built SPA itself.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Gateway + Vite with hot reload |
| `npm run build` | Builds the SPA to `apps/web/dist` |
| `npm start` | Gateway only, serving the built SPA |
| `npm test` | Unit tests (`node --test`) |
| `npm run typecheck` | `tsc` over every package |
| `npm run verify` | typecheck + test + build |

## Layout

```
config/
  services.json     backend registry — odata | dyngw | rest
  apps.json         application registry — tile code -> route, status, backends
  menu.json         launcher tree, extracted verbatim from the legacy Menu Path.html
packages/
  gateway/          Node + Fastify: registry, auth, CSRF, proxy, static hosting
  api-client/       shared client — apiFetch, OData helpers, React hooks
  ui/               design tokens and shared React components
apps/web/           the SPA: login, launcher, and one lazy route per application
legacy/             the original single-file HTML apps, kept as the conversion reference
```

## Status

The framework is complete and verified end to end. The six applications are **scaffolded,
not converted** — each has a route, a shell and a page stating what remains. Their logic
still lives in `legacy/`.

| Application | Route | Backends | Legacy source |
|---|---|---|---|
| Origination Ticket (OTTK) | `/apps/ottk` | `ottk`, `dttk` | `legacy/OTTK.html` |
| Distribution Ticket (DTTK) | `/apps/dttk` | `dttk`, `ottk` | `legacy/DTTK.html` |
| Deal ID Creation | `/apps/deal-id` | `dealid`, `ottk`, `dttk` | `legacy/Deal ID.html` |
| Trade Flow Upload | `/apps/tf-upload` | `tf` | `legacy/Uplaod TF.html` |
| Manage Trade Flows | `/apps/tf-manage` | none yet | `legacy/Manage TF.html` |
| Amend BLs & Finalise Invoices | `/apps/invoice` | none yet | `legacy/Invoice.html` |

The last two have never called an API — they run on hard-coded dummy data, so their SAP
contract is still undefined.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it works and why, and
[docs/ADDING-AN-APP.md](docs/ADDING-AN-APP.md) for the steps to add or convert one.
