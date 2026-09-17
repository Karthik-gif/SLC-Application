type ComboFieldProps = {
  /** Prefix of the original's element ids: "ottk" gives ottkFilter, ottkDropBtn, ottkList. */
  name: string
  label: string
  value: string
  options: readonly string[]
  open: boolean
  /** The status filter's list is wider in the original, via an extra class on the shell. */
  shellClassName?: string | undefined
  onChange: (value: string) => void
  onOpenChange: (open: boolean) => void
}

/**
 * The legacy "type or pick" filter: a text box that both filters the grid as you type and
 * offers the matching distinct values underneath it.
 */
export function ComboField({
  name,
  label,
  value,
  options,
  open,
  shellClassName,
  onChange,
  onOpenChange,
}: ComboFieldProps) {
  return (
    <div className="filter-item">
      <label htmlFor={`${name}Filter`}>{label}</label>
      <div className={shellClassName ? `combo-shell ${shellClassName}` : 'combo-shell'}>
        <input
          id={`${name}Filter`}
          className="input combo-input"
          type="text"
          placeholder={label}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            onOpenChange(true)
          }}
          onClick={() => onOpenChange(true)}
        />
        <button
          id={`${name}DropBtn`}
          className="combo-btn"
          type="button"
          aria-label={`${label} list`}
          onClick={() => onOpenChange(!open)}
        />
        <div id={`${name}List`} className={open ? 'combo-list open' : 'combo-list'}>
          {options.length ? (
            options.map((option) => (
              <button
                key={option}
                className="combo-option"
                type="button"
                onClick={() => {
                  onChange(option)
                  onOpenChange(false)
                }}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="combo-empty">No matching values</div>
          )}
        </div>
      </div>
    </div>
  )
}
