import { useEffect, useRef } from 'react'
import {
  MONTH_NAMES,
  SHORT_MONTH_NAMES,
  WEEKDAY_NAMES,
  formatDate,
  parseDate,
  sameDate,
} from './format.ts'
import type { CalendarMode } from './types.ts'

const FIRST_YEAR = 2022
const LAST_YEAR = 2034

export type CalendarPopupProps = {
  open: boolean
  mode: CalendarMode
  /** The month the day panel is showing. */
  viewDate: Date
  /** The year row expanded in the year panel. */
  year: number
  /** The current Key Date text, so the matching day/month can be highlighted. */
  value: string
  onStep(months: number): void
  onToggleMode(): void
  onPickDate(date: string): void
  onPickYear(year: number): void
  onPickMonth(month: number): void
  onClear(): void
  onToday(): void
}

export function CalendarPopup(props: CalendarPopupProps) {
  const { open, mode, viewDate, year, value } = props
  const selected = parseDate(value)
  const panelRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLDivElement>(null)

  // The year list opens scrolled to the expanded row, as the original's scrollActiveYear did.
  useEffect(() => {
    const panel = panelRef.current
    const active = activeRowRef.current
    if (!panel || !active) return
    panel.scrollTop = Math.max(0, active.offsetTop - 34)
  }, [open, mode, year])

  const title = `${MONTH_NAMES[viewDate.getMonth()] ?? ''} ${mode === 'years' ? year : viewDate.getFullYear()}`

  const head = (
    <div className="calendar-head">
      <button className="cal-title-btn" type="button" onClick={props.onToggleMode}>
        {title}
      </button>
      {mode === 'years' ? (
        <div className="cal-navs"></div>
      ) : (
        <div className="cal-navs">
          <button
            className="cal-nav cal-nav-up"
            type="button"
            aria-label="Previous month"
            onClick={() => props.onStep(-1)}
          ></button>
          <button
            className="cal-nav cal-nav-down"
            type="button"
            aria-label="Next month"
            onClick={() => props.onStep(1)}
          ></button>
        </div>
      )}
    </div>
  )

  return (
    <div className={open ? 'calendar-popup open' : 'calendar-popup'}>
      {head}
      {mode === 'years' ? (
        <div className="year-panel" ref={panelRef}>
          {yearRange().map((y) => (
            <div
              key={y}
              className={y === year ? 'year-row active' : 'year-row'}
              ref={y === year ? activeRowRef : null}
            >
              <button className="year-btn" type="button" onClick={() => props.onPickYear(y)}>
                {y}
              </button>
              {y === year ? (
                <div className="month-grid">
                  {SHORT_MONTH_NAMES.map((name, m) => {
                    const isSelected =
                      !!selected && selected.getFullYear() === y && selected.getMonth() === m
                    return (
                      <button
                        key={name}
                        className={isSelected ? 'month-btn selected' : 'month-btn'}
                        type="button"
                        onClick={() => props.onPickMonth(m)}
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
      ) : (
        <>
          <div className="calendar-weekdays">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div className="calendar-days">
            {monthCells(viewDate).map((cell) => {
              let cls = 'calendar-day'
              if (cell.getMonth() !== viewDate.getMonth()) cls += ' other-month'
              if (selected && sameDate(selected, cell)) cls += ' selected'
              const text = formatDate(cell)
              return (
                <button
                  key={text}
                  className={cls}
                  type="button"
                  onClick={() => props.onPickDate(text)}
                >
                  {cell.getDate()}
                </button>
              )
            })}
          </div>
          <div className="calendar-foot">
            <button className="cal-link" type="button" onClick={props.onClear}>
              Clear
            </button>
            <button className="cal-link" type="button" onClick={props.onToday}>
              Today
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function yearRange(): number[] {
  const years: number[] = []
  for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) years.push(y)
  return years
}

/** The fixed 6x7 grid the original drew, starting on the Sunday of the first week. */
function monthCells(viewDate: Date): Date[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const cells: Date[] = []
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  }
  return cells
}
