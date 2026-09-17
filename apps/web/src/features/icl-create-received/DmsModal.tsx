import { useRef } from 'react'
import { formatDate, parseDate } from './dates.ts'
import type { IclDmsDoc, IclRequestRow } from './types.ts'

type DmsModalProps = {
  open: boolean
  row: IclRequestRow | undefined
  pendingFileSelected: boolean
  onFilePathClick: () => void
  onEditClick: () => void
  onFileSelected: (file: File | null, path: string) => void
  onUpload: () => void
  onDownload: () => void
  onConfirm: () => void
  onClose: () => void
}

function filePathLabel(doc: IclDmsDoc | undefined): string {
  if (!doc) return 'Select file'
  if (doc.filePath) return doc.filePath
  if (doc.fileName) return doc.fileName
  return 'Select file'
}

/** DMS-for-ICL-request modal (`#dmsModal` in the original). */
export function DmsModal({
  open,
  row,
  pendingFileSelected,
  onFilePathClick,
  onEditClick,
  onFileSelected,
  onUpload,
  onDownload,
  onConfirm,
  onClose,
}: DmsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const doc = row?.dms
  const locked = row?.statusCode === 'RECEIVED'
  const docDate = doc ? parseDate(doc.docDate) : null
  const pathClass = locked || doc?.finalized ? 'path-cell disabled' : 'path-cell'

  function openFileDialog(edit: boolean) {
    if (locked || doc?.finalized) return
    if (edit && !doc?.uploaded) return
    if (edit) onEditClick()
    else onFilePathClick()
    fileInputRef.current?.click()
  }

  return (
    <div id="dmsModal" className={'modal-bg' + (open ? ' open' : '')}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">DMS for ICL Request</div>
          <button id="dmsClose" className="modal-close" type="button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="dms-detail">
            <div className="dms-detail-label">ICL Transaction</div>
            <div id="dmsTransaction" className="dms-detail-value">
              {row ? row.iclRecTxn || row.iclGivenTxn || '' : ''}
            </div>
          </div>
          <div className="table-wrap">
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
                {doc && (
                  <tr>
                    <td>{doc.docType}</td>
                    <td>{doc.docTypeDesc}</td>
                    <td>{docDate ? formatDate(docDate) : doc.docDate}</td>
                    <td>
                      <div
                        id="filePathCell"
                        className={pathClass}
                        title={filePathLabel(doc)}
                        onClick={() => openFileDialog(false)}
                      >
                        <span>{filePathLabel(doc)}</span>
                      </div>
                    </td>
                    <td>{doc.dmsCode}</td>
                    <td>
                      <button
                        id="uploadBtn"
                        className="action-btn"
                        type="button"
                        disabled={locked || doc.finalized || doc.uploaded || !pendingFileSelected}
                        onClick={onUpload}
                      >
                        Upload
                      </button>
                    </td>
                    <td>
                      <button
                        id="downloadBtn"
                        className="action-btn"
                        type="button"
                        disabled={!doc.uploaded}
                        onClick={onDownload}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button
                        id="editBtn"
                        className="action-btn"
                        type="button"
                        disabled={locked || doc.finalized || !doc.uploaded}
                        onClick={() => openFileDialog(true)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <input
            ref={fileInputRef}
            id="dmsFileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) =>
              onFileSelected(e.target.files && e.target.files.length ? e.target.files[0]! : null, e.target.value)
            }
          />
        </div>
        <div className="modal-foot">
          <button id="dmsCancel" className="btn btn-ghost" type="button" onClick={onClose}>
            Close
          </button>
          <button
            id="dmsConfirm"
            className="btn btn-primary"
            type="button"
            disabled={locked || doc?.finalized || !doc?.uploaded}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
