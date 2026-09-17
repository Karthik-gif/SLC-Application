import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { formatDateDigits, formatDateParts, parseDateParts } from './dates.ts'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const DOW_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

type CalendarProps = {
  /** The field the popup is anchored to and writes back into. */
  anchor: HTMLElement | null
  value: string
  onPick: (value: string) => void
}

/**
 * The original's calendar: a day grid that flips to a month/year chooser, positioned
 * against the field with `position:fixed` so it is never clipped by the table's scroller.
 * It is reproduced rather than swapped for `<input type="date">` because the generated
 * stylesheet carries all of its classes and the native picker looks nothing like it.
 */
function CalendarPopup({ anchor, value, onPick }: CalendarProps) {
  const selected = parseDateParts(value)
  const today = new Date()
  const popupRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState(() => ({
    year: selected ? selected.year : today.getFullYear(),
    month: selected ? selected.month : today.getMonth(),
  }))
  const [mode, setMode] = useState<'day' | 'monthYear'>('day')
  const [box, setBox] = useState({ left: 0, top: 0 })

  // Measured after paint: the popup's height depends on which view is showing and on how
  // many week rows the month needs, so a fixed estimate would flip it the wrong way.
  useLayoutEffect(() => {
    const popup = popupRef.current
    if (!popup || !anchor) return
    const rect = anchor.getBoundingClientRect()
    const width = popup.offsetWidth || 236
    const height = popup.offsetHeight || 300
    const margin = 8
    let left = rect.left
    if (left + width > window.innerWidth - margin) left = window.innerWidth - width - margin
    if (left < margin) left = margin
    let top = rect.bottom + 4
    if (top + height > window.innerHeight - margin) {
      const above = rect.top - height - 4
      top = above < margin ? margin : above
    }
    setBox((current) => (current.left === left && current.top === top ? current : { left, top }))
  }, [anchor, mode, view])

  function stepMonth(delta: number) {
    setView((current) => {
      const month = current.month + delta
      if (month < 0) return { year: current.year - 1, month: 11 }
      if (month > 11) return { year: current.year + 1, month: 0 }
      return { year: current.year, month }
    })
  }

  if (mode === 'monthYear') {
    const years: number[] = []
    for (let year = view.year + 1; year <= view.year + 14; year += 1) years.push(year)
    return (
      <div className="date-cal-popup" ref={popupRef} style={{ left: box.left, top: box.top }}>
        <div className="cal-year-anchor" onClick={() => setMode('day')}>{view.year}</div>
        <div className="cal-month-grid">
          {MONTH_SHORT_NAMES.map((name, index) => (
            <button
              key={name}
              type="button"
              className={`cal-month-cell${index === view.month ? ' selected' : ''}`}
              onClick={() => {
                setView((current) => ({ ...current, month: index }))
                setMode('day')
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="cal-year-list">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className="cal-year-row"
              onClick={() => setView((current) => ({ ...current, year }))}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const startDow = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const daysInPrevMonth = new Date(view.year, view.month, 0).getDate()
  const leading: number[] = []
  for (let i = 0; i < startDow; i += 1) leading.push(daysInPrevMonth - startDow + 1 + i)
  const days: number[] = []
  for (let day = 1; day <= daysInMonth; day += 1) days.push(day)
  const trailingCount = (7 - ((startDow + daysInMonth) % 7)) % 7
  const trailing: number[] = []
  for (let i = 1; i <= trailingCount; i += 1) trailing.push(i)

  return (
    <div className="date-cal-popup" ref={popupRef} style={{ left: box.left, top: box.top }}>
      <div className="date-cal-head">
        <button type="button" className="cal-month-toggle" onClick={() => setMode('monthYear')}>
          {MONTH_NAMES[view.month]} {view.year} <span className="cal-caret">{'▾'}</span>
        </button>
        <span className="date-cal-nav">
          <button type="button" onClick={() => stepMonth(-1)}>{'▲'}</button>
          <button type="button" onClick={() => stepMonth(1)}>{'▼'}</button>
        </span>
      </div>
      <div className="date-cal-grid">
        {DOW_NAMES.map((dow) => (
          <div className="dow" key={dow}>{dow}</div>
        ))}
        {leading.map((day) => (
          <button type="button" className="day other-month" disabled key={`lead-${day}`}>{day}</button>
        ))}
        {days.map((day) => {
          const isToday =
            today.getFullYear() === view.year &&
            today.getMonth() === view.month &&
            today.getDate() === day
          const isSelected =
            selected !== null &&
            selected.year === view.year &&
            selected.month === view.month &&
            selected.day === day
          return (
            <button
              type="button"
              key={day}
              className={`day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => onPick(formatDateParts(view.year, view.month, day))}
            >
              {day}
            </button>
          )
        })}
        {trailing.map((day) => (
          <button type="button" className="day other-month" disabled key={`trail-${day}`}>{day}</button>
        ))}
      </div>
      <div className="date-cal-foot">
        <button type="button" onClick={() => onPick('')}>Clear</button>
        <button
          type="button"
          onClick={() => {
            const now = new Date()
            onPick(formatDateParts(now.getFullYear(), now.getMonth(), now.getDate()))
          }}
        >
          Today
        </button>
      </div>
    </div>
  )
}

export type DateFieldProps = {
  id?: string | undefined
  className?: string | undefined
  placeholder?: string | undefined
  value: string
  readOnly?: boolean | undefined
  onChange: (value: string) => void
}

/**
 * A DD-MM-YYYY text box with a calendar button beside it, inside `.date-field-wrap` so the
 * generated stylesheet lays it out. The text is the value — half-typed entries are kept as
 * typed, exactly as the original does, and the callers all treat an unparseable date as
 * "no date".
 */
export function DateField({ id, className, placeholder, value, readOnly, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // The original closes any open calendar on a click that is neither in a popup nor on a
  // calendar button; without it the popup would survive a click on the page behind it.
  useEffect(() => {
    if (!open) return
    function onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      if (target && target.closest('.date-cal-popup, .date-cal-btn')) return
      setOpen(false)
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [open])

  return (
    <div className="date-field-wrap" ref={wrapRef}>
      <input
        type="text"
        id={id}
        className={className}
        placeholder={placeholder ?? 'DD-MM-YYYY'}
        value={value}
        readOnly={readOnly}
        inputMode="numeric"
        onChange={(event) => onChange(formatDateDigits(event.target.value))}
      />
      <button
        type="button"
        className="date-cal-btn"
        aria-label="Open calendar"
        onClick={(event) => {
          event.stopPropagation()
          if (readOnly) return
          setOpen((current) => !current)
        }}
      >
        {'\u{1F4C5}'}
      </button>
      {open ? (
        <CalendarPopup
          anchor={wrapRef.current}
          value={value}
          onPick={(picked) => {
            onChange(picked)
            setOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
