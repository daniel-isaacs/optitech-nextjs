import FieldWrapper from './FieldWrapper'

const inputBase = [
  'w-full bg-transparent border-0 border-b border-fg/20 rounded-none',
  'px-0 py-3.5',
  'text-body text-fg placeholder:text-fg-muted/40',
  'focus:outline-none focus-visible:border-brand',
  'transition-colors duration-150 ease-quick',
  'disabled:opacity-50',
].join(' ')

type Props = {
  id: string
  name: string
  label?: string
  placeholder?: string
  tooltip?: string
  defaultValue?: string
  required?: boolean
}

export default function UrlField({ id, name, label, placeholder, tooltip, defaultValue, required }: Props) {
  return (
    <FieldWrapper id={id} label={label} tooltip={tooltip} required={required}>
      <input
        type="url"
        id={id}
        name={name}
        className={inputBase}
        placeholder={placeholder ?? 'https://'}
        defaultValue={defaultValue}
        required={required}
        aria-describedby={tooltip ? `${id}-hint` : undefined}
      />
    </FieldWrapper>
  )
}
