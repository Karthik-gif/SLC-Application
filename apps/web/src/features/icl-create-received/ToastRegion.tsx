export type ToastKind = 'success' | 'warning' | 'info'

export type ToastItem = {
  id: number
  message: string
  kind: ToastKind
}

const TITLES: Record<ToastKind, string> = {
  success: 'Success',
  warning: 'Warning',
  info: 'Information',
}

/** Transient notifications (`#toastRegion` in the original). Each clears itself after ~4.2s. */
export function ToastRegion({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div id="toastRegion" className="toast-region" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={'toast ' + t.kind}>
          <div className="toast-icon">{t.kind === 'success' ? 'OK' : 'i'}</div>
          <div>
            <div className="toast-title">{TITLES[t.kind]}</div>
            <div className="toast-message">{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
