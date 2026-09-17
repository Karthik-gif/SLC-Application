import { useEffect, useMemo, useRef, useState } from 'react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { DmsModal } from './DmsModal.tsx'
import { ICL_PAYLOAD } from './data.ts'
import { formatDate, normalizeDateText, parseDate } from './dates.ts'
import { ResultsTable } from './ResultsTable.tsx'
import { SelectionPanel } from './SelectionPanel.tsx'
import type { ToastItem, ToastKind } from './ToastRegion.tsx'
import { ToastRegion } from './ToastRegion.tsx'
import type { CalendarTarget, FilterState, IclRequestRow, IclSettings, IndexedRow, SortState } from './types.ts'
import './icl-create-received.legacy.css'
// Night mode. Generated from the sheet above by tools/gen-dark-css.mjs; it only restates the
// colours that change, at a higher specificity, so it must be imported after it.
import './icl-create-received.dark.css'

const DEFAULT_STATUS = 'Enter an Upto Request Date to load ICL requests'

const EMPTY_FILTERS: FilterState = {
  givenTxn: '',
  requestNo: '',
  entity: '',
  ottk: '',
  plannedDate: '',
}

const FILTER_ROW_KEY: Record<keyof Omit<FilterState, 'plannedDate'>, keyof IclRequestRow> = {
  givenTxn: 'iclGivenTxn',
  requestNo: 'iclRequestNo',
  entity: 'entityId',
  ottk: 'ottkNo',
}

/** Clones the seed rows so edits (create-received, DMS upload) never mutate the module data. */
function cloneRows(rows: readonly IclRequestRow[]): IclRequestRow[] {
  return rows.map((row) => ({ ...row, dms: { ...row.dms } }))
}

export default function IclCreateReceivedApp() {
  const [rows, setRows] = useState<IclRequestRow[]>(() => cloneRows(ICL_PAYLOAD.rows))
  const [settings, setSettings] = useState<IclSettings>(() => ({ ...ICL_PAYLOAD.settings }))
  const columns = ICL_PAYLOAD.columns

  const [uptoText, setUptoText] = useState('')
  const [committedUpto, setCommittedUpto] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)
  const [status, setStatus] = useState(DEFAULT_STATUS)

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [openCombo, setOpenCombo] = useState<keyof FilterState | null>(null)
  const [calendarOpenFor, setCalendarOpenFor] = useState<CalendarTarget | null>(null)

  const [sort, setSort] = useState<SortState>({ index: -1, direction: '' })
  const [page, setPage] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [dmsOpen, setDmsOpen] = useState(false)
  const [activeDmsIndex, setActiveDmsIndex] = useState(-1)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [editMode, setEditMode] = useState(false)
  const uploadedFiles = useRef<Record<number, File>>({})

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function pushToast(message: string, kind: ToastKind = 'info') {
    const id = ++toastId.current
    setToasts((current) => [...current, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 4200)
  }

  function resetSelection() {
    setPage(1)
    setSelectedIndex(-1)
  }

  function commitUptoValue(raw: string) {
    resetSelection()
    const date = parseDate(raw)
    if (!raw) {
      setUptoText(raw)
      setCommittedUpto('')
      setResultsOpen(false)
      setStatus(DEFAULT_STATUS)
      return
    }
    if (!date) {
      setUptoText(raw)
      setResultsOpen(false)
      pushToast('Enter the date in DD-MM-YYYY format.', 'warning')
      setStatus('Invalid Upto Request Date')
      return
    }
    const formatted = formatDate(date)
    setUptoText(formatted)
    setCommittedUpto(formatted)
    setFilters((f) => (f.plannedDate ? { ...f, plannedDate: normalizeDateText(f.plannedDate) } : f))
    setResultsOpen(true)
    setStatus('ICL requests loaded')
  }

  function updateFilter(key: keyof FilterState, value: string) {
    setFilters((f) => ({ ...f, [key]: value }))
    if (parseDate(committedUpto)) resetSelection()
  }

  function commitPlannedDate() {
    if (!parseDate(committedUpto)) return
    setFilters((f) => ({ ...f, plannedDate: normalizeDateText(f.plannedDate) }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    if (parseDate(committedUpto)) resetSelection()
  }

  // --- filtering, sorting, pagination -------------------------------------------------

  const filteredRows = useMemo<IndexedRow[]>(() => {
    const upTo = parseDate(committedUpto)
    if (!upTo) return []
    const givenTxn = filters.givenTxn.toLowerCase()
    const requestNo = filters.requestNo.toLowerCase()
    const entity = filters.entity.toLowerCase()
    const ottk = filters.ottk.toLowerCase()
    const result: IndexedRow[] = []
    rows.forEach((row, index) => {
      const requestDate = parseDate(row.requestDate)
      if (!requestDate || requestDate > upTo) return
      if (givenTxn && !row.iclGivenTxn.toLowerCase().includes(givenTxn)) return
      if (requestNo && !row.iclRequestNo.toLowerCase().includes(requestNo)) return
      if (entity && !row.entityId.toLowerCase().includes(entity)) return
      if (ottk && !row.ottkNo.toLowerCase().includes(ottk)) return
      if (filters.plannedDate) {
        const plannedInput = parseDate(filters.plannedDate)
        const plannedRow = parseDate(row.plannedEndDate)
        if (!plannedInput || !plannedRow || plannedInput.getTime() !== plannedRow.getTime()) return
      }
      result.push({ row, index })
    })
    return result
  }, [rows, committedUpto, filters])

  const sortedRows = useMemo<IndexedRow[]>(() => {
    const maybeColumn = sort.index >= 0 ? columns[sort.index] : undefined
    if (!maybeColumn || !sort.direction) return filteredRows
    const column = maybeColumn
    const direction = sort.direction
    function sortValue(item: IndexedRow): number | string {
      const value = item.row[column.key as keyof IclRequestRow]
      if (column.type === 'amount' || column.type === 'rate') return Number(value || 0)
      if (column.type === 'date') {
        const date = parseDate(String(value ?? ''))
        return date ? date.getTime() : 0
      }
      return String(value || '').toLowerCase()
    }
    return [...filteredRows].sort((a, b) => {
      const av = sortValue(a)
      const bv = sortValue(b)
      if (av < bv) return direction === 'asc' ? -1 : 1
      if (av > bv) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredRows, sort, columns])

  const pageSize = settings.pageSize
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const clampedPage = Math.min(page, pageCount)
  const pageRows = useMemo(
    () => sortedRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize),
    [sortedRows, clampedPage, pageSize],
  )

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  function toggleSort(columnIndex: number) {
    setSort((current) =>
      current.index === columnIndex
        ? { index: columnIndex, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { index: columnIndex, direction: 'asc' },
    )
    setPage(1)
  }

  // --- combo boxes ---------------------------------------------------------------------

  function comboValuesFor(field: keyof FilterState): string[] {
    if (field === 'plannedDate') return []
    const key = FILTER_ROW_KEY[field]
    const query = filters[field].toLowerCase()
    const seen = new Set<string>()
    for (const row of rows) {
      const value = String(row[key] || '')
      if (!value || seen.has(value)) continue
      if (query && !value.toLowerCase().includes(query)) continue
      seen.add(value)
    }
    return [...seen].sort()
  }

  function chooseCombo(field: keyof FilterState, value: string) {
    setFilters((f) => ({ ...f, [field]: value }))
    setOpenCombo(null)
    if (parseDate(committedUpto)) resetSelection()
  }

  // --- selection + row actions -----------------------------------------------------------

  const selectedRow = selectedIndex >= 0 ? rows[selectedIndex] : undefined
  const selectionLabel = selectedRow ? 'ICL Request ' + selectedRow.iclRequestNo + ' selected' : 'No row selected'
  const createDisabled = !selectedRow || selectedRow.statusCode === 'RECEIVED'
  const dmsDisabled = !selectedRow

  function createReceived() {
    if (selectedIndex < 0) {
      pushToast('Select one ICL request first.', 'warning')
      return
    }
    const row = rows[selectedIndex]
    if (!row) return
    if (row.statusCode === 'RECEIVED') {
      pushToast('ICL Received transaction already exists for this request.', 'warning')
      return
    }
    const txn = String(settings.nextReceivedTransaction)
    setSettings((s) => ({ ...s, nextReceivedTransaction: s.nextReceivedTransaction + 1 }))
    setRows((rs) =>
      rs.map((r, i) =>
        i === selectedIndex
          ? {
              ...r,
              statusCode: 'RECEIVED',
              iclRecCompanyCode: r.targetReceivedCompanyCode || '',
              iclRecTxn: txn,
              activeActivity: 'Received',
              dms: r.dms.uploaded ? { ...r.dms, finalized: true } : r.dms,
            }
          : r,
      ),
    )
    pushToast('ICL Received Transaction ' + txn + ' created successfully.', 'success')
    setStatus('ICL Received Transaction ' + txn + ' created successfully')
  }

  // --- DMS modal ---------------------------------------------------------------------

  function openDms() {
    if (selectedIndex < 0) {
      pushToast('Select one ICL request first.', 'warning')
      return
    }
    setActiveDmsIndex(selectedIndex)
    setPendingFile(null)
    setEditMode(false)
    setRows((rs) =>
      rs.map((r, i) => (i === selectedIndex && !r.dms.docDate ? { ...r, dms: { ...r.dms, docDate: formatDate(new Date()) } } : r)),
    )
    setDmsOpen(true)
  }

  function closeDms() {
    setDmsOpen(false)
    setPendingFile(null)
    setEditMode(false)
  }

  function handleFileSelected(file: File | null, path: string) {
    if (!file || activeDmsIndex < 0) return
    setPendingFile(file)
    setRows((rs) =>
      rs.map((r, i) =>
        i === activeDmsIndex
          ? {
              ...r,
              dms: {
                ...r.dms,
                fileName: file.name || 'Selected file',
                filePath: path || file.name || 'Selected file',
                uploaded: editMode ? false : r.dms.uploaded,
              },
            }
          : r,
      ),
    )
  }

  function uploadDms() {
    if (activeDmsIndex < 0) return
    const row = rows[activeDmsIndex]
    if (!row || row.dms.finalized) return
    if (!pendingFile) {
      pushToast('Select a file from File Path first.', 'warning')
      return
    }
    const dmsCode = row.dms.dmsCode || String(settings.nextDmsCode)
    if (!row.dms.dmsCode) setSettings((s) => ({ ...s, nextDmsCode: s.nextDmsCode + 1 }))
    uploadedFiles.current[activeDmsIndex] = pendingFile
    setRows((rs) => rs.map((r, i) => (i === activeDmsIndex ? { ...r, dms: { ...r.dms, uploaded: true, dmsCode } } : r)))
    setPendingFile(null)
    setEditMode(false)
    pushToast('Document uploaded. DMS Code ' + dmsCode + ' generated.', 'success')
  }

  function downloadDms() {
    if (activeDmsIndex < 0) return
    const row = rows[activeDmsIndex]
    const file = uploadedFiles.current[activeDmsIndex]
    if (!row || !row.dms.uploaded || !file) return
    const url = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = row.dms.fileName || 'ICL_Document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }

  function confirmDms() {
    if (activeDmsIndex < 0) return
    const row = rows[activeDmsIndex]
    if (!row || row.dms.finalized) return
    if (!row.dms.uploaded) {
      pushToast('Upload the document before confirming.', 'warning')
      return
    }
    const dmsCode = row.dms.dmsCode
    setRows((rs) => rs.map((r, i) => (i === activeDmsIndex ? { ...r, dms: { ...r.dms, finalized: true } } : r)))
    pushToast('Document Uploaded Successfully. Doc No: ' + dmsCode, 'success')
    setStatus('Document Uploaded Successfully. Doc No: ' + dmsCode)
  }

  // --- calendars -----------------------------------------------------------------------

  function toggleCalendar(target: CalendarTarget) {
    setCalendarOpenFor((current) => (current === target ? null : target))
  }

  function selectCalendarDate(target: CalendarTarget, formatted: string) {
    setCalendarOpenFor(null)
    if (target === 'uptoRequestDate') commitUptoValue(formatted)
    else updateFilter('plannedDate', formatted)
  }

  function clearCalendarDate(target: CalendarTarget) {
    setCalendarOpenFor(null)
    if (target === 'uptoRequestDate') commitUptoValue('')
    else updateFilter('plannedDate', '')
  }

  // --- global dismissal (outside click closes combos/calendars; Escape closes the modal) --

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeDms()
        setCalendarOpenFor(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function dismissPopups() {
    setOpenCombo(null)
    setCalendarOpenFor(null)
  }

  return (
    <div className="iclcreate" onClick={dismissPopups}>
      <div className="shell">
        <div className="topbar">
          <div className="topbar-inner">
            {/* The original topbar held only the title; Back/Sign out need side groups to sit
                in, so this reuses the page's own toolbar-left/toolbar-right utility classes. */}
            <div className="toolbar-left">
              <BackButton className="btn" />
              <div className="title">Create ICL Received</div>
            </div>
            <div className="toolbar-right" style={{ marginLeft: 'auto' }}>
              <SignOutButton className="btn" />
            </div>
          </div>
        </div>
        <div className="content">
          <div className="screen">
            <SelectionPanel
              uptoRequestDate={uptoText}
              onUptoChange={setUptoText}
              onUptoCommit={() => commitUptoValue(uptoText)}
              calendarOpenFor={calendarOpenFor}
              onToggleCalendar={toggleCalendar}
              onCalendarSelect={selectCalendarDate}
              onCalendarClear={clearCalendarDate}
              filterOpen={filterOpen}
              onToggleFilterBody={() => setFilterOpen((v) => !v)}
              filters={filters}
              onFilterChange={updateFilter}
              onPlannedDateCommit={commitPlannedDate}
              openCombo={openCombo}
              onComboFocus={(field) => setOpenCombo(field)}
              onComboToggle={(field) => setOpenCombo((current) => (current === field ? null : field))}
              onComboChoose={chooseCombo}
              comboValuesFor={comboValuesFor}
              onClearFilters={clearFilters}
            />
            <ResultsTable
              open={resultsOpen}
              columns={columns}
              pageRows={pageRows}
              totalRows={sortedRows.length}
              selectedIndex={selectedIndex}
              onSelectRow={setSelectedIndex}
              sort={sort}
              onSort={toggleSort}
              page={clampedPage}
              pageCount={pageCount}
              onPageChange={setPage}
              selectionLabel={selectionLabel}
              createDisabled={createDisabled}
              dmsDisabled={dmsDisabled}
              onCreateReceived={createReceived}
              onOpenDms={openDms}
            />
          </div>
        </div>
      </div>
      <DmsModal
        open={dmsOpen}
        row={activeDmsIndex >= 0 ? rows[activeDmsIndex] : undefined}
        pendingFileSelected={pendingFile !== null}
        onFilePathClick={() => setEditMode(false)}
        onEditClick={() => setEditMode(true)}
        onFileSelected={(file, path) => handleFileSelected(file, path)}
        onUpload={uploadDms}
        onDownload={downloadDms}
        onConfirm={confirmDms}
        onClose={closeDms}
      />
      <ToastRegion toasts={toasts} />
      <div className="statusbar">
        <span className="status-dot" />
        <span id="statusText">{status}</span>
      </div>
    </div>
  )
}
