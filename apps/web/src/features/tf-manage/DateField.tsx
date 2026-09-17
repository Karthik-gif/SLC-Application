import { useRef, useState } from 'react'
import { formatDateDigits, toDisplayDate, toIsoDate } from './dates.ts'

export type DateFieldProps = {
  id: string
  /** The draft value, always ISO. */
  iso: string
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  title?: string | undefined
  onChange: (iso: string) => void
}

/**
 * The original's date control: a DD-MM-YYYY text box with a calendar button beside it,
 * inside `.date-field-wrap` so the generated stylesheet lays it out.
 *
 * The typed text is held locally because a half-typed date ("05-09") has no ISO form; the
 * draft is only updated once the text parses, so an incomplete entry can never overwrite a
 * good value. The original builds its own calendar popup; this opens the browser's native
 * picker from a hidden input instead, which is real functionality rather than a
 * reimplementation of 200 lines of popup code.
 */
export function DateField({ id, iso, disabled, readOnly, title, onChange }: DateFieldProps) {
  const [text, setText] = useState(() => toDisplayDate(iso))
  const [syncedFrom, setSyncedFrom] = useState(iso)
  const pickerRef = useRef<HTMLInputElement>(null)

  // Re-derive when the row underneath changes — another TF selected, or Cancel pressed.
  // Done during render rather than in an effect, which would paint the stale value first.
  if (iso !== syncedFrom) {
    setSyncedFrom(iso)
    setText(toDisplayDate(iso))
  }

  function onText(raw: string) {
    const formatted = formatDateDigits(raw)
    setText(formatted)
    const next = toIsoDate(formatted)
    // null means "still typing" — leave the draft alone.
    if (next !== null) {
      setSyncedFrom(next)
      onChange(next)
    }
  }

  function openPicker() {
    const picker = pickerRef.current
    if (!picker) return
    // showPicker is not in every browser; focusing is the graceful fallback.
    if (typeof picker.showPicker === 'function') picker.showPicker()
    else picker.focus()
  }

  return (
    <div className="date-field-wrap">
      <input
        type="text"
        id={id}
        placeholder="DD-MM-YYYY"
        value={text}
        disabled={disabled}
        readOnly={readOnly}
        title={title}
        inputMode="numeric"
        onChange={(event) => onText(event.target.value)}
      />
      <button
        type="button"
        className="date-cal-btn"
        aria-label="Open calendar"
        disabled={disabled || readOnly}
        onClick={openPicker}
      >
        {'\u{1F4C5}'}
      </button>
      {/* Drives the native picker. Hidden from layout and from assistive tech; the text box
          above is the labelled control. */}
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : ''}
        onChange={(event) => {
          const next = event.target.value
          setSyncedFrom(next)
          setText(toDisplayDate(next))
          onChange(next)
        }}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          border: 0,
          padding: 0,
        }}
      />
    </div>
  )
}
