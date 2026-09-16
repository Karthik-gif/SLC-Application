import { codeText, fmtDate, fmtNum } from '@slc/api-client'
import type { ReactNode } from 'react'
import type { BankRow, OttkRow } from './types.ts'

function Field({ label, value, numeric }: { label: string; value: ReactNode; numeric?: boolean }) {
  return (
    <div className="field">
      <label>{label}</label>
      {/* Disabled inputs, not text: the original's .field grid and its disabled styling are
          what make this read as a locked copy of the create form. */}
      <input className={numeric ? 'num-input' : undefined} disabled value={value == null ? '' : String(value)} />
    </div>
  )
}

function Section({ title, kind, children }: { title: string; kind: string; children: ReactNode }) {
  return (
    <section className={`section ${kind}`}>
      <div className="section-title">{title}</div>
      <div className="fields">{children}</div>
    </section>
  )
}

/**
 * Read-only view of an origination ticket, reproducing legacy/DTTK.html's #ottkViewModal.
 *
 * It reuses the .dttk-grid class on its own container — which is why the Type 1 visibility
 * toggle in the create modal is scoped to that modal specifically and must never reach here.
 */
export function OttkViewModal({
  row,
  ottkBanks,
  onClose,
}: {
  row: OttkRow | undefined
  ottkBanks: readonly BankRow[]
  onClose: () => void
}) {
  const open = row !== undefined
  const bank = ottkBanks.find((b) => String(b.Zbp) === String(row?.ZottkBank))
  const businessArea = row?.ZbaText || bank?.ZbaText || ''
  const businessAreaCode = row?.Zrbusa || bank?.Zrbusa || ''

  return (
    <div
      className={open ? 'modal-backdrop open' : 'modal-backdrop'}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ottkViewModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="ottk-modal">
        <div className="modal-head">
          <div className="modal-heading">
            <div className="modal-heading-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />
              </svg>
            </div>
            <div>
              <h2 id="ottkViewModalTitle">View Origination Ticket</h2>
              <p id="ottkViewModalSubtitle">
                Origination · Read-only{row?.ZottkNo ? `  |  OTTK #${row.ZottkNo}` : ''}
              </p>
            </div>
          </div>
          <div className="modal-head-right">
            <div className="modal-head-created" hidden={!(row?.ZcreatedBy || row?.LocalCreatedBy)}>
              <span className="modal-head-created-label">Created By</span>
              <b>{row?.ZcreatedBy || row?.LocalCreatedBy || ''}</b>
            </div>
            <button type="button" className="modal-close" aria-label="Close modal" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="modal-content-grid dttk-grid">
          <Section title="Transaction Details" kind="sec-otxn">
            <Field label="OTTK Type" value={codeText(row?.Ztype, row?.ZtypeText)} />
            <Field label="Structure" value={codeText(row?.Zstr, row?.ZstrText)} />
            <Field label="Entity String" value={codeText(row?.ZentId, row?.ZentDesc)} />
            <Field label="OT Trader" value={row?.Ztrader} />
            <Field label="Status" value={row?.ZstatDesc || row?.ZottkSt} />
          </Section>

          <Section title="Trade Details" kind="sec-otrade">
            <Field label="LC Issuing Bank" value={row?.ZottkBank ? `${row.ZottkBank} — ${row.BpName ?? bank?.BpName ?? ''}` : ''} />
            <Field label="OTTK Trade Value" numeric value={`${fmtNum(row?.ZottkValue)} ${row?.ZottkCurr ?? ''}`.trim()} />
            <Field label="Expected LC Date" value={fmtDate(row?.Zdate)} />
            <Field label="Expected LC Tenor" value={row?.Ztenor} />
            <Field label="Payment Terms" value={row?.ZpayTerms} />
            <Field label="Other Charges" numeric value={fmtNum(row?.ZothFee)} />
            <Field label="BL Type" value={row?.Zbltype} />
            <Field label="LC Applicant" value={row?.ZlcApp} />
            <Field label="LC Beneficiary" value={row?.ZlcBen} />
            <Field label="Company Code" value={codeText(row?.Zbukrs, row?.Butxt)} />
            <Field label="Business Area" value={codeText(businessAreaCode, businessArea)} />
          </Section>

          <Section title="Deposit / Prepayment" kind="sec-odeposit">
            <Field label="Deposit Value" value={row?.ZdepVal} />
            <Field label="Deposit Amount" numeric value={`${fmtNum(row?.ZdepAmt)} ${row?.ZdepCurr ?? ''}`.trim()} />
            <Field label="Expected Date" value={fmtDate(row?.ZexpDate)} />
            <Field label="Interest Category" value={codeText(row?.ZintCat, row?.ZintCatText)} />
            <Field label="Interest Rate" numeric value={row?.ZintRate ? fmtNum(row.ZintRate) : ''} />
            <Field label="Ref Int Rate" value={row?.ZrefInt} />
            <Field label="Spread Rate" numeric value={row?.Zsrate ? fmtNum(row.Zsrate) : ''} />
            <Field label="1st Interest Date" value={fmtDate(row?.Zsdate)} />
            <Field label="Reset Frequency" value={row?.ZresFrq} />
            <Field label="Interest Frequency" value={row?.AccType} />
          </Section>

          <Section title="Commercial Summary" kind="sec-ocommercial">
            <Field label="Expected P&L %" numeric value={row?.ZplPer ? fmtNum(row.ZplPer) : ''} />
            <Field label="Expected P&L Amt" numeric value={fmtNum(row?.ZplAmt)} />
            <Field label="Remarks" value={row?.Zremark} />
          </Section>

          <Section title="Contact & Commitment" kind="sec-ocontact">
            <Field label="Bank Contact" value={row?.ZbankContact} />
            <Field label="Bank Contact Details" value={row?.ZbankContactDet} />
            <Field label="Commitment End Date" value={fmtDate(row?.ZcommEndDate)} />
          </Section>
        </div>

        <div className="modal-footer">
          <span className="modal-note">
            Read-only view — use the Related OTTK field in Create DTTK to base a new ticket on this one.
          </span>
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
