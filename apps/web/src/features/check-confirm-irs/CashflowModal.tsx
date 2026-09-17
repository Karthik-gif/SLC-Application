import { bankDisplayName, buildCashflows, signedMoney } from './format.ts'
import type { IrsRecord } from './types.ts'

export type CashflowModalProps = {
  row: IrsRecord | null
  onClose(): void
}

/** One label/value tile in the display grids. */
function DisplayItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="display-item">
      <div className="display-label">{label}</div>
      <div className="display-value">{value}</div>
    </div>
  )
}

/** The two-part tile the IRS grid uses for the variable-rate outgoing rate row. */
function DisplayPairItem({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string
  value1: string
  label2: string
  value2: string
}) {
  return (
    <div className="display-item">
      <div className="display-pair">
        <div className="display-pair-part">
          <div className="display-label">{label1}</div>
          <div className="display-value">{value1}</div>
        </div>
        <div className="display-pair-part">
          <div className="display-label">{label2}</div>
          <div className="display-value">{value2}</div>
        </div>
      </div>
    </div>
  )
}

function CashAmount({ value }: { value: number }) {
  return <span className={value >= 0 ? 'cash-pos' : 'cash-neg'}>{signedMoney(value)}</span>
}

/**
 * The Cashflow modal. Reset frequency, accounting type, special case and outgoing rate
 * category are all derived from `id % 3 === 0`, exactly as the original's variable-rate
 * placeholder logic did — there is no real classification field on the record yet.
 */
export function CashflowModal({ row, onClose }: CashflowModalProps) {
  if (!row) {
    return <div className="modal-bg"></div>
  }

  const variable = Number(row.id) % 3 === 0
  const frequency = variable ? 'Monthly' : 'Quarterly'
  const accounting = variable ? 'Manual' : 'Automatic'
  const special = variable ? 'DTY Interest' : 'Differential LIBOR'
  const category = variable ? 'Variable' : 'Fixed'
  const flows = buildCashflows(row)

  return (
    <div
      className="modal-bg open"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="cashflow-modal">
        <button className="cashflow-close" type="button" onClick={onClose}>
          X
        </button>
        <div className="cashflow-scroll">
          <div className="display-section">
            <div className="display-section-head">
              <div className="display-section-title">Discounting Loan Details</div>
              <div className="display-section-meta">Selected Record</div>
            </div>
            <div className="display-grid">
              <DisplayItem label="Deal ID" value={row.dealNo} />
              <DisplayItem label="Transaction No." value={row.discLoanTxn} />
              <DisplayItem label="BP Name" value={bankDisplayName(row.bankName)} />
              <DisplayItem label="Start Date" value={row.startDate} />
              <DisplayItem label="End Date" value={row.endDate} />
              <DisplayItem label="Ref. Int. Rate" value={row.inRefIntRate} />
              <DisplayItem label="Reset Frequency" value={frequency} />
              <DisplayItem label="Accounting Type" value={accounting} />
              <DisplayItem label="Special Case" value={special} />
            </div>
          </div>
          <div className="display-section">
            <div className="display-section-head">
              <div className="display-section-title">IRS Details</div>
            </div>
            <div className="display-grid irs-display-grid">
              <DisplayItem label="IRS Co Code" value={row.companyCode} />
              <DisplayItem label="IRS Transaction" value={row.irsId} />
              <DisplayItem label="IRS BP" value={bankDisplayName(row.bankName)} />
              <DisplayItem label="Start Date" value={row.startDate} />
              <DisplayItem label="End Date" value={row.endDate} />
              <DisplayItem label="Incoming Int Ref" value={row.inRefIntRate} />
              <DisplayItem label="Incoming Spread Rate" value={row.incSpreadRate} />
              <DisplayItem label="Outgoing Int Cat" value={category} />
              {variable ? (
                <DisplayPairItem
                  label1="Outgoing Int Rate"
                  value1={row.outRefIntRate}
                  label2="Outgoing Spread Rate"
                  value2={row.incSpreadRate}
                />
              ) : (
                <DisplayItem label="Outgoing Int Rate" value={row.outgoingInterestRate} />
              )}
              <DisplayItem label="Outgoing Int Frq" value={frequency} />
              <DisplayItem
                label="Interest Payment Date"
                value={variable ? 'Start of Period' : 'End of Period'}
              />
              <DisplayItem label="Special Case" value={special} />
            </div>
          </div>
          <div className="display-section">
            <div className="display-section-head">
              <div className="display-section-title">Cashflow Details</div>
              <div className="display-section-meta">{flows.length} row(s)</div>
            </div>
            <div className="cashflow-table-wrap">
              <table className="cashflow-table">
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Description</th>
                    <th>Disc Loan</th>
                    <th>IRS Incoming</th>
                    <th>IRS Outgoing</th>
                    <th>Curr</th>
                    <th>Int. Fix. Date</th>
                    <th>Percentage Rate</th>
                    <th>Int. Rate Adj. Status</th>
                  </tr>
                </thead>
                <tbody>
                  {flows.map((flow, index) => (
                    <tr key={index}>
                      <td>{flow.date}</td>
                      <td>{flow.description}</td>
                      <td className="cash-number">
                        <CashAmount value={flow.disc} />
                      </td>
                      <td className="cash-number">
                        <CashAmount value={flow.incoming} />
                      </td>
                      <td className="cash-number">
                        <CashAmount value={flow.outgoing} />
                      </td>
                      <td>USD</td>
                      <td>{flow.fixDate}</td>
                      <td className="cash-number">{flow.percentage}</td>
                      <td>{flow.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
