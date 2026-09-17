export type RejectModalProps = {
  open: boolean
  requestNo: string
  onCancel: () => void
  onConfirm: () => void
}

/** The single-row reject confirmation. */
export function RejectModal({ open, requestNo, onCancel, onConfirm }: RejectModalProps) {
  return (
    <div className={open ? 'modal-bg open' : 'modal-bg'}>
      <div className="modal small">
        <div className="modal-head">
          <div className="modal-title">Reject ICL Request</div>
          <button className="modal-close" type="button" onClick={onCancel}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="warning-box">Are you sure you want to reject ICL Request {requestNo}?</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            No
          </button>
          <button className="btn btn-danger" type="button" onClick={onConfirm}>
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  )
}
