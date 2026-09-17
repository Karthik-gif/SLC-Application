export type ComboFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  open: boolean
  options: string[]
  onChange(value: string): void
  onFocus(): void
  onToggle(): void
  onPick(value: string): void
}

/** The Transaction No / Deal ID filter: a text input with a dropdown of matching values. */
export function ComboField({
  id,
  label,
  placeholder,
  value,
  open,
  options,
  onChange,
  onFocus,
  onToggle,
  onPick,
}: ComboFieldProps) {
  return (
    <div className="filter-item">
      <label htmlFor={id}>{label}</label>
      <div className="combo-shell">
        <input
          id={id}
          className="input combo-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={onFocus}
        />
        <button
          className="combo-btn"
          type="button"
          aria-label={`${label} list`}
          onClick={onToggle}
        ></button>
        <div className={open ? 'combo-list open' : 'combo-list'}>
          {options.length === 0 ? (
            <div className="combo-empty">No matching values</div>
          ) : (
            options.map((option) => (
              <button
                key={option}
                className="combo-option"
                type="button"
                onClick={() => onPick(option)}
              >
                {option}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
