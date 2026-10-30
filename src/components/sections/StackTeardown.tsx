import type { CSSProperties } from 'react';
import type { Skill } from '@/content/schema';
import { cn } from '@/lib/cn';
import { BRAND_PATHS, IDEA_GLYPHS } from './stack-logos';

// Top to bottom as the parts of a product sit: what people touch first, the cloud it all runs on last
const LAYERS: { group: Skill['group']; label: string }[] = [
  { group: 'frontend', label: 'Frontend' },
  { group: 'backend', label: 'Backend and databases' },
  { group: 'ai-ml', label: 'AI and ML' },
  { group: 'ml-libraries', label: 'ML frameworks' },
  { group: 'languages', label: 'Languages' },
  { group: 'cloud', label: 'Cloud and DevOps' },
];

// Plate side as a share of the rail. Tilted, its diagonal is 1.41 times the side, so 0.6 leaves a margin each side
const PLATE = 0.6;
// The guide lines run through the plates' side corners and centre, half a diagonal either side of the middle
const REACH = PLATE * Math.SQRT1_2 * 100;
const AXES = [50 - REACH, 50, 50 + REACH];

function Logo({ name }: { name: string }) {
  const d = BRAND_PATHS[name];
  if (d)
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
        <path d={d} />
      </svg>
    );
  const Glyph = IDEA_GLYPHS[name];
  return Glyph ? <Glyph className="size-6" strokeWidth={1.75} /> : null;
}

/**
 * An exploded view of the stack: one tilted plate per layer carrying its tools' marks. It repeats the list beside it as
 * a picture, so it is hidden from assistive technology; the plates sit apart unless motion is on, then open once.
 */
export function StackTeardown({ skills, className }: { skills: Skill[]; className?: string }) {
  return (
    // Six equal rows share whatever height the rail gives, so the exploded stack runs the length of the section
    <div aria-hidden="true" className={cn('teardown reveal-late relative grid grid-rows-6', className)}>
      {/* Guide lines, as in an exploded drawing: they show in the gaps between plates and draw in once it opens */}
      {AXES.map((x) => (
        <span key={x} className="axis" style={{ left: `${x}%` }} />
      ))}
      {LAYERS.map(({ group, label }, i) => (
        <div
          key={group}
          className="layer relative grid min-h-48 place-items-center"
          // Each layer knows how far it sits below the top one, so the closed stack can gather there
          style={{ '--c': -i, zIndex: LAYERS.length - i } as CSSProperties}
        >
          {/* The paper behind the name hides the guide line running past it */}
          <p className="layer-label absolute top-0 left-0 bg-paper pr-2 type-code text-ink-2">{label}</p>
          <div
            className="plate grid aspect-square grid-cols-3 place-items-center rounded-sm border border-rule-strong bg-plate p-3 text-ink shadow-float"
            style={{ width: `${PLATE * 100}%` }}
          >
            {skills
              .filter((s) => s.group === group)
              .map((s) => (
                <Logo key={s.name} name={s.name} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
