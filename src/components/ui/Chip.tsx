import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function FilterChip({ pressed, className, ...props }: { pressed: boolean } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-9 items-center whitespace-nowrap rounded-control border-[1.5px] border-rule-strong px-3.5 type-small font-semibold text-ink transition-colors duration-150 hover:border-ink focus-visible:outline-none focus-visible:shadow-focus',
        'aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper',
        className,
      )}
      {...props}
    />
  );
}
