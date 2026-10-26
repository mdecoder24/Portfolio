import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { SceneMount } from '@/components/layout/SceneMount';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetalTitle } from '@/components/ui/MetalTitle';
import type { Config, Profile } from '@/content/schema';

/**
 * The photograph's frame, between the two halves of the name. While it is empty it is the stage for the 3D KR monogram:
 * the scene measures this element (#hero-portrait[data-empty]) and draws the monogram inside it. A flat KR shows until
 * the canvas is ready, and stays when 3D is off.
 */
function Portrait({ src }: { src?: string }) {
  const frame = 'relative block aspect-[4/5] w-[min(52vw,14rem)] overflow-hidden rounded-lg border border-rule lg:w-[clamp(12rem,19vw,18rem)]';
  if (src)
    return (
      <span id="hero-portrait" className={frame}>
        <Image src={src} alt="" fill priority sizes="(min-width: 1024px) 19vw, 52vw" className="object-cover" />
      </span>
    );
  return (
    <span
      id="hero-portrait"
      data-empty=""
      aria-hidden="true"
      className={`${frame} grid place-items-center bg-[radial-gradient(ellipse_at_50%_30%,var(--plate-hover),var(--tint)_75%)]`}
    >
      <span className="type-h1 text-rule-strong transition-opacity duration-700 in-data-[scene=ready]:opacity-0">KR</span>
    </span>
  );
}

/**
 * The first viewport answers a recruiter's questions in order: who (the name around the portrait), what (the role),
 * where and for whom (employer, city), and whether I'm free (the availability badge), then four facts in a ruled strip.
 */
export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  const [first, ...rest] = profile.name.split(' ');
  const last = rest.join(' ');
  // On wide screens the name shares its line with the portrait, so it steps down a size to fit beside it
  const word = 'type-display lg:text-[length:min(10.4vw,10.5rem)]';

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--nav-height) flex flex-col justify-end overflow-hidden lg:min-h-svh"
    >
      {/* Star dust and the KR mosaic; a radial vignette keeps the edges quiet */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--tint),var(--paper)_70%)]" />
      {config.flags.threeD && (
        <div className="absolute inset-0 -z-10">
          <SceneMount />
        </div>
      )}

      <div className="container-kit grid gap-10 pb-8 pt-[calc(var(--nav-height)+var(--space-7))] sm:gap-12 sm:pb-10">
        <div className="grid justify-items-center gap-6 text-center sm:gap-8">
          <div className="rise">
            <Badge tone={config.availability.freelance}>{config.availability.freelanceLabel}</Badge>
          </div>
          <h1 id="hero-title" className="grid justify-items-center gap-5 sm:gap-6">
            <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6 lg:flex-nowrap lg:gap-x-[3vw]">
              <span className="rise order-first flex basis-full justify-center [--rise-delay:40ms] lg:order-none lg:basis-auto">
                <Portrait src={profile.portrait} />
              </span>
              <MetalTitle as="span" text={first} entrance="load" className={`${word} lg:-order-1 [--rise-delay:120ms]`} />
              <span className="sr-only"> </span>
              {last && <MetalTitle as="span" text={last} entrance="load" className={`${word} [--rise-delay:200ms]`} />}
            </span>
            <span className="sr-only">, </span>
            <span className="rise type-h3 font-medium text-ink-2 [--rise-delay:280ms]">Full-stack &amp; AI engineer</span>
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
