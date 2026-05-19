import { cn } from '@/lib/utils';

interface PriceTagProps {
  /** Price per day in euros. */
  value: number;
  /** Tailwind text size for the figure (default 'text-3xl'). */
  size?: string;
  className?: string;
}

export function PriceTag({
  value,
  size = 'text-3xl',
  className,
}: PriceTagProps) {
  return (
    <div className={cn('flex items-end gap-1.5', className)}>
      <span
        className={cn(
          'font-mono font-bold leading-none tracking-tight text-accent',
          size,
        )}
      >
        {value.toLocaleString('es-ES')}
        <span className="ml-0.5 align-top text-[0.55em] text-accent">
          €
        </span>
      </span>
      <span className="pb-0.5 font-mono text-xs text-muted">
        /día
      </span>
    </div>
  );
}
