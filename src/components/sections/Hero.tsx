import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { SceneMount } from '@/components/layout/SceneMount';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetalTitle } from '@/components/ui/MetalTitle';
import type { Config, Profile } from '@/content/schema';

/**
 * The photograph's frame, centred behind the name. The 3D scene measures this element and redraws
 * its contents as a pixel mosaic that assembles on load: the photo named in data-src, or the KR monogram when there is
 * no photo yet. The flat image (or a flat KR) shows until the mosaic is ready (data-mosaic="on"), and stays when 3D
 * is off.
 */
function Portrait({ src }: { src?: string }) {
  const frame =
    'group/portrait relative block aspect-[4/5] w-[min(60vw,16rem)] overflow-hidden rounded-lg bg-plate/40 lg:w-[clamp(13rem,19vw,18rem)]' +
    // The outline fades out toward the bottom, so no hard edge runs through the letters laid over it
    ' after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:border after:border-rule after:[mask-image:linear-gradient(black_45%,transparent_85%)]';
  const fade = 'transition-opacity duration-700 group-data-[mosaic=on]/portrait:opacity-0';
  // The name crosses the lower part of the frame; fading the photo (and the mosaic drawn under it) into the page
  // there keeps the metal letters readable against bright pixels
  const veil = <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-paper to-transparent" />;
  if (src)
    return (
      <span id="hero-portrait" data-src={src} className={frame}>
        {/* Inside the h1, behind the name, so the photo needs no alt text of its own */}
        <Image src={src} alt="" fill priority sizes="(min-width: 1024px) 19vw, 60vw" className={`object-cover grayscale ${fade}`} />
        {veil}
      </span>
    );
  return (
    <span id="hero-portrait" aria-hidden="true" className={`${frame} grid place-items-center`}>
      <span className={`type-h1 text-rule-strong ${fade}`}>KR</span>
      {veil}
    </span>
  );
}

/**
 * The first viewport answers a recruiter's questions in order: who (the name over the portrait), what (the role),
 * where and for whom (employer, city), and whether I'm free (the availability badge), then four facts in a ruled strip.
 */
export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  const [first, ...rest] = profile.name.split(' ');
  const last = rest.join(' ');
  // The name is one line laid over the portrait, so it stays a single lockup instead of two halves around the frame.
  // On wide screens it steps down from the full display size so the whole name fits the container
  const word = 'type-display lg:text-[length:min(10.5vw,11rem)]';

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
            {/* Portrait and name share one grid cell; the name sits on the frame's lower edge and overhangs it. The
                wrapper carries the name's size so its bottom padding reserves exactly that overhang */}
            <span className={`grid place-items-center pb-[0.32em] ${word}`}>
              <span className="rise [grid-area:1/1] [--rise-delay:40ms]">
                <Portrait src={profile.portrait} />
              </span>
              <span className="relative flex translate-y-[0.32em] flex-wrap items-baseline justify-center self-end gap-x-[0.18em] [grid-area:1/1]">
                <MetalTitle as="span" text={first} entrance="load" className={`${word} [--rise-delay:120ms]`} />
                <span className="sr-only"> </span>
                {last && <MetalTitle as="span" text={last} entrance="load" className={`${word} [--rise-delay:200ms]`} />}
              </span>
            </span>
            <span className="sr-only">, </span>
            <span className="rise type-h3 font-medium text-ink [--rise-delay:280ms]">Full-stack &amp; AI engineer</span>
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
