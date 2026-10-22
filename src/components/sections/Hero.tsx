import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PearlDot } from '@/components/ui/PearlDot';
import type { Config, Profile } from '@/content/schema';
import { Poster } from '@/scene/Poster';

export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  const { availability } = config;
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* The poster holds the 3D scene's place and fades out when the canvas is ready */}
      <Poster className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-400 ease-nacre-out in-data-[scene=ready]:opacity-0" />
      <div className="container-nacre grid min-h-[calc(var(--hero-min-height)-var(--nav-height))] content-center py-16 max-sm:content-end max-sm:pt-[38svh]">
        <div className="grid max-w-[44rem] gap-8 lg:max-w-[calc(7/12*100%)]">
          <h1 id="hero-title" className="grid gap-4">
            <span className="type-lead font-semibold text-mist">{profile.nameLine}</span>
            <span className="type-display text-pearl">
              {profile.headline}
              <span className="sr-only">.</span>
              <PearlDot id="hero-dot" className="ml-[0.04em]" />
            </span>
          </h1>
          <p className="type-lead max-w-[60ch] text-pearl">{profile.subheadline}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#projects">View my work</Button>
            <Button href="#freelance" variant="secondary">
              Hire me for a project
            </Button>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Status">
            <li>
              <Badge tone="neutral">{profile.employment}</Badge>
            </li>
            {config.flags.showFreelance && (
              <li>
                <Badge tone={availability.freelance}>{availability.freelanceLabel}</Badge>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
