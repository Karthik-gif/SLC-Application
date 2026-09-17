import { useEffect, useMemo, useRef, useState } from 'react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { BasicSelection } from './BasicSelection.tsx'
import { SBLC_COLUMNS } from './data.ts'
import { formatDate, parseAmountValue, parseDate } from './format.ts'
import {
  EMPTY_FILTERS,
  applyDisplayDefaults,
  filterRecords,
  initialDrafts,
  newRequestDraft,
  nextRequestNumber,
  recordHasRequest,
  requiredFieldsMissing,
  sortRecords,
  structureOptions,
  withCreatedRequest,
} from './records.ts'
import { RequestModal } from './RequestModal.tsx'
import { ResultsTable } from './ResultsTable.tsx'
import { ToastRegion } from './Toast.tsx'
import { SBLC_RECORDS } from './data.ts'
import type {
  CalendarState,
  DateField,
  DraftTextField,
  FilterKey,
  RequestDraft,
  SblcRecord,
  SortState,
  Toast,
} from './types.ts'
import './sblc-create-request.legacy.css'

const PAGE_SIZE = 15
const TOAST_LIFETIME_MS = 4200

/** Adds one month to a copy of the given date, matching the original's Date#setMonth roll-over. */
function shiftMonth(date: Date, delta: number): Date {
  const next = new Date(date)
  next.setMonth(next.getMonth() + delta)
  return next
}

function withYear(date: Date, year: number): Date {
  const next = new Date(date)
  next.setFullYear(year)
  return next
}

export default function SblcCreateRequestApp() {
  const [records, setRecords] = useState<SblcRecord[]>(() => applyDisplayDefaults(SBLC_RECORDS))
  const [structure, setStructure] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [openCombo, setOpenCombo] = useState<FilterKey | null>(null)
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [statusText, setStatusText] = useState('Select TSF Structure')

  const [modalOpen, setModalOpen] = useState(false)
  const [activeRecordId, setActiveRecordId] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<RequestDraft[]>([])
  const draftSeqRef = useRef(1)

  const [calendar, setCalendar] = useState<CalendarState | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastSeqRef = useRef(1)

  const readyToLoad = structure !== ''
  const structures = useMemo(() => structureOptions(records), [records])

  const filteredRows = useMemo(
    () => filterRecords(records, structure, filters),
    [records, structure, filters],
  )
  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows
    const column = SBLC_COLUMNS[sort.index]
    return column ? sortRecords(filteredRows, column, sort.direction) : filteredRows
  }, [filteredRows, sort])

  const pages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const effectivePage = Math.min(page, pages)
  const pageStart = (effectivePage - 1) * PAGE_SIZE
  const pageRows = sortedRows.slice(pageStart, pageStart + PAGE_SIZE)

  const selectedRecord = records.find((r) => r.id === selectedId) ?? null
  const activeRecord = records.find((r) => r.id === activeRecordId) ?? null

  const selectionMeta = !selectedRecord
    ? 'Select one line item'
    : recordHasRequest(selectedRecord)
      ? 'Request already created'
      : '1 line item selected'

  function pushToast(message: string, title?: string, icon?: string) {
    const toast: Toast = { id: toastSeqRef.current, title: title || 'Success', icon: icon || 'OK', message }
    toastSeqRef.current += 1
    setToasts((prev) => [...prev, toast])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, TOAST_LIFETIME_MS)
  }

  function clearSelection() {
    setSelectedId(null)
  }

  function resetAfterFilterChange() {
    setPage(1)
    clearSelection()
  }

  function handleStructureChange(value: string) {
    setStructure(value)
    setFilters(EMPTY_FILTERS)
    setOpenCombo(null)
    setPage(1)
    clearSelection()
    setStatusText(value ? 'SBLC request records loaded' : 'Select TSF Structure')
  }

  function handleFilterChange(key: FilterKey, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    resetAfterFilterChange()
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS)
    setOpenCombo(null)
    resetAfterFilterChange()
  }

  function handleSort(index: number) {
    setSort((current) =>
      current && current.index === index
        ? { index, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { index, direction: 'asc' },
    )
    setPage(1)
    clearSelection()
  }

  function handlePage(next: number) {
    setPage(next)
    clearSelection()
  }

  function openRequestModal() {
    if (!selectedRecord) return
    const usedBlankLine = !recordHasRequest(selectedRecord)
    draftSeqRef.current = usedBlankLine ? 2 : 1
    setDrafts(initialDrafts(selectedRecord, 1))
    setActiveRecordId(selectedRecord.id)
    setCalendar(null)
    setModalOpen(true)
  }

  function closeRequestModal() {
    setCalendar(null)
    setModalOpen(false)
    setActiveRecordId(null)
    setDrafts([])
  }

  function addRequestRow() {
    if (!activeRecord) return
    setCalendar(null)
    const id = `N${draftSeqRef.current}`
    draftSeqRef.current += 1
    setDrafts((prev) => [...prev, newRequestDraft(activeRecord, prev, id)])
  }

  function handleDraftFieldChange(rowId: string, field: DraftTextField, value: string) {
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === rowId && !draft.requestNo ? { ...draft, [field]: value } : draft)),
    )
  }

  function handleAmountConvert(rowId: string, value: string) {
    const amount = parseAmountValue(value)
    if (amount === null) return
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === rowId && !draft.requestNo ? { ...draft, amount } : draft)),
    )
  }

  function handleTypeChange(rowId: string, requestType: string) {
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === rowId && !draft.requestNo ? { ...draft, requestType } : draft)),
    )
  }

  function handleCreateRequest(rowId: string) {
    const record = activeRecord
    const draft = drafts.find((d) => d.id === rowId)
    if (!record || !draft || draft.requestNo) return
    const missing = requiredFieldsMissing(draft)
    if (missing.length) {
      pushToast(`Please fill ${missing.join(', ')} before creating the request.`, 'Information', 'i')
      setStatusText('Please fill all required request fields')
      return
    }
    const amount = parseAmountValue(draft.amount) ?? draft.amount
    const requestNo = nextRequestNumber(records)
    const completedDraft: RequestDraft = { ...draft, amount, requestNo }
    setDrafts((prev) => prev.map((d) => (d.id === rowId ? completedDraft : d)))
    setRecords((prev) =>
      prev.map((r) => (r.id === record.id ? withCreatedRequest(r, completedDraft, requestNo) : r)),
    )
    pushToast(`Request No ${requestNo} created successfully.`)
    setStatusText(`Request No ${requestNo} created successfully`)
  }

  function openCalendar(rowId: string, field: DateField) {
    const draft = drafts.find((d) => d.id === rowId)
    const parsed = draft ? parseDate(draft[field]) : null
    const viewDate = parsed ?? new Date()
    setCalendar({ rowId, field, mode: 'days', viewDate, viewYear: viewDate.getFullYear() })
  }

  function calendarPrevMonth() {
    setCalendar((c) => (c ? { ...c, viewDate: shiftMonth(c.viewDate, -1), viewYear: shiftMonth(c.viewDate, -1).getFullYear() } : c))
  }

  function calendarNextMonth() {
    setCalendar((c) => (c ? { ...c, viewDate: shiftMonth(c.viewDate, 1), viewYear: shiftMonth(c.viewDate, 1).getFullYear() } : c))
  }

  function calendarToggleMode() {
    setCalendar((c) => (c ? { ...c, mode: c.mode === 'days' ? 'years' : 'days', viewYear: c.viewDate.getFullYear() } : c))
  }

  function calendarPickYear(year: number) {
    setCalendar((c) => (c ? { ...c, viewYear: year, viewDate: withYear(c.viewDate, year), mode: 'years' } : c))
  }

  function calendarPickMonth(month: number) {
    setCalendar((c) => (c ? { ...c, viewDate: new Date(c.viewYear, month, 1), mode: 'days' } : c))
  }

  function calendarPickDay(dateText: string) {
    if (!calendar) return
    handleDraftFieldChange(calendar.rowId, calendar.field, dateText)
    setCalendar(null)
  }

  function calendarClear() {
    if (!calendar) return
    handleDraftFieldChange(calendar.rowId, calendar.field, '')
    setCalendar(null)
  }

  function calendarToday() {
    if (!calendar) return
    handleDraftFieldChange(calendar.rowId, calendar.field, formatDate(new Date()))
    setCalendar(null)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpenCombo(null)
      setCalendar(null)
      closeRequestModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sblccreate">
      <div className="shell">
        <div className="topbar">
          <div className="topbar-inner">
            <BackButton className="btn" />
            <div className="title">Create SBLC Request</div>
            <SignOutButton className="btn" />
          </div>
        </div>
        <div className="content">
          <div className="screen">
            <BasicSelection
              records={records}
              structures={structures}
              structure={structure}
              filters={filters}
              filtersOpen={filtersOpen}
              openCombo={openCombo}
              onStructureChange={handleStructureChange}
              onFilterChange={handleFilterChange}
              onFiltersOpenChange={setFiltersOpen}
              onOpenComboChange={setOpenCombo}
              onClearFilters={handleClearFilters}
            />
            {readyToLoad ? (
              <ResultsTable
                open={readyToLoad}
                rows={sortedRows}
                pageRows={pageRows}
                page={effectivePage}
                pages={pages}
                sort={sort}
                selectedId={selectedId}
                selectionMeta={selectionMeta}
                onSort={handleSort}
                onSelect={setSelectedId}
                onPage={handlePage}
                onCreateRequest={openRequestModal}
              />
            ) : (
              <div id="resultsArea" />
            )}
          </div>
        </div>
      </div>
      <RequestModal
        open={modalOpen}
        record={activeRecord}
        drafts={drafts}
        calendar={calendar}
        onClose={closeRequestModal}
        onAddRow={addRequestRow}
        onFieldChange={handleDraftFieldChange}
        onAmountConvert={handleAmountConvert}
        onTypeChange={handleTypeChange}
        onCreateRequest={handleCreateRequest}
        onOpenCalendar={openCalendar}
        onPrevMonth={calendarPrevMonth}
        onNextMonth={calendarNextMonth}
        onToggleMode={calendarToggleMode}
        onPickYear={calendarPickYear}
        onPickMonth={calendarPickMonth}
        onPickDay={calendarPickDay}
        onClearDate={calendarClear}
        onToday={calendarToday}
      />
      <ToastRegion toasts={toasts} />
      <div className="statusbar">
        <span className="status-dot" />
        <span id="statusText">{statusText}</span>
      </div>
    </div>
  )
}
