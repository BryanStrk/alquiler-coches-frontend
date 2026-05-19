import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  label?: string;
  error?: string;
  /** Current length, for the `current / limit` counter. */
  count?: number;
  /** Named `limit` (not `max`) so it can't collide with the `max`
      attribute that RHF's register() injects when spread onto the field. */
  limit?: number;
}

export function Textarea({
  label,
  error,
  count,
  limit,
  id,
  className,
  ...props
}: TextareaProps) {
  const taId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={taId}
            className="text-xs font-medium uppercase tracking-wider text-muted"
          >
            {label}
          </label>
        )}
        {typeof count === 'number' && typeof limit === 'number' && (
          <span
            className={cn(
              'text-xs tabular-nums',
              count > limit ? 'text-danger' : 'text-text-dim',
            )}
          >
            {count} / {limit}
          </span>
        )}
      </div>
      <textarea
        id={taId}
        className={cn(
          'w-full resize-y rounded-sm border bg-surface px-4 py-3 text-sm text-text',
          'placeholder:text-text-dim',
          'transition-colors duration-150',
          'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
