import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends ComponentPropsWithRef<'input'> {
  label?: string;
  error?: string;
  /** Lucide icon rendered inside the field, left-aligned. */
  icon?: ReactNode;
  /** Hint text shown under the field when there is no error. */
  hint?: string;
}

export function Input({
  label,
  error,
  icon,
  hint,
  id,
  className,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wider text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'h-12 w-full rounded-sm border bg-surface px-4 text-sm text-text',
            'placeholder:text-text-dim',
            'transition-colors duration-150',
            'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40',
            icon && 'pl-10',
            error ? 'border-danger' : 'border-border',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-dim">{hint}</p>
      ) : null}
    </div>
  );
}
