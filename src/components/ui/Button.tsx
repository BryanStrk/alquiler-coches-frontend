import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type Variant =
  | 'primary'
  | 'outline'
  | 'accent-outline'
  | 'ghost'
  | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent-hover disabled:hover:bg-accent',
  outline:
    'border border-border-strong bg-transparent text-text hover:bg-surface',
  'accent-outline':
    'border border-accent bg-transparent text-accent hover:bg-accent/10',
  ghost: 'bg-transparent text-muted hover:bg-surface hover:text-text',
  danger:
    'bg-danger text-bg hover:bg-danger/85 disabled:hover:bg-danger',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-11 px-6 text-xs',
  lg: 'h-12 px-8 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // `press` gives the scale(0.97) tactile feedback on :active.
      className={cn(
        'press inline-flex items-center justify-center gap-2 rounded-sm',
        'font-semibold uppercase tracking-wider',
        'transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
