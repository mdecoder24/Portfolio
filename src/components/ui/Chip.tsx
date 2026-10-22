import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const base =
  'inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-pill border-[1.5px] border-line-strong px-4 type-small font-medium text-pearl transition-colors duration-150 hover:bg-shoal focus-visible:outline-none focus-visible:shadow-focus';

export function FilterChip({ pressed, className, ...props }: { pressed: boolean } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(base, 'aria-pressed:border-rose aria-pressed:bg-rose-soft aria-pressed:text-rose', className)}
      {...props}
    />
  );
}
