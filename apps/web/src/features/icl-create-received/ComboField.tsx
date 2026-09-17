/** One filter combo box (`.combo-shell`): a free-text input plus a dropdown of matching values. */
type ComboFieldProps = {
  id: string
  label: string
  shellClassName: string
  value: string
  values: string[]
  open: boolean
  onChange: (value: string) => void
  onFocus: () => void
  onToggle: () => void
  onChoose: (value: string) => void
}

export function ComboField({
  id,
  label,
  shellClassName,
  value,
  values,
  open,
  onChange,
  onFocus,
  onToggle,
  onChoose,
}: ComboFieldProps) {
  return (
    <div className="filter-item">
      <label htmlFor={id}>{label}</label>
      <div className={'combo-shell ' + shellClassName} onClick={(e) => e.stopPropagation()}>
        <input
          id={id}
          className="filter-input combo-input"
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
        />
        <button
          className="combo-btn"
          type="button"
          aria-label={'Show ' + label + ' values'}
          onClick={onToggle}
        />
        <div className={'combo-list' + (open ? ' open' : '')}>
          {open &&
            (values.length ? (
              values.map((v) => (
                <button key={v} className="combo-option" type="button" onClick={() => onChoose(v)}>
                  {v}
                </button>
              ))
            ) : (
              <div className="combo-empty">No matching values</div>
            ))}
        </div>
      </div>
    </div>
  )
}
