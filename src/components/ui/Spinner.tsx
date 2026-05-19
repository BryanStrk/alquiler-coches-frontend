import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  /** Tailwind size utility, e.g. "size-4" (default) or "size-8". */
  size?: string;
}

/**
 * Fast-spinning loader — a quicker spin makes loading *feel* faster
 * even when the wait is identical (Emil: perceived performance).
 */
export function Spinner({ className, size = 'size-4' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        size,
        className,
      )}
      style={{ animationDuration: '650ms' }}
    />
  );
}
