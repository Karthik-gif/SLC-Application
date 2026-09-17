import type { Company } from './types.ts'

export type CompanyModalProps = {
  open: boolean
  companies: Company[]
  selection: number
  onSelectRow: (index: number) => void
  onConfirmRow: (index: number) => void
  onClose: () => void
  onConfirm: () => void
}

export function CompanyModal({ open, companies, selection, onSelectRow, onConfirmRow, onClose, onConfirm }: CompanyModalProps) {
  return (
    <div id="companyModal" className={'modal-bg' + (open ? ' open' : '')}>
      <div className="modal company">
        <div className="modal-head">
          <div id="companyModalTitle" className="modal-title">
            Company Code - {companies.length} Entries
          </div>
          <button id="companyClose" className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="company-scroll">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Comp. Code</th>
                  <th>Company Name</th>
                  <th>City</th>
                  <th>Currency</th>
                </tr>
              </thead>
              <tbody id="companyBody">
                {companies.map((c, i) => (
                  <tr
                    key={c.code}
                    className={i === selection ? 'selected' : ''}
                    onClick={() => onSelectRow(i)}
                    onDoubleClick={() => onConfirmRow(i)}
                  >
                    <td>{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.city}</td>
                    <td>{c.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-foot">
          <button id="companyCancel" className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button id="companySelect" className="btn btn-primary" type="button" disabled={selection < 0} onClick={onConfirm}>
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
