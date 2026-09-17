import { useEffect, useMemo, useRef, useState } from 'react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { CompanyModal } from './CompanyModal.tsx'
import { ChargesModal } from './ChargesModal.tsx'
import { COLUMNS, COMPANIES, SBLC_ROWS, SETTINGS } from './data.ts'
import { DmsModal } from './DmsModal.tsx'
import { formatDate, parseDate } from './format.ts'
import { applySort, basicReady, companyByCode, FILTER_KEY_BY_COMBO, getFilteredRows, type ComboId, type Filters } from './logic.ts'
import { ResultsPanel } from './ResultsPanel.tsx'
import { SelectionPanel } from './SelectionPanel.tsx'
import { TerminationModal } from './TerminationModal.tsx'
import { ToastRegion } from './ToastRegion.tsx'
import type { DmsDoc, SblcRow, SortState, Toast, ToastKind } from './types.ts'
import './sblc-terminate.legacy.css'
// Night mode. Generated from the sheet above by tools/gen-dark-css.mjs; it only restates the
// colours that change, at a higher specificity, so it must be imported after it.
import './sblc-terminate.dark.css'

/** Deep-copies the seed rows so terminating or uploading in this session never mutates data.ts. */
function cloneRows(rows: SblcRow[]): SblcRow[] {
  return rows.map((row) => ({ ...row, dms: row.dms.map((doc) => ({ ...doc })) }))
}

export default function SblcTerminateApp() {
  const [rows, setRows] = useState<SblcRow[]>(() => cloneRows(SBLC_ROWS))

  const [companyCode, setCompanyCode] = useState('')
  const [keyDate, setKeyDate] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)
  const [statusText, setStatusText] = useState('Select Company Code and Key Date to load SBLC records')

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    transaction: '',
    requestType: '',
    termination: SETTINGS.defaultAdditionalSelection,
  })
  const [activeCombo, setActiveCombo] = useState<ComboId | ''>('')

  const [keyDateCalendarOpen, setKeyDateCalendarOpen] = useState(false)

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [sort, setSort] = useState<SortState>({ index: -1, direction: '' })
  const [page, setPage] = useState(1)

  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const [companySelection, setCompanySelection] = useState(-1)

  const [terminationModalOpen, setTerminationModalOpen] = useState(false)
  const [terminationDate, setTerminationDate] = useState('')
  const [terminationCalendarOpen, setTerminationCalendarOpen] = useState(false)
  const [pendingTerminationDate, setPendingTerminationDate] = useState('')
  const [chargesModalOpen, setChargesModalOpen] = useState(false)

  const [dmsModalOpen, setDmsModalOpen] = useState(false)
  const [activeDmsIndex, setActiveDmsIndex] = useState(-1)

  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)
  const nextDmsCodeRef = useRef(SETTINGS.nextDmsCode)

  function toast(message: string, kind: ToastKind) {
    const id = ++toastIdRef.current
    setToasts((t) => [...t, { id, kind, message }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }

  /** Mirrors loadResults(showMessage): both fields must resolve before the table opens. */
  function loadResults(showMessage: boolean) {
    setPage(1)
    setSelectedIndex(-1)
    const company = companyByCode(companyCode)
    if (!company) {
      if (showMessage) toast('Select a valid Company Code.', 'warning')
      setResultsOpen(false)
      setStatusText('Select Company Code and Key Date to load SBLC records')
      return
    }
    const date = parseDate(keyDate)
    if (!date) {
      if (showMessage) toast('Enter Key Date in DD-MM-YYYY format.', 'warning')
      setResultsOpen(false)
      setStatusText('Select Company Code and Key Date to load SBLC records')
      return
    }
    setCompanyCode(company.code)
    setKeyDate(formatDate(date))
    setResultsOpen(true)
    setStatusText('SBLC records loaded')
  }

  function refreshFilters() {
    if (!basicReady(companyCode, keyDate)) return
    setPage(1)
    setSelectedIndex(-1)
  }

  const filteredRows = useMemo(
    () => (resultsOpen ? getFilteredRows(rows, companyCode, filters) : []),
    [resultsOpen, rows, companyCode, filters],
  )
  const sortedRows = useMemo(() => applySort(filteredRows, COLUMNS[sort.index], sort.direction), [filteredRows, sort])
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / SETTINGS.pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageRows = useMemo(() => {
    const start = (Math.min(page, totalPages) - 1) * SETTINGS.pageSize
    return sortedRows.slice(start, start + SETTINGS.pageSize)
  }, [sortedRows, page, totalPages])

  const selectedRow = selectedIndex >= 0 ? (rows[selectedIndex] ?? null) : null

  function onSortColumn(columnIndex: number) {
    setSort((s) => (s.index === columnIndex ? { index: columnIndex, direction: s.direction === 'asc' ? 'desc' : 'asc' } : { index: columnIndex, direction: 'asc' }))
    setPage(1)
  }

  function onFilterChange(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }))
    refreshFilters()
  }

  function onChooseCombo(id: ComboId, value: string) {
    setFilters((f) => ({ ...f, [FILTER_KEY_BY_COMBO[id]]: value }))
    setActiveCombo('')
    refreshFilters()
  }

  function onClearFilters() {
    setFilters({ transaction: '', requestType: '', termination: SETTINGS.defaultAdditionalSelection })
    refreshFilters()
  }

  function selectCompanyByIndex(index: number) {
    const item = COMPANIES[index]
    if (!item) return
    setCompanyCode(item.code)
    setCompanyModalOpen(false)
    loadResults(false)
  }

  function confirmCompanySelection() {
    if (companySelection < 0) {
      toast('Select a company code first.', 'warning')
      return
    }
    selectCompanyByIndex(companySelection)
  }

  function openTermination() {
    if (!selectedRow) {
      toast('Select one SBLC record first.', 'warning')
      return
    }
    if (selectedRow.terminationState === 'TERMINATED') {
      toast('The selected SBLC record is already terminated.', 'warning')
      return
    }
    setTerminationDate('')
    setTerminationModalOpen(true)
  }

  function closeTermination() {
    setTerminationModalOpen(false)
    setTerminationCalendarOpen(false)
    setPendingTerminationDate('')
  }

  function updateTermination() {
    const date = parseDate(terminationDate)
    if (!date) {
      toast('Enter the termination date in DD-MM-YYYY format.', 'warning')
      return
    }
    setPendingTerminationDate(formatDate(date))
    setTerminationModalOpen(false)
    setChargesModalOpen(true)
  }

  function closeCharges() {
    setChargesModalOpen(false)
    setPendingTerminationDate('')
  }

  function terminateSelected() {
    if (selectedIndex < 0 || !pendingTerminationDate) {
      closeCharges()
      return
    }
    const requestNo = rows[selectedIndex]?.sblcRequestNumber ?? ''
    setRows((prev) =>
      prev.map((row, i) =>
        i === selectedIndex
          ? { ...row, terminationState: 'TERMINATED', sblcInitiateTermination: 'Terminated', sblcTerminationDate: pendingTerminationDate }
          : row,
      ),
    )
    setChargesModalOpen(false)
    setPendingTerminationDate('')
    setSelectedIndex(-1)
    toast(`SBLC Request ${requestNo} terminated successfully.`, 'success')
    setStatusText(`SBLC Request ${requestNo} terminated successfully`)
  }

  function openDms() {
    if (!selectedRow) {
      toast('Select one SBLC record first.', 'warning')
      return
    }
    setActiveDmsIndex(selectedIndex)
    setDmsModalOpen(true)
  }

  function closeDms() {
    setDmsModalOpen(false)
    setActiveDmsIndex(-1)
  }

  function onUpdateDoc(rowIndex: number, docIndex: number, patch: Partial<DmsDoc>) {
    setRows((prev) =>
      prev.map((row, ri) =>
        ri !== rowIndex ? row : { ...row, dms: row.dms.map((doc, di) => (di !== docIndex ? doc : { ...doc, ...patch })) },
      ),
    )
  }

  function onNextDmsCode(): string {
    const code = String(nextDmsCodeRef.current)
    nextDmsCodeRef.current += 1
    return code
  }

  return (
    <div className="sblcterminate">
      <div className="shell">
        <div className="topbar">
          <div className="topbar-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BackButton className="btn" />
              <div className="title">SBLC: Initiate Termination</div>
            </div>
            <SignOutButton className="btn" />
          </div>
        </div>
        <div className="content">
          <div className="screen">
            <SelectionPanel
              companyCode={companyCode}
              onCompanyChange={setCompanyCode}
              onCompanyCommit={() => {
                setCompanyCode((c) => c.toUpperCase())
                loadResults(true)
              }}
              onOpenCompanyModal={() => {
                setCompanySelection(-1)
                setCompanyModalOpen(true)
              }}
              keyDate={keyDate}
              onKeyDateChange={setKeyDate}
              onKeyDateBlur={() => loadResults(true)}
              onKeyDateCalendarSelect={(value) => {
                setKeyDate(value)
                loadResults(false)
              }}
              keyDateCalendarOpen={keyDateCalendarOpen}
              onToggleKeyDateCalendar={() => setKeyDateCalendarOpen((o) => !o)}
              onCloseKeyDateCalendar={() => setKeyDateCalendarOpen(false)}
              filterOpen={filterOpen}
              onToggleFilter={() => setFilterOpen((o) => !o)}
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              activeCombo={activeCombo}
              onOpenCombo={setActiveCombo}
              onCloseCombo={() => setActiveCombo('')}
              onChooseCombo={onChooseCombo}
              rows={rows}
            />
            <ResultsPanel
              open={resultsOpen}
              columns={COLUMNS}
              recordCount={sortedRows.length}
              keyDate={keyDate}
              terminateDisabled={!selectedRow || selectedRow.terminationState === 'TERMINATED'}
              dmsDisabled={!selectedRow}
              onTerminateClick={openTermination}
              onDmsClick={openDms}
              sort={sort}
              onSortColumn={onSortColumn}
              pageRows={pageRows}
              selectedIndex={selectedIndex}
              onSelectRow={setSelectedIndex}
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <CompanyModal
        open={companyModalOpen}
        companies={COMPANIES}
        selection={companySelection}
        onSelectRow={setCompanySelection}
        onConfirmRow={selectCompanyByIndex}
        onClose={() => setCompanyModalOpen(false)}
        onConfirm={confirmCompanySelection}
      />

      <DmsModal
        open={dmsModalOpen}
        row={activeDmsIndex >= 0 ? (rows[activeDmsIndex] ?? null) : null}
        rowIndex={activeDmsIndex}
        onClose={closeDms}
        onUpdateDoc={onUpdateDoc}
        onNextDmsCode={onNextDmsCode}
        onToast={toast}
        onStatus={setStatusText}
      />

      <TerminationModal
        open={terminationModalOpen}
        date={terminationDate}
        onDateChange={setTerminationDate}
        calendarOpen={terminationCalendarOpen}
        onToggleCalendar={() => setTerminationCalendarOpen((o) => !o)}
        onCloseCalendar={() => setTerminationCalendarOpen(false)}
        onClose={closeTermination}
        onUpdate={updateTermination}
      />

      <ChargesModal open={chargesModalOpen} onClose={closeCharges} onConfirm={terminateSelected} />

      <ToastRegion toasts={toasts} />

      <div className="statusbar">
        <span className="status-dot" />
        <span id="statusText">{statusText}</span>
      </div>
    </div>
  )
}
