/**
 * What the Admin page renders.
 *
 * AdminView owns the fetch and passes the result down, so the panels are presentational.
 *
 * The shape is deliberately thin because the gateway's session is thin: GET /auth/me returns
 * a username, a display name and the auth mode, and nothing else. Under demo auth the
 * display name is simply set to the username (see packages/gateway/src/routes/auth.ts), so
 * do not add fields here — role, email, department, last sign-in — that the backend cannot
 * answer. They arrive when SAP-backed auth replaces demo, and inventing them now would put
 * fiction on an account page.
 */
export type ProfileInfo = {
  username: string
  displayName: string
  /** Auth mode the gateway reports, e.g. 'demo'. */
  mode: string
}
