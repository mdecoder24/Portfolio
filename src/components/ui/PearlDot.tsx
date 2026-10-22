import { cn } from '@/lib/cn';

/** The CSS pearl. Decorative everywhere it appears; callers provide the accessible text. */
export function PearlDot({ className, id }: { className?: string; id?: string }) {
  return <span id={id} aria-hidden="true" className={cn('pearl inline-block size-[0.32em] shrink-0', className)} />;
}
