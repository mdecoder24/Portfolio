import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const controlClasses =
  'min-h-12 w-full rounded-sm border border-rule-strong bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-2 transition-colors duration-200 hover:border-ink-2 focus-visible:border-ink focus-visible:outline-none focus-visible:shadow-focus aria-invalid:border-error';

export function FormField({
  id,
  label,
  optional,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('grid content-start gap-2', className)}>
      <label htmlFor={id} className="type-code text-ink-2">
        {label}
        {optional && <span className="font-normal text-ink-2"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 type-small font-[520] text-error">
          <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="type-small text-ink-2">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}
