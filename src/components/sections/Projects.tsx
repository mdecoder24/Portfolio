'use client';

import { useState } from 'react';
import { FilterChip } from '@/components/ui/Chip';
import type { CaseStudy } from '@/content/schema';
import { CaseStudyCard } from './CaseStudyCard';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI and ML' },
  { id: 'full-stack', label: 'Full-stack' },
  { id: '3d-creative', label: '3D and creative' },
  { id: 'tools', label: 'Tools' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

/** The filterable list. Without JavaScript every project shows, which is the "All" state. */
export function ProjectList({ projects }: { projects: CaseStudy[] }) {
  const [filter, setFilter] = useState<FilterId>('all');
  const shown = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter));
  const available = FILTERS.filter((f) => f.id === 'all' || projects.some((p) => p.categories.includes(f.id)));

  return (
    <div className="grid gap-8">
      <div
        role="group"
        aria-label="Filter projects"
        className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {available.map((f) => (
          <FilterChip key={f.id} pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </FilterChip>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'project' : 'projects'} shown
      </p>
      <div className="grid gap-16 max-sm:gap-8">
        {shown.map((p, i) => (
          <CaseStudyCard key={p.slug} study={p} flip={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}
