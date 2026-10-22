'use client';

import { Check, CircleAlert, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';

export type ToastData = { id: number; tone: 'success' | 'error'; title: string; detail?: string };

/** One toast at a time, bottom-left on desktop (the launcher owns bottom-right), bottom-centre on phones. */
export function Toast({ toast, onDismiss }: { toast: ToastData | null; onDismiss: () => void }) {
  useEffect(() => {
    if (toast?.tone !== 'success') return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-toast flex justify-center sm:inset-x-auto sm:bottom-6 sm:left-6"
    >
      {toast && (
        <div
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-md bg-shoal p-4 shadow-float inset-shadow-lustre',
            'transition-[opacity,translate] duration-240 ease-nacre-out starting:translate-y-2 starting:opacity-0 motion-reduce:starting:translate-y-0',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-full',
              toast.tone === 'success' ? 'bg-seaglass-soft text-seaglass' : 'bg-coral-soft text-coral',
            )}
          >
            {toast.tone === 'success' ? (
              <Check className="size-4" strokeWidth={2} />
            ) : (
              <CircleAlert className="size-4" strokeWidth={2} />
            )}
          </span>
          <div className="grid flex-1 gap-0.5">
            <p className="type-ui text-pearl">{toast.title}</p>
            {toast.detail && <p className="type-small text-mist">{toast.detail}</p>}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="-m-1 inline-flex size-8 items-center justify-center rounded-pill text-mist hover:bg-reef hover:text-pearl focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
