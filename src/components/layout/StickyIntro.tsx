import type { CSSProperties } from 'react';
import { BRAND_PATHS } from '@/components/sections/stack-logos';
import { cn } from '@/lib/cn';
import { IntroSkip } from './IntroSkip';
import { StormMount } from './StormMount';

// Around the greeting, never behind it: a top band and a bottom band. The inner ones give way on the narrowest screens
const BUBBLES = [
  { logo: 'React', tone: 'var(--logo-react)', x: 8, y: 10 },
  { logo: 'TypeScript', tone: 'var(--logo-typescript)', x: 27, y: 20, inner: true },
  { logo: 'Next.js', tone: 'var(--logo-nextjs)', x: 50, y: 8 },
  { logo: 'Python', tone: 'var(--logo-python)', x: 73, y: 19, inner: true },
  { logo: 'Node.js', tone: 'var(--logo-nodejs)', x: 92, y: 9 },
  { logo: 'JavaScript', tone: 'var(--logo-javascript)', x: 9, y: 90 },
  { logo: 'PyTorch', tone: 'var(--logo-pytorch)', x: 28, y: 80, inner: true },
  { logo: 'Tailwind CSS', tone: 'var(--logo-tailwind)', x: 50, y: 92 },
  { logo: 'Firebase', tone: 'var(--logo-firebase)', x: 72, y: 81, inner: true },
  { logo: 'GitHub', tone: 'var(--logo-github)', x: 91, y: 91 },
];

// A jagged trunk and a fork, drawn in a tall box and stretched to fit the screen. Separate paths, as a dash pattern
// can't draw two subpaths of one path in turn
const BOLT = ['M58 0 L38 112 L62 128 L30 268 L54 282 L34 400', 'M62 128 L88 196 L76 214 L96 276'];

/**
 * The home page's opening: a 3D storm (src/scene/Storm.tsx) strikes among glass spheres carrying developer logos, and a
 * greeting welcomes the visitor, then the whole sheet lifts away to show the site. Without WebGL or with 3D off, the
 * flat lightning and bubbles here play instead. Server-rendered and timed in CSS (.intro in globals.css), so it still
 * lifts without JavaScript. It plays on every load, any click or key skips it, and reduced motion or a link to a
 * section never shows it. Owner-approved exception to AGENTS.md rule 7.
 */
export function StickyIntro() {
  return (
    <div
      id="intro"
      data-stage=""
      aria-hidden="true"
      className="intro fixed inset-0 z-intro grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,var(--storm-sky),var(--paper)_75%)]"
    >
      <span className="intro-flash absolute inset-0 bg-storm-bolt" />
      {[
        { left: '14%', delay: '200ms', flip: false },
        { left: '70%', delay: '1500ms', flip: true },
        { left: '24%', delay: '3000ms', flip: true },
        { left: '78%', delay: '4200ms', flip: false },
      ].map((b) => (
        <svg
          key={b.left}
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
          fill="none"
          // Stops above the greeting until the screen is wide enough for the bolts to pass beside it
          className={cn('intro-bolt absolute top-0 h-[38%] w-[clamp(4rem,14vw,11rem)] stroke-ink lg:h-[68%]', b.flip && '-scale-x-100')}
          style={{ left: b.left, '--strike': b.delay } as CSSProperties}
        >
          {BOLT.map((d) => (
            <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      ))}

      {BUBBLES.map((b, i) => (
        <span
          key={b.logo}
          className={cn('intro-bubble absolute -translate-x-1/2 -translate-y-1/2', b.inner && 'max-[20em]:hidden')}
          style={{ left: `${b.x}%`, top: `${b.y}%`, '--i': i, '--logo': b.tone } as CSSProperties}
        >
          <span className="intro-float grid size-[clamp(2.75rem,10vmin,5.5rem)] place-items-center intro-glass rounded-full">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-1/2">
              <path d={BRAND_PATHS[b.logo]} />
            </svg>
          </span>
        </span>
      ))}

      <StormMount />

      <div className="intro-greeting relative grid max-w-[48rem] gap-3 px-(--gutter) text-center">
        <p className="intro-title type-h1 text-ink">
          Welcome, <span className="text-accent">curious mind</span>
        </p>
        <p className="type-lead text-ink-2">Every good thing I&apos;ve built began with a question. Come in and look around.</p>
        <p className="intro-hint type-caption text-ink-2">Press any key or tap to enter</p>
      </div>
      <IntroSkip />
    </div>
  );
}
