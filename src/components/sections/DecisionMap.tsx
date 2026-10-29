'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';

/**
 * One project's cover with its decisions pinned on top. The markup is complete on the server: each pin links to its
 * decision, so without JavaScript the pins still work. JavaScript only pairs a pin with its decision while hovered or
 * focused, which is the point of the section.
 */
export function DecisionMap({ study }: { study: CaseStudy }) {
  const [active, setActive] = useState<number | null>(null);
  const id = (i: number) => `decision-${study.slug}-${i + 1}`;
  const pair = (i: number) => ({
    onPointerEnter: () => setActive(i),
    onPointerLeave: () => setActive(null),
    onFocus: () => setActive(i),
    onBlur: () => setActive(null),
  });

  return (
    <div
      data-dim={active !== null || undefined}
      className="group/map grid items-start gap-8 lg:grid-cols-12 lg:gap-8"
    >
      <figure className="relative overflow-hidden rounded-md border border-rule bg-plate lg:col-span-7">
        <Image
          src={study.media.src}
          alt={study.media.alt}
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 640px, 100vw"
          unoptimized={study.media.src.endsWith('.svg')}
          className="h-auto w-full"
        />
        {study.body.decisions.map((d, i) =>
          d.at ? (
            <a
              key={d.title}
              href={`#${id(i)}`}
              aria-label={`Decision ${i + 1}: ${d.title}`}
              data-on={active === i || undefined}
              // A pin only highlights its decision; jumping the page to the list would undo the pairing
              onClick={(e) => {
                e.preventDefault();
                setActive(i);
              }}
              {...pair(i)}
              className="group/pin absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-control focus-visible:outline-none"
              style={{ left: `${d.at.x}%`, top: `${d.at.y}%` }}
            >
              {/* The visible pin sits inside a 44 px target; it drops in each time its project is picked */}
              <span
                className={cn(
                  'rise absolute inset-2 grid place-items-center rounded-control border-[1.5px] border-ink-2 bg-paper type-code text-ink',
                  'transition-[opacity,scale,background-color,border-color,color] duration-150 ease-(--ease-out-quint)',
                  'group-data-dim/map:opacity-50 group-focus-visible/pin:shadow-focus',
                  'group-data-on/pin:scale-110 group-data-on/pin:border-accent group-data-on/pin:bg-accent group-data-on/pin:text-on-accent group-data-on/pin:opacity-100',
                )}
                style={{ '--rise-delay': `${120 + i * 60}ms` } as CSSProperties}
              >
                {i + 1}
              </span>
              {/* Redline tick pointing toward the list */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-[calc(100%-0.5rem)] h-px w-3 bg-rule-strong transition-colors duration-150 group-data-on/pin:bg-accent"
              />
            </a>
          ) : null,
        )}
      </figure>

      <ol className="grid gap-2 lg:col-span-5">
        {study.body.decisions.map((d, i) => (
          <li
            key={d.title}
            id={id(i)}
            data-on={active === i || undefined}
            {...pair(i)}
            className={cn(
              'grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-l-[1.5px] border-rule py-3 pl-4',
              'transition-[border-color,opacity] duration-150 ease-(--ease-out-quint)',
              'group-data-dim/map:opacity-60 data-on:border-accent data-on:opacity-100 target:border-accent',
            )}
          >
            <span className="type-code text-ink-2">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="type-h4 text-ink">{d.title}</h4>
            <p className="col-start-2 max-w-[44ch] type-body text-ink-2">{d.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
