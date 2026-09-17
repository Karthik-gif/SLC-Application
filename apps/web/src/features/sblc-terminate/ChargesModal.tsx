export type ChargesModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ChargesModal({ open, onClose, onConfirm }: ChargesModalProps) {
  return (
    <div id="chargesModal" className={'modal-bg' + (open ? ' open' : '')}>
      <div className="modal confirm">
        <div className="modal-head">
          <div className="modal-title">SBLC: Initiate Termination</div>
          <button id="chargesClose" className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-message">
            <div className="confirm-mark">?</div>
            <div>Charges not updated. Do you want to continue?</div>
          </div>
        </div>
        <div className="modal-foot">
          <button id="chargesCancel" className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button id="chargesNo" className="btn btn-ghost" type="button" onClick={onClose}>
            No
          </button>
          <button id="chargesYes" className="btn btn-primary" type="button" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}
