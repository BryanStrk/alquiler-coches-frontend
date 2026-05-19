import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeColor =
  // semánticos (el sistema actual)
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  // claves antiguas — se mapean a los semánticos para no romper callers
  | 'green'
  | 'red'
  | 'gray'
  | 'cyan'
  | 'yellow'
  | 'orange'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'slate';

// Paleta sobria de lujo: borde sutil del color, fondo muy tenue, texto al
// color. `neutral` es plano (sin color) para los datos no jerárquicos.
const SUCCESS = 'border-success/40 text-success bg-success/10';
const WARNING = 'border-warning/40 text-warning bg-warning/10';
const DANGER = 'border-danger/40 text-danger bg-danger/10';
const NEUTRAL = 'border-border-strong text-muted bg-transparent';

const colors: Record<BadgeColor, string> = {
  success: SUCCESS,
  warning: WARNING,
  danger: DANGER,
  neutral: NEUTRAL,
  // legacy → semántico
  green: SUCCESS,
  emerald: SUCCESS,
  red: DANGER,
  rose: DANGER,
  yellow: WARNING,
  amber: WARNING,
  orange: WARNING,
  gray: NEUTRAL,
  slate: NEUTRAL,
  cyan: NEUTRAL,
};

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}

export function Badge({
  color = 'neutral',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // rounded-sm, nunca pill: el lujo es anguloso y sobrio.
        'inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1',
        'text-xs font-medium uppercase tracking-wider',
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
