import { useEffect, useRef, useState } from 'react'
import {
  MONTH_NAMES,
  SHORT_MONTH_NAMES,
  WEEKDAY_NAMES,
  formatDate,
  parseDate,
  sameDate,
} from './format.ts'

export type CalendarProps = {
  open: boolean
  /** The Key Date field's text, DD-MM-YYYY, or '' when empty. */
  value: string
  /** Called with the picked date, or '' for Clear. The parent closes the popup. */
  onPick: (value: string) => void
}

/** The month the legacy page opens on before a date has been chosen. */
const DEFAULT_VIEW = new Date(2026, 8, 10)

const YEAR_FROM = 2022
const YEAR_TO = 2034

/**
 * The Key Date popup: a month grid that flips to a year/month picker when the title is
 * clicked. It renders even while closed, as the original did — `.calendar-popup` hides it.
 */
export function Calendar({ open, value, onPick }: CalendarProps) {
  const [mode, setMode] = useState<'days' | 'years'>('days')
  const [viewDate, setViewDate] = useState<Date>(parseDate(value) ?? DEFAULT_VIEW)
  const [year, setYear] = useState<number>((parseDate(value) ?? DEFAULT_VIEW).getFullYear())
  const panelRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLDivElement>(null)

  // Opening re-reads the field, so the popup always lands on the month that is in it.
  useEffect(() => {
    if (!open) return
    const parsed = parseDate(value)
    setMode('days')
    if (parsed) {
      setViewDate(parsed)
      setYear(parsed.getFullYear())
    }
    // Only the open edge matters; typing in the field must not move the popup underneath.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // The year list is 13 rows tall; bring the expanded one into view.
  useEffect(() => {
    if (mode !== 'years') return
    const panel = panelRef.current
    const active = activeRowRef.current
    if (panel && active) panel.scrollTop = Math.max(0, active.offsetTop - 34)
  }, [mode, year])

  const selected = parseDate(value)
  const month = viewDate.getMonth()

  const shiftMonth = (delta: number) => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1)
    setViewDate(next)
    setYear(next.getFullYear())
  }

  const toggleMode = () => {
    setMode((current) => (current === 'days' ? 'years' : 'days'))
    setYear(viewDate.getFullYear())
  }

  const title = (
    <button className="cal-title-btn" type="button" onClick={toggleMode}>
      {MONTH_NAMES[month]} {mode === 'years' ? year : viewDate.getFullYear()}
    </button>
  )

  if (mode === 'years') {
    const years: number[] = []
    for (let y = YEAR_FROM; y <= YEAR_TO; y++) years.push(y)
    return (
      <div className={open ? 'calendar-popup open' : 'calendar-popup'}>
        <div className="calendar-head">
          {title}
          <div className="cal-navs" />
        </div>
        <div id="yearPanel" className="year-panel" ref={panelRef}>
          {years.map((y) => (
            <div
              key={y}
              className={y === year ? 'year-row active' : 'year-row'}
              ref={y === year ? activeRowRef : undefined}
            >
              <button
                className="year-btn"
                type="button"
                onClick={() => {
                  setYear(y)
                  setViewDate(new Date(y, viewDate.getMonth(), 1))
                }}
              >
                {y}
              </button>
              {y === year ? (
                <div className="month-grid">
                  {SHORT_MONTH_NAMES.map((name, m) => {
                    const isSelected =
                      selected !== null && selected.getFullYear() === y && selected.getMonth() === m
                    return (
                      <button
                        key={name}
                        className={isSelected ? 'month-btn selected' : 'month-btn'}
                        type="button"
                        onClick={() => {
                          setViewDate(new Date(y, m, 1))
                          setMode('days')
                        }}
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
      </div>
    )
  }

  const first = new Date(viewDate.getFullYear(), month, 1)
  const firstCell = new Date(viewDate.getFullYear(), month, 1 - first.getDay())
  const cells: Date[] = []
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i))
  }

  return (
    <div className={open ? 'calendar-popup open' : 'calendar-popup'}>
      <div className="calendar-head">
        {title}
        <div className="cal-navs">
          <button
            className="cal-nav cal-nav-up"
            type="button"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
          />
          <button
            className="cal-nav cal-nav-down"
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
          />
        </div>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAY_NAMES.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <div className="calendar-days">
        {cells.map((cell) => {
          const text = formatDate(cell)
          let cls = 'calendar-day'
          if (cell.getMonth() !== month) cls += ' other-month'
          if (selected !== null && sameDate(selected, cell)) cls += ' selected'
          return (
            <button key={text} className={cls} type="button" onClick={() => onPick(text)}>
              {cell.getDate()}
            </button>
          )
        })}
      </div>
      <div className="calendar-foot">
        <button className="cal-link" type="button" onClick={() => onPick('')}>
          Clear
        </button>
        <button className="cal-link" type="button" onClick={() => onPick(formatDate(new Date()))}>
          Today
        </button>
      </div>
    </div>
  )
}
