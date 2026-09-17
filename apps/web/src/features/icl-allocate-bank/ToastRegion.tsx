import type { ToastItem } from './types.ts'

export type ToastRegionProps = {
  toasts: readonly ToastItem[]
}

/** The original's `toast()` builder, reproduced as markup instead of appended DOM nodes. */
export function ToastRegion({ toasts }: ToastRegionProps) {
  return (
    <div className="toast-region" aria-live="polite">
      {toasts.map((item) => {
        const title = item.kind === 'success' ? 'Success' : item.kind === 'warning' ? 'Warning' : 'Information'
        return (
          <div key={item.id} className={`toast ${item.kind}`}>
            <div className="toast-icon">{item.kind === 'success' ? 'OK' : 'i'}</div>
            <div>
              <div className="toast-title">{title}</div>
              <div className="toast-message">{item.message}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
