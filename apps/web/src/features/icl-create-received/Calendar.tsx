import { useState } from 'react'
import { CAL_DAYS, CAL_MONTHS, calendarFromIso, calendarIso, formatDate, parseDate, sameDate } from './dates.ts'

type CalendarProps = {
  /** The date field's current text, used to highlight the selected day. */
  value: string
  onSelect: (formatted: string) => void
  onClear: () => void
}

/**
 * The inline calendar popup (`#uptoCalendar` / `#plannedCalendar` in the original), shared by
 * both date fields. Each field mounts its own instance so navigation state does not leak
 * between them, matching the original's per-field popup elements.
 */
export function Calendar({ value, onSelect, onClear }: CalendarProps) {
  const initial = parseDate(value) || new Date()
  const [month, setMonth] = useState(initial.getMonth())
  const [year, setYear] = useState(initial.getFullYear())
  const [view, setView] = useState<'days' | 'picker'>('days')

  const selected = parseDate(value)
  const today = new Date()
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  }

  function goToMonth(delta: number) {
    const date = new Date(year, month + delta, 1)
    setMonth(date.getMonth())
    setYear(date.getFullYear())
    setView('days')
  }

  const header = (
    <div className="calendar-top">
      <button className="calendar-title-btn" type="button" onClick={() => setView(view === 'picker' ? 'days' : 'picker')}>
        {CAL_MONTHS[month] + ' ' + year}
      </button>
      <div className="calendar-navs">
        <button className="calendar-nav prev" type="button" onClick={() => goToMonth(-1)} />
        <button className="calendar-nav next" type="button" onClick={() => goToMonth(1)} />
      </div>
    </div>
  )

  if (view === 'picker') {
    const startYear = year - 6
    const years = Array.from({ length: 17 }, (_, i) => startYear + i)
    return (
      <div className="calendar-popup open" onClick={(e) => e.stopPropagation()}>
        {header}
        <div className="calendar-picker">
          <div className="month-grid">
            {CAL_MONTHS.map((name, i) => (
              <button
                key={name}
                className={'month-btn' + (i === month ? ' selected' : '')}
                type="button"
                onClick={() => setMonth(i)}
              >
                {name.substring(0, 3)}
              </button>
            ))}
          </div>
          <div className="year-list">
            {years.map((y) => (
              <button
                key={y}
                className={'year-btn' + (y === year ? ' selected' : '')}
                type="button"
                onClick={() => {
                  setYear(y)
                  setView('days')
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-popup open" onClick={(e) => e.stopPropagation()}>
      {header}
      <div className="calendar-week">
        {CAL_DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="calendar-days">
        {days.map((d) => {
          const cls =
            'calendar-cell' +
            (d.getMonth() !== month ? ' other' : '') +
            (sameDate(d, selected) ? ' selected' : '')
          return (
            <button
              key={calendarIso(d)}
              className={cls}
              type="button"
              onClick={() => onSelect(formatDate(calendarFromIso(calendarIso(d)) || d))}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
      <div className="calendar-foot">
        <button className="calendar-foot-btn" type="button" onClick={onClear}>
          Clear
        </button>
        <button className="calendar-foot-btn" type="button" onClick={() => onSelect(formatDate(today))}>
          Today
        </button>
      </div>
    </div>
  )
}
