import type { LogRow } from './types.ts'

export type MessageLogProps = {
  active: boolean
  logRows: readonly LogRow[]
  onBack: () => void
}

/** The Log Message screen shown after a bank allocation creates one or more ICLs. */
export function MessageLog({ active, logRows, onBack }: MessageLogProps) {
  return (
    <div id="messageScreen" className={active ? 'screen active' : 'screen'}>
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-ghost" type="button" onClick={onBack}>
            Back to ICL Requests
          </button>
        </div>
      </div>
      <div className="card table-card" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        <div className="card-head">
          <div className="card-title">Log Message</div>
          <div className="card-meta">
            {logRows.length} entr{logRows.length === 1 ? 'y' : 'ies'} found
          </div>
        </div>
        <div className="message-wrap">
          <table className="message-table">
            <thead>
              <tr>
                <th>Exception</th>
                <th>Company Name</th>
                <th>Product Type Description</th>
                <th>Transaction</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Msg</th>
                <th>ICL Request No</th>
                <th>Request Date</th>
              </tr>
            </thead>
            <tbody>
              {logRows.map((row, index) => (
                <tr key={`${row.requestNo}-${index}`}>
                  <td className="status-cell">
                    <span className="log-ok" />
                  </td>
                  <td>{row.companyName}</td>
                  <td>{row.productDescription}</td>
                  <td>{row.transaction}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td>{row.message}</td>
                  <td>{row.requestNo}</td>
                  <td>{row.requestDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
