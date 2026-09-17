import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { runLimited } from '@slc/api-client'
import { useConnectionState } from '@slc/api-client/react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { loadCommodities, pingBackend, uploadRow } from './api.ts'
import { TF_TYPE_CODES } from './fields.ts'
import type { CommodityRow } from './fields.ts'
import { displayCell, isNumberColumn, normalizeSearchText, responsivePageSize } from './display.ts'
import type { TemplateColumn } from './display.ts'
import { parseExcelFile } from './xlsx.ts'
import type { CellValue } from './xlsx.ts'
import payload from './template.json'
import './tf-upload.legacy.css'
// Night mode. Generated from the sheet above by tools/gen-dark-css.mjs; it only restates the
// colours that change, at a higher specificity, so it must be imported after it.
import './tf-upload.dark.css'

/**
 * Trade Flow Excel Upload.
 *
 * A faithful reproduction of legacy/Uplaod TF.html: the markup mirrors that page element for
 * element and class for class, and tf-upload.legacy.css is its own stylesheet scoped under
 * .tfupload. template.json is that page's embedded payload, extracted verbatim — the 45
 * template headers, their column types, the master data and the base64 template workbook.
 */

const BRAND_LOGO =
  'https://raw.githubusercontent.com/ryannayak/fs-assets/e82f35a83e28689167b22b4300d4994a249acee0/fs-short-logo.png'

const HEADERS = payload.template.headers as string[]
const COLUMNS = payload.template.columns as TemplateColumn[]
const BUSINESS_UNITS = payload.masterData.businessUnits as Array<{ code: string; name: string }>
const TF_TYPES = payload.masterData.tfTypes as Array<{ code: string; name: string }>
const MAX_FILE_MB = payload.uiConfig.maxFileMb as number

type RowResult = { status: 'pending' | 'success' | 'error'; message: string }

type Extracted = {
  fileName: string
  headers: CellValue[]
  rows: CellValue[][]
}

function businessUnitLabel(code: string): string {
  const unit = BUSINESS_UNITS.find((b) => b.code === code)
  return unit ? `${unit.code} - ${unit.name}` : code
}

function tfTypeLabel(code: string): string {
  return TF_TYPES.find((t) => t.code === code)?.name ?? code
}

/** Rebuilds the template workbook from the base64 chunks embedded in the payload. */
function downloadTemplate(): void {
  const chunks = (payload.template.fileBase64Chunks as string[] | undefined) ?? []
  const binary = atob(chunks.join(''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = payload.template.fileName as string
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function TfUploadApp() {
  const connection = useConnectionState()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [businessUnit, setBusinessUnit] = useState('')
  const [tfType, setTfType] = useState('')
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<string>()

  const [extracted, setExtracted] = useState<Extracted>()
  const [results, setResults] = useState<RowResult[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number }>()
  const [uploadFinished, setUploadFinished] = useState(false)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() =>
    responsivePageSize(window.innerWidth || 1200, window.innerHeight || 800),
  )
  const [commodities, setCommodities] = useState<CommodityRow[]>([])
  const [toast, setToast] = useState<{ title: string; message: string; isError: boolean }>()

  const contextReady = Boolean(businessUnit && tfType)

  useEffect(() => {
    void loadCommodities().then(setCommodities)
    const timer = setInterval(() => void pingBackend(), 30_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onResize = () =>
      setPageSize(responsivePageSize(window.innerWidth || 1200, window.innerHeight || 800))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const resetPreview = useCallback(() => {
    setExtracted(undefined)
    setResults([])
    setSearch('')
    setPage(1)
    setUploadFinished(false)
    setUploadProgress(undefined)
  }, [])

  const clearFile = useCallback(() => {
    setFile(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
    resetPreview()
  }, [resetPreview])

  /** Validates before accepting: extension, size, and that the context is chosen. */
  const acceptFile = useCallback(
    (candidate: File | undefined) => {
      setError(undefined)
      if (!contextReady) {
        setError('Select Business Unit and TF Type before choosing an Excel file.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      if (!candidate) {
        clearFile()
        return
      }
      const lower = candidate.name.toLowerCase()
      if (!lower.endsWith('.xlsx') && !lower.endsWith('.xlsm')) {
        setError('Please select an .xlsx or .xlsm Excel workbook.')
        clearFile()
        return
      }
      if (candidate.size > MAX_FILE_MB * 1024 * 1024) {
        setError('The selected file exceeds the maximum allowed size.')
        clearFile()
        return
      }
      setFile(candidate)
      resetPreview()
    },
    [contextReady, clearFile, resetPreview],
  )

  async function handleExtract() {
    setError(undefined)
    if (!contextReady) return setError('Select Business Unit and TF Type before extracting.')
    if (!file) return setError('Select an Excel file before extracting.')

    try {
      const parsed = await parseExcelFile(file, HEADERS)
      setExtracted({ fileName: file.name, headers: parsed.headers, rows: parsed.rows })
      setResults(parsed.rows.map(() => ({ status: 'pending', message: '' })))
      setSearch('')
      setPage(1)
      setUploadFinished(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to read the selected Excel file.')
    }
  }

  /**
   * Rows go up three at a time. Each row's outcome is recorded against its own index, so the
   * Status column stays correct even after a search narrows the visible list.
   */
  async function handleUpload() {
    if (!extracted) return setError('Extract the selected Excel file before uploading.')
    setError(undefined)
    setUploading(true)

    const total = extracted.rows.length
    const next: RowResult[] = extracted.rows.map(() => ({ status: 'pending', message: '' }))
    setResults(next)
    setUploadProgress({ done: 0, total })

    let done = 0
    const tfTypeCode = TF_TYPE_CODES[tfType] ?? ''

    await runLimited(
      extracted.rows.map((row, index) => async () => {
        try {
          await uploadRow(row, businessUnit, tfTypeCode, BUSINESS_UNITS, commodities)
          next[index] = { status: 'success', message: 'Updated' }
        } catch (err) {
          next[index] = { status: 'error', message: err instanceof Error ? err.message : 'Failed' }
        } finally {
          done++
          setUploadProgress({ done, total })
          setResults([...next])
        }
      }),
      3,
    )

    const successCount = next.filter((r) => r.status === 'success').length
    const failCount = total - successCount
    setUploading(false)
    setUploadFinished(true)
    setUploadProgress(undefined)
    setToast(
      failCount === 0
        ? { title: 'Success', message: `${successCount} of ${total} row(s) updated.`, isError: false }
        : {
            title: 'Completed with errors',
            message: `${successCount} of ${total} row(s) updated, ${failCount} failed. See the Status column.`,
            isError: true,
          },
    )
    window.setTimeout(() => setToast(undefined), 5200)
  }

  /** Filtered row indexes, kept as ORIGINAL indexes so results still line up. */
  const filteredIndexes = useMemo(() => {
    if (!extracted) return []
    const query = search.trim().toLowerCase()
    if (!query) return extracted.rows.map((_, index) => index)
    const compact = normalizeSearchText(search.trim())

    return extracted.rows.reduce<number[]>((acc, row, index) => {
      for (let i = 0; i < HEADERS.length; i++) {
        const raw = String(row[i] ?? '')
        const shown = displayCell(row[i], i, COLUMNS)
        if (
          shown.toLowerCase().includes(query) ||
          raw.toLowerCase().includes(query) ||
          normalizeSearchText(shown).includes(compact) ||
          normalizeSearchText(raw).includes(compact)
        ) {
          acc.push(index)
          return acc
        }
      }
      return acc
    }, [])
  }, [extracted, search])

  const total = filteredIndexes.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const visible = filteredIndexes.slice(start, end)

  const summary = extracted
    ? [
        extracted.fileName,
        businessUnitLabel(businessUnit),
        tfTypeLabel(tfType),
        `${extracted.rows.length} rows`,
        `${extracted.headers.length} columns`,
      ].join(' | ')
    : ''

  const uploadLabel = uploading
    ? `Uploading ${uploadProgress?.done ?? 0}/${uploadProgress?.total ?? 0}...`
    : uploadFinished
      ? results.some((r) => r.status === 'error')
        ? 'Retry Upload'
        : 'Uploaded'
      : 'Upload'

  // The page numbers group shows the current page and the one after it, as the original did.
  const pageNumbers: number[] = []
  {
    let from = currentPage
    const to = Math.min(totalPages, from + 1)
    if (from === totalPages && totalPages > 1) from = totalPages - 1
    for (let p = from; p <= to; p++) pageNumbers.push(p)
  }

  return (
    <div className="tfupload">
      <div className="app-shell">
        <header className="app-header">
          <div className="header-left">
            <BackButton />
            <img className="ds-mark" alt="Fourth Signal" src={BRAND_LOGO} />
            <div className="app-title">Trade Flow Excel Upload</div>
            <span className="ds-code">TF UPLOAD</span>
          </div>
          <div className="header-right">
            <span
              className={connection === 'unreachable' ? 'ds-conn offline' : 'ds-conn'}
              title={connection === 'unreachable' ? 'Cannot reach the SAP gateway' : 'System connected'}
            />
            <button
              type="button"
              className="btn template-link"
              title="Download the Trade Flow Excel template"
              onClick={downloadTemplate}
            >
              <span className="download-mark" aria-hidden="true" />
              <span>Download Template</span>
            </button>
            <SignOutButton />
          </div>
        </header>

        <main>
          <section className="page">
            <div className="screen-heading compact-heading">
              <div>
                <h1 className="screen-title">Upload Trade Flow File</h1>
              </div>
            </div>

            <div className="intake-layout">
              <section className="card context-card">
                <div className="card-head compact-card-head">
                  <div>
                    <div className="card-title">Upload Context</div>
                  </div>
                </div>
                <div className="card-body context-body">
                  <div className="field compact-field">
                    <label htmlFor="businessUnitSelect">
                      Business Unit<span className="req">*</span>
                    </label>
                    <select
                      id="businessUnitSelect"
                      required
                      value={businessUnit}
                      onChange={(event) => {
                        setBusinessUnit(event.target.value)
                        setError(undefined)
                      }}
                    >
                      <option value="">Select Business Unit</option>
                      {BUSINESS_UNITS.map((unit) => (
                        <option key={unit.code} value={unit.code}>
                          {unit.code} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field compact-field">
                    <label htmlFor="tfTypeSelect">
                      TF Type<span className="req">*</span>
                    </label>
                    <select
                      id="tfTypeSelect"
                      required
                      value={tfType}
                      onChange={(event) => {
                        setTfType(event.target.value)
                        setError(undefined)
                      }}
                    >
                      <option value="">Select TF Type</option>
                      {TF_TYPES.map((type) => (
                        <option key={type.code} value={type.code}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="card upload-card compact-upload-card">
                <div className="card-head compact-card-head">
                  <div>
                    <div className="card-title">Excel File</div>
                  </div>
                </div>
                <div className="card-body compact-upload-body">
                  <div className="upload-file-row">
                    <div
                      className={`drop-zone compact-drop-zone${file ? ' has-file' : ''}`}
                      tabIndex={0}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault()
                        acceptFile(event.dataTransfer.files[0])
                      }}
                    >
                      <div className="drop-inline">
                        <div className="upload-glyph compact-upload-glyph" aria-hidden="true" />
                        <div className="drop-text-wrap">
                          <div className="drop-title">Drop Excel file here</div>
                          <div className="drop-copy">
                            or{' '}
                            <button
                              type="button"
                              className="browse-link"
                              onClick={() => {
                                if (!contextReady) {
                                  setError('Select Business Unit and TF Type before choosing an Excel file.')
                                  return
                                }
                                fileInputRef.current?.click()
                              }}
                            >
                              Browse
                            </button>
                          </div>
                          <div className="file-note">Supported: .xlsx, .xlsm</div>
                        </div>
                      </div>
                      <div className={file ? 'selected-file' : 'selected-file hidden'}>
                        <div className="file-main">
                          <div className="file-name">{file?.name ?? ''}</div>
                        </div>
                      </div>
                    </div>
                    <div className="extract-actions">
                      <button
                        type="button"
                        className="btn primary"
                        disabled={!file || !contextReady}
                        onClick={() => void handleExtract()}
                      >
                        Extract
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          clearFile()
                          setBusinessUnit('')
                          setTfType('')
                          setError(undefined)
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xlsm"
                    hidden
                    onChange={(event) => acceptFile(event.target.files?.[0])}
                  />
                  <div className={error ? 'message error' : 'message error hidden'}>{error}</div>
                </div>
              </section>
            </div>

            <section className={extracted ? 'card table-card' : 'card table-card hidden'}>
              <div className="preview-headbar">
                <div className="preview-heading-wrap">
                  <div className="card-title">Extracted Excel Preview</div>
                  <div className="preview-summary">{summary}</div>
                </div>
                <button
                  type="button"
                  className="btn primary final-upload-btn"
                  disabled={uploading}
                  onClick={() => void handleUpload()}
                >
                  {uploadLabel}
                </button>
              </div>

              <div className="table-toolbar">
                <div className="toolbar-group">
                  <div className="toolbar-field search-field">
                    <label htmlFor="tableSearch">Search rows</label>
                    <input
                      type="text"
                      id="tableSearch"
                      placeholder="Search any displayed value"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value)
                        setPage(1)
                      }}
                    />
                  </div>
                </div>
                <div className="table-meta">
                  {total} row{total === 1 ? '' : 's'} | {HEADERS.length} columns
                </div>
              </div>

              <div className="table-wrap">
                <table className={total === 0 ? 'preview-table hidden' : 'preview-table'}>
                  <thead>
                    <tr>
                      {HEADERS.map((header, index) => (
                        <th
                          key={header}
                          className={index === 0 ? 'sticky-1' : index === 1 ? 'sticky-2' : ''}
                          title={header}
                        >
                          {header}
                        </th>
                      ))}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((originalIndex) => {
                      const row = extracted?.rows[originalIndex] ?? []
                      const result = results[originalIndex]
                      return (
                        <tr key={originalIndex}>
                          {HEADERS.map((header, columnIndex) => {
                            const text = displayCell(row[columnIndex], columnIndex, COLUMNS)
                            const sticky = columnIndex === 0 ? 'sticky-1' : columnIndex === 1 ? 'sticky-2' : ''
                            const numeric = isNumberColumn(COLUMNS, columnIndex) ? 'num' : ''
                            return (
                              <td key={header} className={`${sticky} ${numeric}`.trim()} title={text}>
                                {text}
                              </td>
                            )
                          })}
                          <td>
                            {!result || result.status === 'pending' ? (
                              <span className="tf-status tf-status-pending">Pending</span>
                            ) : result.status === 'success' ? (
                              <span className="tf-status tf-status-success">Updated</span>
                            ) : (
                              <span className="tf-status tf-status-error" title={result.message}>
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className={total === 0 ? 'empty-preview' : 'empty-preview hidden'}>
                  No rows match the current search.
                </div>
              </div>

              <div className="pagination">
                <div className="page-info">
                  {total === 0 ? '0 rows' : `Showing ${start + 1}-${end} of ${total} rows`}
                </div>
                <div className="page-actions">
                  <button
                    type="button"
                    className="page-btn"
                    aria-label="Previous page"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  <div className="page-number-group">
                    {pageNumbers.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={p === currentPage ? 'page-btn active' : 'page-btn'}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="page-btn"
                    aria-label="Next page"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>

      <div
        className={toast ? 'upload-toast' : 'upload-toast hidden'}
        role="status"
        aria-live="polite"
        style={toast ? { borderLeftColor: toast.isError ? 'var(--red)' : 'var(--green)' } : undefined}
      >
        <div className="upload-toast-icon">&#10003;</div>
        <div className="upload-toast-content">
          <div className="upload-toast-title">{toast?.title ?? 'Success'}</div>
          <div className="upload-toast-message">{toast?.message ?? 'Uploaded successfully.'}</div>
        </div>
      </div>
    </div>
  )
}
