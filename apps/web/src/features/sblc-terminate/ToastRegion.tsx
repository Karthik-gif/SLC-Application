import type { Toast } from './types.ts'

export type ToastRegionProps = {
  toasts: Toast[]
}

const TITLES: Record<Toast['kind'], string> = {
  success: 'Success',
  warning: 'Warning',
  '': 'Information',
}

/** Toasts self-dismiss after ~4.2s, same as the legacy page's window.setTimeout. */
export function ToastRegion({ toasts }: ToastRegionProps) {
  return (
    <div id="toastRegion" className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={'toast ' + toast.kind}>
          <div className="toast-icon">{toast.kind === 'success' ? 'OK' : 'i'}</div>
          <div>
            <div className="toast-title">{TITLES[toast.kind]}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
