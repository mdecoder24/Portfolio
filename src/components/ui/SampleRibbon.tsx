import { showSampleRibbon } from '@/lib/format';

/** Marks invented content in preview builds; production builds fail before any placeholder ships. */
export function SampleRibbon({ placeholder }: { placeholder?: boolean }) {
  if (!placeholder || !showSampleRibbon) return null;
  return (
    <span className="inline-flex w-fit items-center rounded-sm bg-amber-soft px-2 type-caption text-amber">
      Sample content
    </span>
  );
}
