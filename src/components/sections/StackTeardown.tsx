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

function Logo({ name }: { name: string }) {
  const d = BRAND_PATHS[name];
  if (d)
    return (
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d={d} />
      </svg>
    );
  const Glyph = IDEA_GLYPHS[name];
  return Glyph ? <Glyph className="size-7" strokeWidth={1.75} /> : null;
}

/**
 * An exploded view of the stack: one tilted plate per layer carrying its tools' marks. It repeats the list beside it as
 * a picture, so it is hidden from assistive technology; the plates sit apart unless motion is on, then open once.
 */
export function StackTeardown({ skills, className }: { skills: Skill[]; className?: string }) {
  return (
    // Six equal rows share whatever height the rail gives, so the exploded stack runs the length of the section
    <div aria-hidden="true" className={cn('teardown reveal-late grid grid-rows-6', className)}>
      {LAYERS.map(({ group, label }, i) => (
        <div
          key={group}
          className="layer relative grid min-h-48 place-items-center"
          // Each layer knows how far it sits below the top one, so the closed stack can gather there
          style={{ '--c': -i, zIndex: LAYERS.length - i } as CSSProperties}
        >
          <p className="layer-label absolute top-0 left-0 type-code text-ink-2">{label}</p>
          {/* About 70% of the rail: the diagonal of a square is 1.41 times its side, so the tilted plate just fits */}
          <div className="plate grid aspect-square w-7/10 grid-cols-3 place-items-center rounded-sm border border-rule-strong bg-plate p-3 text-ink shadow-float">
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
