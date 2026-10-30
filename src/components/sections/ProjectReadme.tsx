import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import type { CaseStudy } from '@/content/schema';

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <h5 className="type-code text-ink-2">{title}</h5>
      {children}
    </div>
  );
}

/**
 * The card's "View details" button and the short README it opens. Built on the popover attribute, so it opens, closes
 * on Escape or an outside click, and sits above the page without any JavaScript.
 */
export function ProjectReadme({ study }: { study: CaseStudy }) {
  const { readme } = study;
  if (!readme) return null;
  const id = `readme-${study.slug}`;
  return (
    <>
      <button type="button" popoverTarget={id} className={buttonClasses({ variant: 'secondary' })}>
        View details
        <span className="sr-only">: {study.title}</span>
      </button>
      <div
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={`${id}-title`}
        // Fades and settles in from just below full size; under reduced motion it only fades
        className="readme m-auto max-h-[85dvh] w-[min(40rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-md border border-rule-strong bg-paper p-6 text-ink shadow-float backdrop:bg-paper-veil sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="type-code text-ink-2">README.md</p>
            <p id={`${id}-title`} className="type-h3 text-ink">
              {study.title}
            </p>
          </div>
          <button
            type="button"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label="Close"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-rule hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 grid gap-6">
          <Part title="Overview">
            <p className="type-body text-ink-2">{readme.overview}</p>
          </Part>
          <Part title="Features">
            <ul className="grid list-disc gap-1 pl-5 type-body text-ink-2 marker:text-accent">
              {readme.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Part>
          <Part title="Tech stack">
            <p className="type-body text-ink-2">{readme.tech.join(', ')}</p>
          </Part>
          <Part title="Run it locally">
            {readme.needs && <p className="type-body text-ink-2">Needs {readme.needs}.</p>}
            <pre className="overflow-x-auto rounded-sm border border-rule bg-plate p-4 type-code text-ink">
              <code>{readme.run.join('\n')}</code>
            </pre>
          </Part>
        </div>
      </div>
    </>
  );
}
