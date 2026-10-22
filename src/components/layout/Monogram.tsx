import Link from 'next/link';
import { PearlDot } from '@/components/ui/PearlDot';

export function Monogram() {
  return (
    <Link
      href="/#top"
      aria-label="Kushwant KR, back to top"
      className="inline-flex min-h-11 items-center rounded-xs type-h4 text-pearl [font-variation-settings:'wdth'_112] font-[780] focus-visible:outline-none focus-visible:shadow-focus"
    >
      <span>
        KR
        <PearlDot className="ml-[0.05em]" />
      </span>
    </Link>
  );
}
