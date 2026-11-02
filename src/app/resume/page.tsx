import { Download } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { RESUME_PDF_HREF } from '@/components/layout/navItems';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Résumé', alternates: { canonical: '/resume' } };

export default function Resume() {
  return (
    <SiteChrome>
      <article className="container-kit grid max-w-3xl gap-8 py-(--section-pad)">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="type-h1 text-ink">Résumé</h1>
          <Button
            href={RESUME_PDF_HREF}
            download="Kushwant-KR-Resume.pdf"
            icon={<Download className="size-5" strokeWidth={1.75} aria-hidden="true" />}
          >
            Download résumé
          </Button>
        </div>
        {/* An image, not an embedded PDF: phones often won't show a PDF inline, and framing one needs looser headers.
            Regenerate it whenever the PDF changes (the command is in docs/architecture.md) */}
        <Image
          src="/resume/Kushwant-KR-Resume.png"
          alt="Preview of Kushwant Kumar Reddy's one-page résumé. Download the PDF for the full, selectable text."
          width={1700}
          height={2200}
          sizes="(min-width: 48rem) 48rem, 100vw"
          preload
          className="h-auto w-full rounded-md border border-rule shadow-float"
        />
      </article>
    </SiteChrome>
  );
}
