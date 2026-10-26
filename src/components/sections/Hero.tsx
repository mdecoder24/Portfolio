import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SceneMount } from '@/components/layout/SceneMount';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetalTitle } from '@/components/ui/MetalTitle';
import type { Config, Profile } from '@/content/schema';

/**
 * The first viewport answers a recruiter's questions in order: who (the name), what (the role), where and for whom
 * (employer, city), and whether I'm free (the availability badge), then the four facts in a ruled strip.
 */
export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--nav-height) flex flex-col justify-end overflow-hidden lg:min-h-svh"
    >
      {/* Star dust and the KR mosaic; a radial vignette keeps the edges quiet */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_35%,var(--tint),var(--paper)_70%)]" />
      {config.flags.threeD && (
        <div className="absolute inset-0 -z-10">
          <SceneMount />
        </div>
      )}

      <div className="container-kit grid gap-10 pb-8 pt-[calc(var(--nav-height)+var(--space-9))] sm:gap-12 sm:pb-10">
        <div className="grid gap-6 sm:gap-8">
          <div className="rise">
            <Badge tone={config.availability.freelance}>{config.availability.freelanceLabel}</Badge>
          </div>
          <h1 id="hero-title" className="grid gap-4 sm:gap-6">
            <MetalTitle as="span" text={profile.name} entrance="load" className="-ml-[0.05em] type-display [--rise-delay:80ms]" />
            <span className="sr-only">, </span>
            <span className="rise type-h3 font-medium text-ink-2 [--rise-delay:280ms]">
              Full-stack &amp; AI engineer
            </span>
          </h1>
        </div>

        <div className="rise grid gap-8 lg:grid-cols-12 lg:items-end [--rise-delay:380ms]">
          <p className="max-w-[44ch] type-lead text-ink lg:col-span-7">
            {profile.headline}. <span className="text-ink-2">{profile.subheadline}</span>
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button href="#work">
              View my work
              <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Button>
            <Button href="#contact" variant="secondary">
              Get in touch
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Button>
          </div>
        </div>

        <dl className="rise grid grid-cols-2 border-t border-rule lg:grid-cols-4 [--rise-delay:460ms]">
          {profile.facts.map((f) => (
            <div
              key={f.term}
              className="grid content-start gap-1 border-rule py-5 max-lg:odd:pr-4 max-lg:even:border-l max-lg:even:pl-4 max-lg:[&:nth-child(n+3)]:border-t lg:px-5 lg:first:pl-0 lg:[&+&]:border-l"
            >
              <dt className="type-code text-ink-2">{f.term}</dt>
              <dd className="type-ui text-ink">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
