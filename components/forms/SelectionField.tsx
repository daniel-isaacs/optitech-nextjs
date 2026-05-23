import { ChevronDown } from 'lucide-react'
import FieldWrapper from './FieldWrapper'

type Option = { caption: string; value: string; checked: boolean }

const selectBase = [
  'w-full appearance-none bg-transparent border-0 border-b border-fg/20 rounded-none',
  'px-0 pr-6 py-3.5',
  'text-body text-fg',
  'focus:outline-none focus-visible:border-brand',
  'transition-colors duration-150 ease-quick',
  'cursor-pointer disabled:opacity-50',
].join(' ')

type Props = {
  id: string
  name: string
  label?: string
  placeholder?: string
  tooltip?: string
  options: Option[]
  allowMultiSelect?: boolean
  autoComplete?: string
  required?: boolean
}

export default function SelectionField({ id, name, label, placeholder, tooltip, options, allowMultiSelect, autoComplete, required }: Props) {
  const preSelected = allowMultiSelect
    ? options.filter(o => o.checked).map(o => o.value)
    : (options.find(o => o.checked)?.value ?? '')

  return (
    <FieldWrapper id={id} label={label} tooltip={tooltip} required={required}>
      <div className="relative">
        <select
          id={id}
          name={name}
          multiple={allowMultiSelect}
          defaultValue={preSelected as string & string[]}
          autoComplete={autoComplete || undefined}
          required={required}
          aria-describedby={tooltip ? `${id}-hint` : undefined}
          className={selectBase}
          size={allowMultiSelect ? Math.min(options.length + 1, 6) : undefined}
        >
          {!allowMultiSelect && (
            <option value="" disabled={!!options.find(o => o.checked)}>
              {placeholder ?? 'Select an option'}
            </option>
          )}
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.caption}</option>
          ))}
        </select>
        {!allowMultiSelect && (
          <ChevronDown
            size={14}
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-fg-muted"
            aria-hidden="true"
          />
        )}
      </div>
    </FieldWrapper>
  )
}
