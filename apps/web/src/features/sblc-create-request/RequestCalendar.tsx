import { useLayoutEffect, useRef, useState } from 'react'
import {
  MONTH_NAMES,
  SHORT_MONTH_NAMES,
  WEEKDAY_NAMES,
  formatDate,
  parseDate,
  sameDate,
} from './format.ts'

export type CalendarMode = 'days' | 'years'

type RequestCalendarProps = {
  rowId: string
  field: string
  /** The button that opened this popup, so the popup can anchor itself under it. */
  anchorEl: HTMLElement | null
  viewDate: Date
  viewYear: number
  mode: CalendarMode
  selectedText: string
  onPrevMonth: () => void
  onNextMonth: () => void
  onToggleMode: () => void
  onPickYear: (year: number) => void
  onPickMonth: (month: number) => void
  onPickDay: (dateText: string) => void
  onClear: () => void
  onToday: () => void
}

/**
 * The date popup the original placed with getBoundingClientRect + fixed positioning so it
 * never ran off the modal's edge. Re-measured on every open and every navigation, matching
 * placeRequestCalendar/renderRequestCalendar in the legacy script.
 */
export function RequestCalendar({
  rowId,
  anchorEl,
  viewDate,
  viewYear,
  mode,
  selectedText,
  onPrevMonth,
  onNextMonth,
  onToggleMode,
  onPickYear,
  onPickMonth,
  onPickDay,
  onClear,
  onToday,
}: RequestCalendarProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<{ left: number; top: number }>({ left: 0, top: 0 })

  useLayoutEffect(() => {
    const popup = popupRef.current
    if (!anchorEl || !popup) return
    const rect = anchorEl.getBoundingClientRect()
    const viewWidth = document.documentElement.clientWidth || document.body.clientWidth
    const viewHeight = document.documentElement.clientHeight || document.body.clientHeight
    const width = popup.offsetWidth || 274
    const height = popup.offsetHeight || 360
    let left = rect.left
    if (left + width > viewWidth - 12) left = Math.max(12, viewWidth - width - 12)
    let top = rect.bottom + 4
    if (top + height > viewHeight - 12) top = Math.max(12, rect.top - height - 4)
    setStyle({ left: Math.round(left), top: Math.round(top) })
  })

  const selected = parseDate(selectedText)

  return (
    <div
      ref={popupRef}
      className="request-calendar open"
      style={{ left: `${style.left}px`, top: `${style.top}px` }}
    >
      {mode === 'years' ? (
        <YearsView
          viewDate={viewDate}
          viewYear={viewYear}
          selected={selected}
          onToggleMode={onToggleMode}
          onPickYear={onPickYear}
          onPickMonth={onPickMonth}
        />
      ) : (
        <DaysView
          rowId={rowId}
          viewDate={viewDate}
          selected={selected}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onToggleMode={onToggleMode}
          onPickDay={onPickDay}
          onClear={onClear}
          onToday={onToday}
        />
      )}
    </div>
  )
}

type DaysViewProps = {
  rowId: string
  viewDate: Date
  selected: Date | null
  onPrevMonth: () => void
  onNextMonth: () => void
  onToggleMode: () => void
  onPickDay: (dateText: string) => void
  onClear: () => void
  onToday: () => void
}

function DaysView({
  viewDate,
  selected,
  onPrevMonth,
  onNextMonth,
  onToggleMode,
  onPickDay,
  onClear,
  onToday,
}: DaysViewProps) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const first = new Date(year, month, 1)
  const firstCell = new Date(year, month, 1 - first.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => {
    const cell = new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i)
    return cell
  })

  return (
    <>
      <div className="calendar-head">
        <button className="cal-title-btn" type="button" onClick={onToggleMode}>
          {MONTH_NAMES[month]} {year}
        </button>
        <div className="cal-navs">
          <button className="cal-nav cal-nav-up" type="button" onClick={onPrevMonth} />
          <button className="cal-nav cal-nav-down" type="button" onClick={onNextMonth} />
        </div>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAY_NAMES.map((name, i) => (
          // The weekday header repeats "Su" for both leading and trailing cells in the
          // original — index alone, not the label, is unique.
          <span key={i}>{name}</span>
        ))}
      </div>
      <div className="calendar-days">
        {cells.map((cell) => {
          const classes = ['calendar-day']
          if (cell.getMonth() !== month) classes.push('other-month')
          if (selected && sameDate(selected, cell)) classes.push('selected')
          return (
            <button
              key={cell.toISOString()}
              className={classes.join(' ')}
              type="button"
              onClick={() => onPickDay(formatDate(cell))}
            >
              {cell.getDate()}
            </button>
          )
        })}
      </div>
      <div className="calendar-foot">
        <button className="cal-link" type="button" onClick={onClear}>
          Clear
        </button>
        <button className="cal-link" type="button" onClick={onToday}>
          Today
        </button>
      </div>
    </>
  )
}

type YearsViewProps = {
  viewDate: Date
  viewYear: number
  selected: Date | null
  onToggleMode: () => void
  onPickYear: (year: number) => void
  onPickMonth: (month: number) => void
}

function YearsView({ viewDate, viewYear, selected, onToggleMode, onPickYear, onPickMonth }: YearsViewProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const month = viewDate.getMonth()
  const minYear = viewYear - 5
  const maxYear = viewYear + 8
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const active = panel?.querySelector<HTMLElement>('.year-row.active')
    if (panel && active) panel.scrollTop = Math.max(0, active.offsetTop - 34)
  })

  return (
    <>
      <div className="calendar-head">
        <button className="cal-title-btn" type="button" onClick={onToggleMode}>
          {MONTH_NAMES[month]} {viewYear}
        </button>
        <div className="cal-navs" />
      </div>
      <div className="year-panel" ref={panelRef}>
        {years.map((y) => (
          <div key={y} className={y === viewYear ? 'year-row active' : 'year-row'}>
            <button className="year-btn" type="button" onClick={() => onPickYear(y)}>
              {y}
            </button>
            {y === viewYear ? (
              <div className="month-grid">
                {SHORT_MONTH_NAMES.map((name, m) => {
                  const isSelected = !!selected && selected.getFullYear() === y && selected.getMonth() === m
                  return (
                    <button
                      key={name}
                      className={isSelected ? 'month-btn selected' : 'month-btn'}
                      type="button"
                      onClick={() => onPickMonth(m)}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  )
}
