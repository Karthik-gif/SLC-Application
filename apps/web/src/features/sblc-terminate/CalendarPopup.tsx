import { useState } from 'react'
import { CAL_DAYS, CAL_MONTHS, calendarFromIso, calendarIso, formatDate, parseDate, sameDate } from './format.ts'

type View = 'days' | 'picker'

export type CalendarPopupProps = {
  id: string
  value: string
  onSelect: (value: string) => void
  onClose: () => void
}

/**
 * The date picker the legacy page reused for Key Date, the termination date and every DMS
 * doc date. It always opens on the field's current value (or today, if unparsable).
 */
export function CalendarPopup({ id, value, onSelect, onClose }: CalendarPopupProps) {
  const initial = parseDate(value) ?? new Date()
  const [month, setMonth] = useState(initial.getMonth())
  const [year, setYear] = useState(initial.getFullYear())
  const [view, setView] = useState<View>('days')

  const selected = parseDate(value)
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const days: Date[] = []
  for (let i = 0; i < 42; i++) days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))

  function goMonth(delta: number) {
    const date = new Date(year, month + delta, 1)
    setMonth(date.getMonth())
    setYear(date.getFullYear())
    setView('days')
  }

  const header = (
    <div className="calendar-top">
      <button className="calendar-title-btn" type="button" onClick={() => setView(view === 'picker' ? 'days' : 'picker')}>
        {CAL_MONTHS[month]} {year}
      </button>
      <div className="calendar-navs">
        <button className="calendar-nav prev" type="button" onClick={() => goMonth(-1)} />
        <button className="calendar-nav next" type="button" onClick={() => goMonth(1)} />
      </div>
    </div>
  )

  return (
    <div id={id} className="calendar-popup open">
      {header}
      {view === 'picker' ? (
        <div className="calendar-picker">
          <div className="month-grid">
            {CAL_MONTHS.map((name, i) => (
              <button
                key={name}
                type="button"
                className={'month-btn' + (i === month ? ' selected' : '')}
                onClick={() => setMonth(i)}
              >
                {name.substring(0, 3)}
              </button>
            ))}
          </div>
          <div className="year-list">
            {Array.from({ length: 17 }, (_, i) => year - 6 + i).map((y) => (
              <button
                key={y}
                type="button"
                className={'year-btn' + (y === year ? ' selected' : '')}
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
      ) : (
        <>
          <div className="calendar-week">
            {CAL_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((d) => {
              const iso = calendarIso(d)
              let cls = 'calendar-cell'
              if (d.getMonth() !== month) cls += ' other'
              if (sameDate(d, selected)) cls += ' selected'
              return (
                <button
                  key={iso}
                  type="button"
                  className={cls}
                  data-date={iso}
                  onClick={() => {
                    const date = calendarFromIso(iso)
                    if (!date) return
                    onSelect(formatDate(date))
                    onClose()
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
          <div className="calendar-foot">
            <button
              type="button"
              className="calendar-foot-btn"
              onClick={() => {
                onSelect('')
                onClose()
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="calendar-foot-btn"
              onClick={() => {
                onSelect(formatDate(new Date()))
                onClose()
              }}
            >
              Today
            </button>
          </div>
        </>
      )}
    </div>
  )
}
