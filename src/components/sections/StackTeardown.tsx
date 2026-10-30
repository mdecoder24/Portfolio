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

function Logo({ name, index }: { name: string; index: number }) {
  // Its place on the plate, so the marks can pop in one after another
  const style = { '--j': index } as CSSProperties;
  const d = BRAND_PATHS[name];
  if (d)
    return (
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" style={style}>
        <path d={d} />
      </svg>
    );
  const Glyph = IDEA_GLYPHS[name];
  return Glyph ? <Glyph className="size-6" strokeWidth={1.75} style={style} /> : null;
}

/**
 * An exploded view of the stack: one tilted plate per layer carrying its tools' marks. It repeats the list beside it as
 * a picture, so it is hidden from assistive technology; the plates sit apart unless motion is on, then open once.
 */
export function StackTeardown({ skills, className }: { skills: Skill[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('teardown reveal-late', className)}>
      {LAYERS.map(({ group, label }, i) => (
        <div
          key={group}
          // Twice as wide as tall: the tilted plate is about 0.42 of the rail high, which leaves a short gap between layers.
          // min-h-0 lets the ratio win over the plate's square layout box, which is taller than the tilted plate looks
          className="layer relative grid aspect-2/1 min-h-0 place-items-center"
          // Each layer knows its place from the top, so the closed stack can gather there and open in turn
          style={{ '--c': -i, '--i': i, zIndex: LAYERS.length - i } as CSSProperties}
        >
          <p className="layer-label absolute top-0 left-0 type-code text-ink-2">{label}</p>
          <div
            className="plate grid aspect-square grid-cols-3 place-items-center rounded-sm border border-rule-strong bg-plate p-3 text-ink shadow-float"
            style={{ width: `${PLATE * 100}%` }}
          >
            {skills
              .filter((s) => s.group === group)
              .map((s, j) => (
                <Logo key={s.name} name={s.name} index={j} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
