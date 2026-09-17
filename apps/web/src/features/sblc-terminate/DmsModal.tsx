import { useEffect, useRef, useState } from 'react'
import { CalendarPopup } from './CalendarPopup.tsx'
import { formatDate, parseDate } from './format.ts'
import type { DmsDoc, SblcRow, ToastKind } from './types.ts'

export type DmsModalProps = {
  open: boolean
  row: SblcRow | null
  rowIndex: number
  onClose: () => void
  onUpdateDoc: (rowIndex: number, docIndex: number, patch: Partial<DmsDoc>) => void
  onNextDmsCode: () => string
  onToast: (message: string, kind: ToastKind) => void
  onStatus: (text: string) => void
}

/**
 * DMS upload/download/edit for the three fixed document slots on a request. Mirrors
 * openDms/renderDms/uploadDms/downloadDms/editDms from the legacy page: each doc has an
 * "editable" window that opens either before its first upload or while it is being replaced.
 */
export function DmsModal({ open, row, rowIndex, onClose, onUpdateDoc, onNextDmsCode, onToast, onStatus }: DmsModalProps) {
  const [draftDates, setDraftDates] = useState<Record<number, string>>({})
  const [editDocIndex, setEditDocIndex] = useState(-1)
  const [activeDocIndex, setActiveDocIndex] = useState(-1)
  const [calendarIndex, setCalendarIndex] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open || !row) return
    const drafts: Record<number, string> = {}
    row.dms.forEach((doc, i) => {
      const date = parseDate(doc.docDate)
      drafts[i] = date ? formatDate(date) : doc.docDate
    })
    setDraftDates(drafts)
    setEditDocIndex(-1)
    setActiveDocIndex(-1)
    setCalendarIndex(-1)
    if (fileInputRef.current) fileInputRef.current.value = ''
    // Only re-run when a different DMS session opens, not on every doc edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, rowIndex])

  if (!row) {
    return (
      <div id="dmsModal" className={'modal-bg' + (open ? ' open' : '')}>
        <div className="modal dms-modal" />
      </div>
    )
  }

  function chooseFile(index: number) {
    const doc = row!.dms[index]
    if (!doc || (doc.uploaded && editDocIndex !== index)) return
    setActiveDocIndex(index)
    fileInputRef.current?.click()
  }

  function onFileInputChange() {
    const input = fileInputRef.current
    const file = input?.files?.[0] ?? null
    if (!file || activeDocIndex < 0) return
    onUpdateDoc(rowIndex, activeDocIndex, { fileName: file.name || 'Selected file', pendingFile: file })
    if (input) input.value = ''
  }

  function saveDate(index: number): Date | null {
    const date = parseDate(draftDates[index] ?? '')
    if (!date) return null
    const formatted = formatDate(date)
    setDraftDates((d) => ({ ...d, [index]: formatted }))
    onUpdateDoc(rowIndex, index, { docDate: formatted })
    return date
  }

  function uploadDoc(index: number) {
    const doc = row!.dms[index]
    if (!doc) return
    if (!saveDate(index)) {
      onToast('Enter Doc Date in DD-MM-YYYY format before upload.', 'warning')
      return
    }
    const file = doc.pendingFile
    if (!file) {
      onToast('Select a file from File Path first.', 'warning')
      return
    }
    const dmsCode = doc.dmsCode || onNextDmsCode()
    onUpdateDoc(rowIndex, index, { uploaded: true, file, pendingFile: null, dmsCode })
    setEditDocIndex(-1)
    onToast(`Document uploaded. DMS Code ${dmsCode} generated.`, 'success')
    onStatus(`DMS Code ${dmsCode} generated successfully`)
  }

  function downloadDoc(index: number) {
    const doc = row!.dms[index]
    if (!doc?.uploaded) return
    const file = doc.file
    if (file && window.URL?.createObjectURL) {
      const url = window.URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = doc.fileName || 'SBLC_Document'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      return
    }
    onToast('The uploaded document is available from SAP DMS in the integrated screen.', 'warning')
  }

  function editDoc(index: number) {
    const doc = row!.dms[index]
    if (!doc?.uploaded) return
    setEditDocIndex(index)
    setActiveDocIndex(index)
    onUpdateDoc(rowIndex, index, { pendingFile: null })
    onToast('Document is unlocked. Select a replacement file and upload it.', '')
  }

  return (
    <div id="dmsModal" className={'modal-bg' + (open ? ' open' : '')}>
      <div className="modal dms-modal">
        <div className="modal-head">
          <div className="modal-title">DMS</div>
          <button id="dmsClose" className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="dms-detail">
            <div className="dms-detail-block">
              <span className="dms-detail-label">SBLC Request No</span>
              <span id="dmsRequestNo" className="dms-detail-value">
                {row.sblcRequestNumber}
              </span>
            </div>
            <div className="dms-detail-block">
              <span className="dms-detail-label">SBLC Transaction</span>
              <span id="dmsTransaction" className="dms-detail-value">
                {row.sblcTransaction}
              </span>
            </div>
          </div>
          <div className="dms-wrap">
            <table className="dms-table">
              <thead>
                <tr>
                  <th>Doc Type</th>
                  <th>Doc Type Desc</th>
                  <th>Doc Date</th>
                  <th>File Path</th>
                  <th>DMS Code</th>
                  <th>Upload</th>
                  <th>Download</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody id="dmsBody">
                {row.dms.map((doc, i) => {
                  const editable = !doc.uploaded || editDocIndex === i
                  const uploadDisabled = !doc.pendingFile
                  const downloadDisabled = !doc.uploaded
                  const editDisabled = !(doc.uploaded && editDocIndex !== i)
                  return (
                    <tr key={doc.docType}>
                      <td>{doc.docType}</td>
                      <td>{doc.docTypeDesc}</td>
                      <td className="editable">
                        <div className="dms-date-shell">
                          <input
                            id={'dmsDate' + i}
                            className="dms-date-input"
                            type="text"
                            placeholder="DD-MM-YYYY"
                            autoComplete="off"
                            disabled={!editable}
                            value={draftDates[i] ?? ''}
                            onChange={(e) => setDraftDates((d) => ({ ...d, [i]: e.target.value }))}
                          />
                          <button
                            id={'dmsCalBtn' + i}
                            className="calendar-btn"
                            type="button"
                            disabled={!editable}
                            aria-label="Open document date calendar"
                            onClick={() => setCalendarIndex(calendarIndex === i ? -1 : i)}
                          />
                          {calendarIndex === i ? (
                            <CalendarPopup
                              id={'dmsCalendar' + i}
                              value={draftDates[i] ?? ''}
                              onSelect={(value) => {
                                setDraftDates((d) => ({ ...d, [i]: value }))
                                onUpdateDoc(rowIndex, i, { docDate: value })
                              }}
                              onClose={() => setCalendarIndex(-1)}
                            />
                          ) : (
                            <div id={'dmsCalendar' + i} className="calendar-popup" />
                          )}
                        </div>
                      </td>
                      <td className="editable">
                        <div className={'path-cell' + (editable ? '' : ' disabled')} onClick={() => chooseFile(i)}>
                          <span>{doc.fileName || 'Select file'}</span>
                        </div>
                      </td>
                      <td>{doc.dmsCode || ''}</td>
                      <td>
                        <button className="action-btn" type="button" disabled={uploadDisabled} onClick={() => uploadDoc(i)}>
                          Upload
                        </button>
                      </td>
                      <td>
                        <button className="action-btn" type="button" disabled={downloadDisabled} onClick={() => downloadDoc(i)}>
                          Download
                        </button>
                      </td>
                      <td>
                        <button className="action-btn" type="button" disabled={editDisabled} onClick={() => editDoc(i)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <input id="dmsFileInput" ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={onFileInputChange} />
        </div>
        <div className="modal-foot">
          <button id="dmsDone" className="btn btn-primary" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
