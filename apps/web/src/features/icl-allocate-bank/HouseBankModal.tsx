import type { BankAccount } from './types.ts'

export type HouseBankModalProps = {
  open: boolean
  rows: readonly BankAccount[]
  search: string
  onSearchChange: (value: string) => void
  picked: string
  onPick: (houseBank: string) => void
  onPickConfirm: () => void
  onPickAndConfirm: (houseBank: string) => void
  onClose: () => void
}

/** The House Bank lookup dialog opened from the bank allocation modal. */
export function HouseBankModal({
  open,
  rows,
  search,
  onSearchChange,
  picked,
  onPick,
  onPickConfirm,
  onPickAndConfirm,
  onClose,
}: HouseBankModalProps) {
  const q = search.toLowerCase()
  const filtered = q ? rows.filter((row) => JSON.stringify(row).toLowerCase().indexOf(q) >= 0) : rows

  return (
    <div className={open ? 'modal-bg open' : 'modal-bg'}>
      <div className="modal lookup-small house">
        <div className="modal-head">
          <div className="modal-title">House Bank</div>
          <button className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Search house bank"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
          <div className="table-wrap" style={{ maxHeight: 300 }}>
            <table className="lookup-table house-table">
              <thead>
                <tr>
                  <th>CoCd</th>
                  <th>House Bk</th>
                  <th>Bank Key</th>
                  <th>Crcy</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty">
                      No house banks found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={`${item.companyCode}-${item.houseBank}`}
                      className={picked === item.houseBank ? 'selected' : ''}
                      onClick={() => onPick(item.houseBank)}
                      onDoubleClick={() => onPickAndConfirm(item.houseBank)}
                    >
                      <td>{item.companyCode}</td>
                      <td>{item.houseBank}</td>
                      <td>{item.bankKey}</td>
                      <td>{item.currency}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" disabled={!picked} onClick={onPickConfirm}>
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
