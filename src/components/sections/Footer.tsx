import { NAV_ITEMS } from '@/components/layout/navItems';
import { PreferenceToggles } from '@/components/layout/PreferenceToggles';
import type { Config } from '@/content/schema';

export function Footer({ config, name }: { config: Config; name: string }) {
  const updated = new Date(`${config.site.lastUpdated}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const link = 'rounded-xs text-ink-2 underline-offset-4 hover:text-ink hover:underline focus-visible:outline-none focus-visible:shadow-focus';

  return (
    <footer className="relative z-content border-t border-rule">
      <div className="container-kit grid gap-8 py-12 type-small text-ink-2 [&>*]:min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_ITEMS.map((i) => (
                <li key={i.id}>
                  <a href={`/#${i.id}`} className={link}>
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Elsewhere">
            <li>
              <a href={config.links.github} className={link}>
                GitHub
              </a>
            </li>
            <li>
              <a href={config.links.linkedin} className={link}>
                LinkedIn
              </a>
            </li>
            {config.links.repo && (
              <li>
                <a href={config.links.repo} className={link}>
                  View source
                </a>
              </li>
            )}
            <li>
              <a href="/privacy" className={link}>
                Privacy
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <PreferenceToggles threeD={config.flags.threeD} />
          <p className="tabular">
            Last updated <time dateTime={config.site.lastUpdated}>{updated}</time> · © {config.site.lastUpdated.slice(0, 4)}{' '}
            {name}
          </p>
        </div>
        <p aria-hidden="true" className="metal depth -mb-[0.12em] select-none whitespace-nowrap text-center text-[clamp(2.5rem,12.4vw,15rem)] leading-[0.82] font-black uppercase tracking-[-0.055em] opacity-90">
          Kushwant KR
        </p>
      </div>
    </footer>
  );
}
