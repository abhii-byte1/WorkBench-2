import { Search } from 'lucide-react'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchInput({ value, onChange, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-2)]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] py-2 pl-9 pr-4 text-sm text-[var(--color-text-1)] placeholder:text-[var(--color-text-2)]/50 outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/50"
        {...props}
      />
    </div>
  )
}
