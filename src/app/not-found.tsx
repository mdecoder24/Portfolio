import { SiteChrome } from '@/components/layout/SiteChrome';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="container-kit grid min-h-[70svh] content-center gap-6 py-(--section-pad)">
        <h1 className="type-h1 max-w-[18ch] text-ink">This page is missing from the kit</h1>
        <p className="type-lead max-w-[48ch] text-ink-2">The link may be old, or the page moved. Head back to the first page.</p>
        <div>
          <Button href="/">Go home</Button>
        </div>
      </div>
    </SiteChrome>
  );
}
