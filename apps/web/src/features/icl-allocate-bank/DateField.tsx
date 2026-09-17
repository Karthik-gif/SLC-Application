import { useEffect, useRef, useState } from 'react'
import { calendarIso, formatInputDate, parseDate, sameDate } from './helpers.ts'

const CAL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const CAL_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export type DateFieldProps = {
  id?: string | undefined
  value: string
  onChange: (value: string) => void
  /** Fires when the value is committed — blur, or a pick in the calendar popup. */
  onCommit: (value: string) => void
  open: boolean
  onToggle: () => void
  onClose: () => void
  shellClassName?: string | undefined
  inputClassName?: string | undefined
}

/**
 * The legacy inline date input and its calendar popup.
 *
 * Which field's popup is open lives in the parent, because the original allows only one at
 * a time; month/year/view are local because closing the popup discards them.
 */
export function DateField({
  id,
  value,
  onChange,
  onCommit,
  open,
  onToggle,
  onClose,
  shellClassName,
  inputClassName,
}: DateFieldProps) {
  const selected = parseDate(value)
  const today = new Date()
  const [cursor, setCursor] = useState(() => selected ?? new Date())
  const [view, setView] = useState<'days' | 'picker'>('days')
  const shellRef = useRef<HTMLDivElement | null>(null)

  // Opening always starts on the month of the current value, as toggleCalendar did.
  useEffect(() => {
    if (!open) return
    setCursor(parseDate(value) ?? new Date())
    setView('days')
    // The value at the moment of opening is the only one that matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocumentClick = (event: MouseEvent) => {
      const shell = shellRef.current
      if (shell && event.target instanceof Node && shell.contains(event.target)) return
      onClose()
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [open, onClose])

  function pick(date: Date | null) {
    const next = date ? formatInputDate(date) : ''
    onChange(next)
    onClose()
    onCommit(next)
  }

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const days = Array.from({ length: 42 }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  )
  const years: number[] = []
  for (let y = year - 6; y <= year + 10; y++) years.push(y)

  const head = (
    <div className="calendar-top">
      <button
        className="calendar-title-btn"
        type="button"
        onClick={() => setView(view === 'picker' ? 'days' : 'picker')}
      >
        {`${CAL_MONTHS[month]} ${year}`}
      </button>
      <div className="calendar-navs">
        <button
          className="calendar-nav prev"
          type="button"
          aria-label="Previous month"
          onClick={() => {
            setCursor(new Date(year, month - 1, 1))
            setView('days')
          }}
        />
        <button
          className="calendar-nav next"
          type="button"
          aria-label="Next month"
          onClick={() => {
            setCursor(new Date(year, month + 1, 1))
            setView('days')
          }}
        />
      </div>
    </div>
  )

  return (
    <div className={shellClassName ? `inline-date-shell ${shellClassName}` : 'inline-date-shell'} ref={shellRef}>
      <input
        id={id}
        className={inputClassName ? `inline-date-input ${inputClassName}` : 'inline-date-input'}
        type="text"
        placeholder="DD-MM-YYYY"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onCommit(event.target.value)}
      />
      <button
        className="inline-calendar-btn"
        type="button"
        aria-label="Open calendar"
        onClick={onToggle}
      />
      <div className={open ? 'calendar-popup open' : 'calendar-popup'}>
        {open && view === 'picker' ? (
          <>
            {head}
            <div className="calendar-picker">
              <div className="month-grid">
                {CAL_MONTHS.map((name, index) => (
                  <button
                    key={name}
                    className={index === month ? 'month-btn selected' : 'month-btn'}
                    type="button"
                    onClick={() => setCursor(new Date(year, index, 1))}
                  >
                    {name.substring(0, 3)}
                  </button>
                ))}
              </div>
              <div className="year-list">
                {years.map((y) => (
                  <button
                    key={y}
                    className={y === year ? 'year-btn selected' : 'year-btn'}
                    type="button"
                    onClick={() => {
                      setCursor(new Date(y, month, 1))
                      setView('days')
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {open && view === 'days' ? (
          <>
            {head}
            <div className="calendar-week">
              {CAL_DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-days">
              {days.map((day) => {
                let cls = 'calendar-cell'
                if (day.getMonth() !== month) cls += ' other'
                if (sameDate(day, selected)) cls += ' selected'
                if (sameDate(day, today)) cls += ' today'
                return (
                  <button key={calendarIso(day)} className={cls} type="button" onClick={() => pick(day)}>
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
            <div className="calendar-foot">
              <button className="calendar-foot-btn" type="button" onClick={() => pick(null)}>
                Clear
              </button>
              <button className="calendar-foot-btn" type="button" onClick={() => pick(new Date())}>
                Today
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
