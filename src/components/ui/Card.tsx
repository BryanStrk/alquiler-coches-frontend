import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface',
        className,
      )}
      {...props}
    />
  );
}
