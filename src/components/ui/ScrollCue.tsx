import { ChevronDown } from 'lucide-react';

/**
 * A "Scroll for more" cue pinned to the bottom of a scrolling panel, over a fade, so it is clear more sits below. A beam
 * of light circles its border and a soft glow breathes behind it; both stop under reduced motion. It fades out over the
 * last stretch of scrolling, where scroll-driven animations are supported (see .scroll-cue in globals.css).
 */
export function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="scroll-cue pointer-events-none sticky bottom-0 -mt-20 flex h-20 items-end justify-center bg-linear-to-t from-paper to-transparent pb-3"
    >
      <span className="scroll-cue-pill relative isolate inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper px-3 py-1 type-code text-ink">
        Scroll for more
        <ChevronDown className="scroll-cue-arrow size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
    </div>
  );
}
