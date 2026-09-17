import { useEffect, useRef } from 'react'
import { MONTH_NAMES, SHORT_MONTH_NAMES, WEEKDAY_NAMES, formatDate, sameDate } from './format.ts'

export type CalendarProps = {
  open: boolean
  mode: 'days' | 'years'
  /** The month on show. Independent of the selection: browsing does not pick a date. */
  viewDate: Date
  viewYear: number
  selected: Date | null
  onToggleMode: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onClear: () => void
  onToday: () => void
  onPickDate: (text: string) => void
  onPickYear: (year: number) => void
  onPickMonth: (month: number) => void
}

const YEARS = Array.from({ length: 13 }, (_, i) => 2022 + i)

/**
 * The legacy page's own date picker, kept rather than swapped for `<input type="date">`
 * because it is the only calendar the stylesheet knows how to draw.
 */
export function Calendar(props: CalendarProps) {
  return (
    <div className={props.open ? 'calendar-popup open' : 'calendar-popup'}>
      {!props.open ? null : props.mode === 'years' ? <YearPanel {...props} /> : <DayPanel {...props} />}
    </div>
  )
}

function DayPanel({
  viewDate,
  selected,
  onToggleMode,
  onPrevMonth,
  onNextMonth,
  onClear,
  onToday,
  onPickDate,
}: CalendarProps) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstCell = new Date(year, month, 1 - new Date(year, month, 1).getDay())
  const cells = Array.from({ length: 42 }, (_, i) =>
    new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i),
  )

  return (
    <>
      <div className="calendar-head">
        <button className="cal-title-btn" type="button" onClick={onToggleMode}>
          {MONTH_NAMES[month]} {year}
        </button>
        <div className="cal-navs">
          <button
            className="cal-nav cal-nav-up"
            type="button"
            aria-label="Previous month"
            onClick={onPrevMonth}
          />
          <button
            className="cal-nav cal-nav-down"
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
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
          const classes = ['calendar-day']
          if (cell.getMonth() !== month) classes.push('other-month')
          if (selected && sameDate(selected, cell)) classes.push('selected')
          const text = formatDate(cell)
          return (
            <button
              key={text}
              className={classes.join(' ')}
              type="button"
              onClick={() => onPickDate(text)}
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

function YearPanel({ viewDate, viewYear, selected, onToggleMode, onPickYear, onPickMonth }: CalendarProps) {
  const panel = useRef<HTMLDivElement>(null)
  const activeRow = useRef<HTMLDivElement>(null)

  // Thirteen years in a 315px box: without this the panel always opens on 2022.
  useEffect(() => {
    if (panel.current && activeRow.current) {
      panel.current.scrollTop = Math.max(0, activeRow.current.offsetTop - 34)
    }
  }, [viewYear])

  return (
    <>
      <div className="calendar-head">
        <button className="cal-title-btn" type="button" onClick={onToggleMode}>
          {MONTH_NAMES[viewDate.getMonth()]} {viewYear}
        </button>
        <div className="cal-navs" />
      </div>
      <div className="year-panel" ref={panel}>
        {YEARS.map((year) => {
          const active = year === viewYear
          return (
            <div
              key={year}
              className={active ? 'year-row active' : 'year-row'}
              ref={active ? activeRow : null}
            >
              <button className="year-btn" type="button" onClick={() => onPickYear(year)}>
                {year}
              </button>
              {active ? (
                <div className="month-grid">
                  {SHORT_MONTH_NAMES.map((name, month) => {
                    const picked =
                      selected != null &&
                      selected.getFullYear() === year &&
                      selected.getMonth() === month
                    return (
                      <button
                        key={name}
                        className={picked ? 'month-btn selected' : 'month-btn'}
                        type="button"
                        onClick={() => onPickMonth(month)}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </>
  )
}
