import type { Toast as ToastModel } from './types.ts'

type ToastRegionProps = {
  toasts: readonly ToastModel[]
}

/** Success/info banners that fade themselves out — index.tsx removes each after 4.2s. */
export function ToastRegion({ toasts }: ToastRegionProps) {
  return (
    <div id="toastRegion" className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id}>
          <div className="toast-icon">{toast.icon}</div>
          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
