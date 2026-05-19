import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import {
  useToasts,
  useDismissToast,
  type ToastType,
} from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const config: Record<
  ToastType,
  { icon: typeof Info; ring: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle2,
    ring: 'border-success/40',
    iconClass: 'text-success',
  },
  error: {
    icon: XCircle,
    ring: 'border-danger/40',
    iconClass: 'text-danger',
  },
  info: {
    icon: Info,
    ring: 'border-border-strong',
    iconClass: 'text-accent',
  },
};

/**
 * Global toast viewport. Render once near the app root.
 * Toasts enter from the right (same axis they'd swipe out on) using
 * @starting-style — transitions, not keyframes, so rapid stacking retargets
 * smoothly rather than restarting.
 */
export function Toaster() {
  const toasts = useToasts();
  const dismiss = useDismissToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="pointer-events-none fixed top-4 right-4 z-60 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const { icon: Icon, ring, iconClass } = config[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-md border bg-surface-2 p-4 shadow-lg',
              'translate-x-0 opacity-100 transition-[opacity,transform] duration-250 ease-out-strong',
              'starting:translate-x-4 starting:opacity-0',
              ring,
            )}
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', iconClass)} />
            <p className="flex-1 text-sm text-text">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar notificación"
              className="press -mt-1 -mr-1 rounded p-1 text-muted hover:text-text"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
