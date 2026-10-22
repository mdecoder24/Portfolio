import Link from 'next/link';

export function Monogram() {
  return (
    <Link
      href="/#top"
      aria-label="Kushwant KR, back to top"
      className="inline-flex min-h-11 items-center gap-2 rounded-xs text-ink focus-visible:outline-none focus-visible:shadow-focus"
    >
      <span className="grid h-8 place-items-center bg-ink px-2 type-code text-paper">KR</span>
      <span className="type-code max-sm:hidden">Kushwant KR, build kit 2026</span>
    </Link>
  );
}
