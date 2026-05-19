import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Tailwind max-width for the panel (default 'max-w-lg'). */
  maxWidth?: string;
  /** Hide the default close button + padding (used by the lightbox). */
  bare?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  bare = false,
}: ModalProps) {
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop — fades in via @starting-style. */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm',
          'opacity-100 transition-opacity duration-200',
          'starting:opacity-0',
        )}
      />
      {/* Panel — modals scale from center (Emil: modals are the
          transform-origin exception, they aren't anchored to a trigger). */}
      <div
        className={cn(
          'relative w-full rounded-md border border-border bg-surface-2',
          'opacity-100 scale-100 transition-[opacity,transform] duration-200 ease-out-strong',
          'starting:opacity-0 starting:scale-95',
          maxWidth,
          !bare && 'p-6',
        )}
      >
        {!bare && (
          <div className="mb-4 flex items-start justify-between gap-4">
            {title && (
              <h2 className="font-display text-xl text-text">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="press -mr-1 -mt-1 rounded-sm p-1 text-muted hover:bg-surface hover:text-text"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
