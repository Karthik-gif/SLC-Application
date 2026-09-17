import { Fragment } from 'react'
import { DateField } from './DateField.tsx'
import type { Section } from './fields.ts'
import type { TrdFlowRow } from './types.ts'

export type FieldGridProps = {
  section: Section
  draft: TrdFlowRow
  /** Option values for a bound <select>, taken from the rows actually loaded. */
  optionsFor: (field: keyof TrdFlowRow) => string[]
  onChange: (field: keyof TrdFlowRow, value: string) => void
}

/**
 * One `.section-box`. The legacy grid places the label and the control as siblings inside
 * `.section-body.field-grid.<gridN>` — no wrapper per field — so that is what this emits; a
 * wrapper element would break the column count the grid class sets.
 */
export function FieldGrid({ section, draft, optionsFor, onChange }: FieldGridProps) {
  const bodyClass = section.grid
    ? `section-body field-grid ${section.grid}`
    : 'section-body field-grid'

  return (
    <div className="section-box">
      <div className="section-head">{section.heading}</div>
      <div className={bodyClass}>
        {section.fields.map((descriptor) => {
          const bound = descriptor.field
          const value = bound ? (draft[bound] ?? '') : ''
          const unmapped = bound === undefined
          const title = unmapped ? 'No SAP source for this field yet' : undefined

          return (
            <Fragment key={descriptor.id}>
              <label htmlFor={descriptor.id}>{descriptor.label}</label>
              {descriptor.control === 'select' ? (
                <select
                  id={descriptor.id}
                  value={String(value)}
                  disabled={unmapped}
                  title={title}
                  onChange={(event) => bound && onChange(bound, event.target.value)}
                >
                  <option value="" />
                  {bound
                    ? optionsFor(bound).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    : null}
                </select>
              ) : descriptor.type === 'date' ? (
                <DateField
                  id={descriptor.id}
                  iso={String(value)}
                  disabled={unmapped}
                  readOnly={descriptor.readOnly}
                  title={title}
                  onChange={(next) => bound && onChange(bound, next)}
                />
              ) : (
                <input
                  id={descriptor.id}
                  type="text"
                  // The original right-aligns amounts at a fixed 150px; without the class
                  // a number field renders full-width and breaks the column rhythm.
                  className={descriptor.type === 'number' ? 'amt-input' : undefined}
                  value={String(value)}
                  disabled={unmapped}
                  readOnly={descriptor.readOnly}
                  title={title}
                  onChange={(event) => bound && onChange(bound, event.target.value)}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
