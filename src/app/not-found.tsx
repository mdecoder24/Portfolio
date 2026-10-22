import { SiteChrome } from '@/components/layout/SiteChrome';
import { Button } from '@/components/ui/Button';
import { PearlDot } from '@/components/ui/PearlDot';

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="container-nacre grid min-h-[70svh] place-content-center justify-items-center gap-6 py-(--section-pad) text-center">
        <PearlDot className="size-16" />
        <h1 className="type-h1 text-pearl">This page is lost at sea</h1>
        <p className="type-lead max-w-[48ch] text-mist">The link may be old, or the page moved. Head back home.</p>
        <Button href="/">Go home</Button>
      </div>
    </SiteChrome>
  );
}
