import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { SceneMount } from '@/components/layout/SceneMount';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { MetalTitle } from '@/components/ui/MetalTitle';
import type { Config, Profile } from '@/content/schema';

/**
 * The photograph's frame, centred behind the name. The 3D scene measures this element and redraws
 * its contents as a pixel mosaic that assembles on load: the photo named in data-src, or the KR monogram when there is
 * no photo yet. The flat image (or a flat KR) hides while the mosaic assembles, and a photo then stays pixelated
 * (data-mosaic="pixel"). It stays flat when 3D is off or motion is reduced.
 */
function Portrait({ src }: { src?: string }) {
  const frame =
    'group/portrait relative block aspect-[4/5] w-[min(84vw,22rem)] sm:w-[25rem] lg:w-[clamp(22rem,32vw,29rem)]';
  const fade =
    'transition-opacity duration-500 group-data-[mosaic=diffusing]/portrait:opacity-0 group-data-[mosaic=pixel]/portrait:opacity-0';
  if (src)
    return (
      <span id="hero-portrait" data-src={src} className={frame}>
        {/* Decorative portrait beside the heading; the h1 carries the accessible name */}
        <Image
          src={src}
          alt=""
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 32vw, 84vw"
          className={`object-contain object-bottom grayscale ${fade}`}
        />
      </span>
    );
  return (
    <span id="hero-portrait" aria-hidden="true" className={`${frame} grid place-items-center`}>
      <span className={`type-h1 text-rule-strong ${fade}`}>KR</span>
    </span>
  );
}

/**
 * Split editorial hero: the left column leads with the name, role, summary, and primary actions; the right column
 * showcases the large borderless portrait (which diffuses in as a 3D pixel mosaic on load), grounded by the four-fact
 * strip across the bottom.
 */
export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  const fullName = profile.name.trim().replace(/\s+/g, ' ');
  const word =
    'type-display whitespace-nowrap text-[length:clamp(1.65rem,4.6vw,3.25rem)] lg:text-[length:clamp(2.2rem,3.25vw,3.75rem)] leading-none [&_.w]:mr-[0.14em] [&_.w:last-child]:mr-0 [&_.w]:pb-[0.06em]';

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--nav-height) flex flex-col justify-between overflow-hidden lg:min-h-svh"
    >
      {/* Star dust and the portrait mosaic; a radial vignette keeps the edges quiet */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_42%,var(--tint),var(--paper)_72%)]" />
      {config.flags.threeD && (
        <div className="absolute inset-0 -z-10">
          <SceneMount />
        </div>
      )}

      <div className="container-kit my-auto grid gap-10 pb-8 pt-[calc(var(--nav-height)+var(--space-6))] sm:gap-12 sm:pb-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="grid content-start gap-5 lg:col-span-7 sm:gap-6">
            <h1 id="hero-title" className="grid gap-3 sm:gap-4">
              <MetalTitle as="span" text={fullName} entrance="load" className={`${word} [--rise-delay:80ms]`} />
              <span className="sr-only">, </span>
              <span className="rise type-h3 font-medium text-ink [--rise-delay:240ms]">Full-stack &amp; AI engineer</span>
            </h1>

            <p className="rise max-w-[46ch] type-lead text-ink [--rise-delay:320ms]">
              {profile.headline}. <span className="text-ink-2">{profile.subheadline}</span>
            </p>

            <div className="rise flex flex-wrap gap-3 pt-1 [--rise-delay:400ms]">
              <Button href="#work">
                View my work
                <ArrowDown className="nudge-down size-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
              <Button href="#contact" variant="secondary">
                Get in touch
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div aria-hidden="true" className="grid place-items-center lg:col-span-5 lg:justify-self-end">
            <Portrait src={profile.portrait} />
          </div>
        </div>

        <dl className="rise grid grid-cols-2 border-t border-rule lg:grid-cols-4 [--rise-delay:460ms]">
          {profile.facts.map((f) => (
            <div
              key={f.term}
              className="grid content-start gap-1 border-rule py-5 max-lg:odd:pr-4 max-lg:even:border-l max-lg:even:pl-4 max-lg:[&:nth-child(n+3)]:border-t lg:px-5 lg:first:pl-0 lg:[&+&]:border-l"
            >
              <dt className="type-code text-ink-2">{f.term}</dt>
              <dd className="type-ui text-ink">
                {/* Starts once the strip has risen in */}
                <CountUp text={f.detail} delay={500} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
