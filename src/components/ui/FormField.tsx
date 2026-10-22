import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const controlClasses =
  'min-h-12 w-full rounded-sm border-[1.5px] border-line-strong bg-reef px-3.5 py-2.5 text-base text-pearl placeholder:text-mist transition-colors duration-150 hover:border-mist focus-visible:border-rose focus-visible:outline-none focus-visible:shadow-focus aria-invalid:border-coral';

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
      <label htmlFor={id} className="type-ui text-pearl">
        {label}
        {optional && <span className="font-normal text-mist"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 type-small font-[520] text-coral">
          <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="type-small text-mist">
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
