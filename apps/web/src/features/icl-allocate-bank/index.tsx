import { useEffect, useMemo, useState } from 'react'
import { BackButton } from '../../auth/BackButton.tsx'
import { SignOutButton } from '../../auth/SignOutButton.tsx'
import { AccountModal, type AccountRow } from './AccountModal.tsx'
import { BankAllocationModal } from './BankAllocationModal.tsx'
import { COLUMNS } from './columns.ts'
import { BANK_ACCOUNTS, REQUESTS, SETTINGS } from './data.ts'
import { FilterPanel, type OpenCalendar } from './FilterPanel.tsx'
import { filterRequests, formatInputDate, parseDate, sortRequests } from './helpers.ts'
import { HouseBankModal } from './HouseBankModal.tsx'
import { MessageLog } from './MessageLog.tsx'
import { RejectModal } from './RejectModal.tsx'
import { RequestTable } from './RequestTable.tsx'
import type { BankAccount, IclRequest, SortState, ToastItem, ToastKind } from './types.ts'
import { ToastRegion } from './ToastRegion.tsx'
import './icl-allocate-bank.legacy.css'
// Night mode. Generated from the sheet above by tools/gen-dark-css.mjs; it only restates the
// colours that change, at a higher specificity, so it must be imported after it.
import './icl-allocate-bank.dark.css'

let toastSeq = 0

/** Company code of a target set, or "MULTIPLE" once any two disagree — the original's `selectedCompany`. */
function selectedCompany(targets: readonly IclRequest[]): string {
  const company = targets[0]?.companyCode ?? ''
  return targets.some((t) => t.companyCode !== company) ? 'MULTIPLE' : company
}

export default function IclAllocateBankApp() {
  // The requests list is mutated in place by approve/reject, exactly as the original edits
  // its DATA.requests objects directly; everything else here is UI-only state.
  const [requests, setRequests] = useState<IclRequest[]>(() => REQUESTS.map((r) => ({ ...r })))
  const [nextTxn, setNextTxn] = useState(SETTINGS.nextIclGivenTransaction)

  const [uptoRequestDate, setUptoRequestDate] = useState('')
  const [requestTypeFilter, setRequestTypeFilter] = useState(SETTINGS.defaultRequestType)
  const [requestFrom, setRequestFrom] = useState('')
  const [startFrom, setStartFrom] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [openCalendar, setOpenCalendar] = useState<OpenCalendar>(null)

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState>({ index: -1, direction: '' })

  const [screen, setScreen] = useState<'request' | 'message'>('request')
  const [statusText, setStatusText] = useState('Enter an Up to Request Date to load ICL requests')
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [approvalTargets, setApprovalTargets] = useState<IclRequest[]>([])
  const [selectedHouseBank, setSelectedHouseBank] = useState('')
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(-1)

  const [houseBankModalOpen, setHouseBankModalOpen] = useState(false)
  const [houseBankSearch, setHouseBankSearch] = useState('')
  const [houseBankPick, setHouseBankPick] = useState('')

  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [accountSearch, setAccountSearch] = useState('')
  const [accountPick, setAccountPick] = useState(-1)

  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  function pushToast(message: string, kind: ToastKind) {
    toastSeq += 1
    const id = toastSeq
    setToasts((current) => [...current, { id, kind, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 4200)
  }

  const hasDate = !!parseDate(uptoRequestDate)

  const filteredRows = useMemo(
    () =>
      filterRequests(requests, {
        uptoRequestDate,
        requestType: requestTypeFilter,
        requestNo: requestFrom,
        startDate: startFrom,
      }),
    [requests, uptoRequestDate, requestTypeFilter, requestFrom, startFrom],
  )
  const sortedRows = useMemo(() => sortRequests(filteredRows, sort, COLUMNS), [filteredRows, sort])

  const pageSize = SETTINGS.pageSize
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const clampedPage = Math.min(page, pageCount)
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage)
  }, [page, clampedPage])
  const pageStart = (clampedPage - 1) * pageSize
  const pageRows = sortedRows.slice(pageStart, pageStart + pageSize)

  const selectedRowsList = requests.filter((r) => selected[r.requestNo])
  const hasApprovedSelected = selectedRowsList.some((r) => r.statusCode === 'APPROVED')
  const approveDisabled = requestTypeFilter === 'Issued' || hasApprovedSelected

  // Mirrors the original's updateApproveButtons() warning, fired once per selection that
  // includes an already-approved row rather than on every re-render.
  useEffect(() => {
    if (hasApprovedSelected && selectedRowsList.length > 0) {
      pushToast('Approved requests cannot be approved again', 'warning')
    }
    // Only the transition matters, not the row identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApprovedSelected])

  function clearSelection() {
    setSelected({})
  }

  function resetPaging() {
    setPage(1)
    clearSelection()
  }

  function commitUptoDate(raw: string) {
    resetPaging()
    if (!raw) {
      setUptoRequestDate(raw)
      setStatusText('Enter an Up to Request Date to load ICL requests')
      return
    }
    const date = parseDate(raw)
    if (!date) {
      setUptoRequestDate(raw)
      pushToast('Enter the date in DD-MM-YYYY format.', 'warning')
      setStatusText('Invalid Up to Request Date')
      return
    }
    setUptoRequestDate(formatInputDate(date))
    setStatusText('ICL requests loaded')
  }

  function commitStartFrom(raw: string) {
    const date = parseDate(raw)
    setStartFrom(date ? formatInputDate(date) : raw)
    resetPaging()
  }

  function toggleRow(requestNo: string) {
    setSelected((current) => {
      const next = { ...current }
      if (next[requestNo]) delete next[requestNo]
      else next[requestNo] = true
      return next
    })
  }

  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected[r.requestNo])
  function toggleAll() {
    const value = !allChecked
    setSelected((current) => {
      const next = { ...current }
      for (const row of pageRows) {
        if (value) next[row.requestNo] = true
        else delete next[row.requestNo]
      }
      return next
    })
  }

  function onSort(index: number) {
    setSort((current) =>
      current.index === index
        ? { index, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { index, direction: 'asc' },
    )
    setPage(1)
  }

  function onPage(target: number | 'prev' | 'next') {
    if (target === 'prev') setPage((p) => Math.max(1, p - 1))
    else if (target === 'next') setPage((p) => Math.min(pageCount, p + 1))
    else setPage(target)
  }

  function clearFilters() {
    setRequestTypeFilter(SETTINGS.defaultRequestType)
    setRequestFrom('')
    setStartFrom('')
    resetPaging()
  }

  function openApproval(targets: IclRequest[]) {
    if (!targets.length) return
    setApprovalTargets(targets)
    setSelectedHouseBank('')
    setSelectedAccountIndex(-1)
    setBankModalOpen(true)
  }

  function openSingleApproval() {
    if (selectedRowsList.length !== 1) {
      pushToast('Select exactly one ICL request to approve.', 'warning')
      return
    }
    if (selectedRowsList[0]?.statusCode === 'APPROVED') {
      pushToast('Approved requests cannot be approved again', 'warning')
      return
    }
    openApproval([selectedRowsList[0] as IclRequest])
  }

  function openApproveAll() {
    const rows = selectedRowsList.length ? selectedRowsList : sortedRows.slice()
    if (!rows.length) {
      pushToast('There are no ICL requests available to approve.', 'warning')
      return
    }
    if (rows.some((r) => r.statusCode === 'APPROVED')) {
      pushToast('Approved requests cannot be approved again', 'warning')
      return
    }
    openApproval(rows)
  }

  function openReject() {
    if (selectedRowsList.length !== 1) {
      pushToast('Select exactly one ICL request to reject.', 'warning')
      return
    }
    setRejectModalOpen(true)
  }

  function rejectSelected() {
    const target = selectedRowsList[0]
    setRejectModalOpen(false)
    if (!target) return
    setRequests((current) =>
      current.map((r) =>
        r.requestNo === target.requestNo
          ? { ...r, statusCode: 'REJECTED', statusDescription: '03 - Rejected' }
          : r,
      ),
    )
    clearSelection()
    pushToast(`ICL Request ${target.requestNo} rejected.`, 'success')
    setStatusText('ICL Request rejected')
  }

  function openHouseBankLookup() {
    setHouseBankPick('')
    setHouseBankSearch('')
    setHouseBankModalOpen(true)
  }

  const houseBankRows = useMemo(() => {
    const company = selectedCompany(approvalTargets)
    const seen = new Set<string>()
    const rows: BankAccount[] = []
    for (const item of BANK_ACCOUNTS) {
      if (company !== 'MULTIPLE' && item.companyCode !== company) continue
      const key = `${item.companyCode}|${item.houseBank}`
      if (seen.has(key)) continue
      seen.add(key)
      rows.push(item)
    }
    return rows
  }, [approvalTargets])

  function selectHouseBank(houseBank: string) {
    if (!houseBank) return
    setSelectedHouseBank(houseBank)
    setSelectedAccountIndex(-1)
    setHouseBankModalOpen(false)
  }

  function openAccountLookup() {
    if (!selectedHouseBank) {
      pushToast('Select a House Bank first.', 'warning')
      return
    }
    setAccountPick(-1)
    setAccountSearch('')
    setAccountModalOpen(true)
  }

  const accountRows: AccountRow[] = useMemo(() => {
    const company = selectedCompany(approvalTargets)
    const rows: AccountRow[] = []
    BANK_ACCOUNTS.forEach((item, index) => {
      if (item.houseBank !== selectedHouseBank) return
      if (company !== 'MULTIPLE' && item.companyCode !== company) return
      rows.push({ index, item })
    })
    return rows
  }, [approvalTargets, selectedHouseBank])

  function selectAccount(index: number) {
    if (!BANK_ACCOUNTS[index]) return
    setSelectedAccountIndex(index)
    setAccountModalOpen(false)
  }

  function approveTargets() {
    const account = BANK_ACCOUNTS[selectedAccountIndex]
    if (!selectedHouseBank) {
      pushToast('Select a House Bank before creating the ICL.', 'warning')
      return
    }
    if (!account) {
      pushToast('Select an Account ID before creating the ICL.', 'warning')
      return
    }
    const targetNos = new Set(approvalTargets.map((t) => t.requestNo))
    const transactions: string[] = []
    let txnCounter = nextTxn
    setRequests((current) =>
      current.map((row) => {
        if (!targetNos.has(row.requestNo)) return row
        let iclGivenTxn = row.iclGivenTxn
        if (!iclGivenTxn) {
          iclGivenTxn = String(txnCounter)
          txnCounter += 1
        }
        transactions.push(iclGivenTxn)
        return {
          ...row,
          statusCode: 'APPROVED',
          statusDescription: '02 - Approved by TSF Manager',
          partnerBankId: account.partnerBankId,
          iclGivenTxn,
        }
      }),
    )
    setNextTxn(txnCounter)
    setBankModalOpen(false)
    clearSelection()
    const message =
      approvalTargets.length === 1
        ? `ICL Request ${approvalTargets[0]?.requestNo} created successfully. Transaction ${transactions[0]}.`
        : `${approvalTargets.length} ICL requests created successfully. Transactions: ${transactions.join(', ')}.`
    pushToast(message, 'success')
    setStatusText(message)
  }

  const pageTitle = screen === 'message' ? 'Message Log' : 'View Pending ICL Requests & Allocate Bank'
  const recordCount = hasDate ? `${sortedRows.length} request${sortedRows.length === 1 ? '' : 's'} found` : ''

  return (
    <div className="iclallocate">
      <div className="shell">
        <div className="topbar">
          <div className="topbar-inner">
            {/* The original header held only the title; Back and Sign out need groups to
                sit in, so each side of the existing space-between row gets one. */}
            <div className="toolbar-left">
              <BackButton />
              <div id="pageTitle" className="title">
                {pageTitle}
              </div>
            </div>
            <div className="toolbar-right">
              <SignOutButton />
            </div>
          </div>
        </div>
        <div className="content">
          <div id="requestScreen" className={screen === 'request' ? 'screen active' : 'screen'}>
            <FilterPanel
              uptoRequestDate={uptoRequestDate}
              onUptoChange={setUptoRequestDate}
              onUptoCommit={commitUptoDate}
              filterOpen={filterOpen}
              onFilterToggle={() => setFilterOpen((v) => !v)}
              openCalendar={openCalendar}
              onCalendarToggle={setOpenCalendar}
              requestType={requestTypeFilter}
              onRequestTypeChange={(value) => {
                setRequestTypeFilter(value)
                resetPaging()
              }}
              requestFrom={requestFrom}
              onRequestFromChange={(value) => {
                setRequestFrom(value)
                resetPaging()
              }}
              startFrom={startFrom}
              onStartFromChange={setStartFrom}
              onStartFromCommit={commitStartFrom}
              onClearFilters={clearFilters}
            />
            <RequestTable
              resultsOpen={hasDate}
              recordCount={recordCount}
              onApprove={openSingleApproval}
              onReject={openReject}
              onApproveAll={openApproveAll}
              approveDisabled={approveDisabled}
              selectionCount={selectedRowsList.length}
              rows={pageRows}
              hasDate={hasDate}
              selected={selected}
              onToggleRow={toggleRow}
              allChecked={allChecked}
              onToggleAll={toggleAll}
              sort={sort}
              onSort={onSort}
              page={clampedPage}
              pageCount={pageCount}
              onPage={onPage}
            />
          </div>
          <MessageLog active={screen === 'message'} logRows={[]} onBack={() => setScreen('request')} />
        </div>
      </div>
      <BankAllocationModal
        open={bankModalOpen}
        houseBankValue={selectedHouseBank}
        accountIdValue={BANK_ACCOUNTS[selectedAccountIndex]?.accountId ?? ''}
        accountEnabled={!!selectedHouseBank}
        onClose={() => setBankModalOpen(false)}
        onOpenHouseBank={openHouseBankLookup}
        onOpenAccount={openAccountLookup}
        onCreate={approveTargets}
      />
      <HouseBankModal
        open={houseBankModalOpen}
        rows={houseBankRows}
        search={houseBankSearch}
        onSearchChange={setHouseBankSearch}
        picked={houseBankPick}
        onPick={setHouseBankPick}
        onPickConfirm={() => selectHouseBank(houseBankPick)}
        onPickAndConfirm={selectHouseBank}
        onClose={() => setHouseBankModalOpen(false)}
      />
      <AccountModal
        open={accountModalOpen}
        rows={accountRows}
        search={accountSearch}
        onSearchChange={setAccountSearch}
        picked={accountPick}
        onPick={setAccountPick}
        onPickConfirm={() => selectAccount(accountPick)}
        onPickAndConfirm={selectAccount}
        onClose={() => setAccountModalOpen(false)}
      />
      <RejectModal
        open={rejectModalOpen}
        requestNo={selectedRowsList[0]?.requestNo ?? ''}
        onCancel={() => setRejectModalOpen(false)}
        onConfirm={rejectSelected}
      />
      <ToastRegion toasts={toasts} />
      <div className="statusbar">
        <span className="status-dot" />
        <span id="statusText">{statusText}</span>
      </div>
    </div>
  )
}
