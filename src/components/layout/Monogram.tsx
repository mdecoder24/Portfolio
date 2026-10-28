import { cn } from '@/lib/cn';

/**
 * The "Prompt" logo mark: lowercase `kkr` in Geist Mono with a blinking accent underscore cursor.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-end gap-[0.06em] font-mono text-[1.375rem] leading-[0.8] font-semibold tracking-[-0.04em] text-ink select-none',
        className,
      )}
    >
      <span>kkr</span>
      <span className="kr-caret inline-block h-[0.12em] w-[0.5em] bg-accent calm:animate-none" />
    </span>
  );
}
