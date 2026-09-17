import { apiFetch } from '@slc/api-client'
import { useAsync } from '@slc/api-client/react'
import { ProfilePanel } from './admin/ProfilePanel.tsx'

/**
 * Admin: the signed-in user's own account.
 *
 * This is deliberately an account page rather than a system console. An earlier version
 * listed the application registry, the SAP backends and gateway uptime — accurate, but
 * plumbing that the people using a trade-finance application have no use for.
 */

type MeResponse = { user: { username: string; displayName: string }; mode: string }

export function AdminView() {
  const me = useAsync<MeResponse>(() => apiFetch<MeResponse>('/auth/me'), [])

  return (
    <>
      <div className="hub-title">Admin</div>
      <div className="hub-sub">Your account and sign-in details.</div>

      {me.error ? (
        <div className="mp-stub">Could not read your account: {me.error.message}</div>
      ) : me.loading || !me.data ? (
        <div className="mp-stub">Reading your account…</div>
      ) : (
        <ProfilePanel
          profile={{
            username: me.data.user.username,
            displayName: me.data.user.displayName,
            mode: me.data.mode,
          }}
        />
      )}
    </>
  )
}
