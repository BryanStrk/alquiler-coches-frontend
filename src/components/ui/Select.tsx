import type { ComponentPropsWithRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends ComponentPropsWithRef<'select'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  /** Optional first option acting as a placeholder (empty value). */
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium uppercase tracking-wider text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'h-12 w-full appearance-none rounded-sm border bg-surface pr-9 pl-4 text-sm text-text',
            'transition-colors duration-150',
            'focus:border-accent focus:ring-1 focus:ring-accent/40 focus:outline-none',
            error ? 'border-danger' : 'border-border',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-dim" />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
