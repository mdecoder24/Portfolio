import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { SceneMount } from '@/components/layout/SceneMount';
import { MetalTitle } from '@/components/ui/MetalTitle';
import type { Config, Profile } from '@/content/schema';

export function Hero({ profile, config }: { profile: Profile; config: Config }) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate -mt-(--nav-height) flex min-h-svh flex-col justify-end overflow-hidden"
    >
      {/* Star dust and the KR mosaic; a radial vignette keeps the edges quiet */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--tint),var(--paper)_72%)]" />
      {config.flags.threeD && (
        <div className="absolute inset-0 -z-10">
          <SceneMount />
        </div>
      )}

      <div className="container-kit grid gap-6 pb-10 pt-32 sm:pb-14">
        <MetalTitle as="p" text="PORTFOLIO" letters decorative delay={2} className="type-mega select-none text-center" />
        <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="reveal grid gap-3 [--reveal-delay:120ms]">
            <h1 id="hero-title" className="text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
              <span className="sr-only">{profile.name}, </span>
              Full-stack &amp; AI <span className="type-accent font-normal">engineer</span>
            </h1>
            <p className="max-w-[46ch] type-small text-ink-2">
              {profile.headline}. {profile.employment}, freelancing from {profile.location.city}.
            </p>
          </div>
          <div className="reveal flex items-center gap-3 [--reveal-delay:220ms]">
            <a
              href="#work"
              aria-label="Jump to my work"
              className="grid size-12 place-items-center rounded-full border border-rule-strong text-ink transition-[background-color,color,rotate] duration-300 ease-out-quint hover:-rotate-45 hover:bg-cream hover:text-on-cream focus-visible:outline-none focus-visible:shadow-focus"
            >
              <ArrowDownLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-control border border-rule-strong px-6 type-ui text-ink transition-colors duration-300 hover:bg-cream hover:text-on-cream focus-visible:outline-none focus-visible:shadow-focus"
            >
              <span className="type-accent text-[1.0625rem]">Contact</span>
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
