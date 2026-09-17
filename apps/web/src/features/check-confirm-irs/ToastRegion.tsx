export type Toast = { id: number; message: string }

export function ToastRegion({ toasts }: { toasts: Toast[] }) {
  return (
    <div id="toastRegion" className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id}>
          <div className="toast-icon">OK</div>
          <div>
            <div className="toast-title">Success</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
