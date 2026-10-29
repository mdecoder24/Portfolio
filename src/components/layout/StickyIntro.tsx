import type { CSSProperties } from 'react';
import type { Profile } from '@/content/schema';
import { cn } from '@/lib/cn';
import { IntroSkip } from './IntroSkip';

/**
 * The home page's opening: a blank page, then sticky notes slap on one by one and their words write themselves in,
 * then the whole sheet lifts away to show the site. Server-rendered and timed in CSS (.intro in globals.css), so the
 * blank comes first and the sheet still lifts without JavaScript. It plays once per session, any click or key skips
 * it, and reduced motion never shows it. Owner-approved exception to AGENTS.md rule 7.
 */
export function StickyIntro({ profile }: { profile: Profile }) {
  const first = profile.name.trim().split(/\s+/)[0];
  const shipped = profile.facts.find((f) => f.term === 'Freelance')?.detail;
  const notes = [
    { text: 'Welcome', tone: 'accent', tilt: -4 },
    { text: `I'm ${first}`, tone: 'cream', tilt: 3 },
    { text: 'Full-stack & AI engineer', tone: 'cream', tilt: -2 },
    ...(shipped ? [{ text: shipped, tone: 'cream', tilt: 5 }] : []),
  ];

  return (
    <div id="intro" data-stage="" aria-hidden="true" className="intro fixed inset-0 z-intro grid place-items-center bg-paper">
      <div className="grid w-full max-w-[34rem] grid-cols-2 gap-4 px-(--gutter) sm:gap-6">
        {notes.map((n, i) => (
          <div
            key={n.text}
            className={cn(
              'intro-note relative grid aspect-square content-center rounded-xs p-4 shadow-float sm:p-6',
              n.tone === 'accent' ? 'bg-accent text-on-accent' : 'bg-cream text-on-cream',
            )}
            style={{ '--tilt': `${n.tilt}deg`, '--i': i } as CSSProperties}
          >
            {/* A strip of tape holding the note up */}
            <span className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-rule-strong" />
            <p className="intro-write type-h4 font-semibold leading-tight">{n.text}</p>
          </div>
        ))}
      </div>
      <IntroSkip />
    </div>
  );
}
