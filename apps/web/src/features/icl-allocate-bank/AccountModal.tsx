import type { BankAccount } from './types.ts'

export type AccountRow = { index: number; item: BankAccount }

export type AccountModalProps = {
  open: boolean
  rows: readonly AccountRow[]
  search: string
  onSearchChange: (value: string) => void
  picked: number
  onPick: (index: number) => void
  onPickConfirm: () => void
  onPickAndConfirm: (index: number) => void
  onClose: () => void
}

/** The Account ID lookup dialog, scoped to the house bank chosen just before it. */
export function AccountModal({
  open,
  rows,
  search,
  onSearchChange,
  picked,
  onPick,
  onPickConfirm,
  onPickAndConfirm,
  onClose,
}: AccountModalProps) {
  const q = search.toLowerCase()
  const filtered = q ? rows.filter((row) => JSON.stringify(row.item).toLowerCase().indexOf(q) >= 0) : rows

  return (
    <div className={open ? 'modal-bg open' : 'modal-bg'}>
      <div className="modal lookup-small account">
        <div className="modal-head">
          <div className="modal-title">Account ID</div>
          <button className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Search account ID"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
          <div className="table-wrap" style={{ maxHeight: 300 }}>
            <table className="lookup-table account-table">
              <thead>
                <tr>
                  <th>CoCd</th>
                  <th>House Bk</th>
                  <th>Acct ID</th>
                  <th>Crcy</th>
                  <th>Bank Account</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty">
                      No account IDs found for this House Bank.
                    </td>
                  </tr>
                ) : (
                  filtered.map(({ index, item }) => (
                    <tr
                      key={index}
                      className={picked === index ? 'selected' : ''}
                      onClick={() => onPick(index)}
                      onDoubleClick={() => onPickAndConfirm(index)}
                    >
                      <td>{item.companyCode}</td>
                      <td>{item.houseBank}</td>
                      <td>{item.accountId}</td>
                      <td>{item.currency}</td>
                      <td>{item.bankAccount}</td>
                      <td>{item.description}</td>
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
          <button className="btn btn-primary" type="button" disabled={picked < 0} onClick={onPickConfirm}>
            Select
          </button>
        </div>
      </div>
    </div>
  )
}
