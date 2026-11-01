import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { SceneMount } from '@/components/layout/SceneMount';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { MetalTitle } from '@/components/ui/MetalTitle';
import { PatrolBot } from '@/components/ui/PatrolBot';
import { SocialLinks } from '@/components/ui/SocialLinks';
import type { Config, Profile } from '@/content/schema';

/**
 * The photograph's frame, centred behind the name. The 3D scene measures this element and redraws
 * its contents as a pixel mosaic that assembles on load: the photo named in data-src, or the KR monogram when there is
 * no photo yet. The flat image (or a flat KR) hides while the mosaic assembles and whenever it is pixels
 * (data-mosaic="pixel": scrolling away diffuses it into dust, the cursor parts it); at rest (data-mosaic="clear") the
 * sharp photo fades back in over the cells. The monogram stays as pixels. It stays flat when 3D is off or motion is
 * reduced.
 */
function Portrait({ src }: { src?: string }) {
  // Sized by the screen's height as well as its width, so the photo, name and actions share one screen
  const frame =
    'group/portrait relative block aspect-[4/5] w-[min(92vw,clamp(11rem,52svh,24rem))] lg:w-[clamp(22rem,60svh,36rem)]';
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
          sizes="(min-width: 1024px) 36rem, 92vw"
          className={`object-contain object-bottom grayscale mask-b-from-40% mask-b-to-90% ${fade}`}
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
 * Centred hero: the large portrait (which assembles from a 3D pixel mosaic on load) fades out through its lower half,
 * where the name and role sit in front of it. The actions flank the name on wide screens and sit under it on phones;
 * the four-fact strip grounds the screen.
 */
export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  const fullName = profile.name.trim().replace(/\s+/g, ' ');
  // The name holds one line, so on the narrowest screens its size follows the width: it runs about 10.8 em long
  const word =
    'type-display whitespace-nowrap text-[length:min(clamp(1.75rem,7vw,3.25rem),calc((100vw-2*var(--gutter))/10.8))] lg:text-[length:clamp(3rem,4.6vw,4.5rem)] leading-none [&_.w]:mr-[0.14em] [&_.w:last-child]:mr-0 [&_.w]:pb-[0.06em]';

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--nav-height) flex flex-col justify-between overflow-hidden lg:min-h-svh"
    >
      {/* Star dust and the portrait mosaic; a radial vignette keeps the edges quiet */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_32%,var(--tint),var(--paper)_72%)]" />
      {config.flags.threeD && (
        <div className="absolute inset-0 -z-10">
          <SceneMount />
        </div>
      )}

      <div className="container-kit my-auto grid gap-10 pb-8 pt-[calc(var(--nav-height)+var(--space-4))] sm:gap-12 sm:pb-10">
        <div className="flex flex-col items-center text-center">
          <div aria-hidden="true">
            <Portrait src={profile.portrait} />
          </div>

          {/* Pulled up in front of the portrait's faded lower half. On wide screens the actions flank the name, level
              with the role line, so the photo keeps the centre to itself */}
          <div className="relative -mt-28 grid w-full justify-items-center gap-6 sm:-mt-36 max-lg:[@media(max-height:480px)]:-mt-20 lg:-mt-44 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <h1 id="hero-title" className="grid justify-items-center gap-2 sm:gap-3 lg:col-start-2 lg:row-start-1">
              <MetalTitle as="span" text={fullName} entrance="load" className={`${word} [--rise-delay:80ms]`} />
              <span className="sr-only">, </span>
              <span className="rise type-h3 font-medium text-ink [--rise-delay:240ms]">Full-stack &amp; AI engineer</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-3 lg:contents">
              <Button
                href="#work"
                size="sm"
                className="rise [--rise-delay:320ms] lg:col-start-1 lg:row-start-1 lg:justify-self-start"
              >
                View my work
                <ArrowDown className="nudge-down size-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
              <Button
                href="#contact"
                variant="secondary"
                size="sm"
                className="rise [--rise-delay:380ms] lg:col-start-3 lg:row-start-1 lg:justify-self-end"
              >
                Get in touch
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
            </div>

            {/* Under the role on wide screens, under the actions on phones */}
            <SocialLinks
              links={config.links}
              className="rise justify-center [--rise-delay:440ms] lg:col-start-2 lg:row-start-2"
            />
          </div>
        </div>

        <div className="rise relative [--rise-delay:460ms]">
          <PatrolBot />
          <dl className="grid grid-cols-2 border-t border-rule text-center lg:grid-cols-4">
            {profile.facts.map((f) => (
              <div
                key={f.term}
                className="grid content-start gap-1 border-rule px-3 py-5 max-lg:even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:[&+&]:border-l"
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
      </div>
    </section>
  );
}
