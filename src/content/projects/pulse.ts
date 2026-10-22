import { CaseStudy } from '../schema.ts';

export const pulse = CaseStudy.parse({
  slug: 'pulse',
  kind: 'personal',
  title: 'Pulse',
  context: 'Personal project, 2025',
  outcome: 'A real-time kanban for student teams, used by 300+ students.',
  role: 'Solo developer',
  start: '2025-01',
  end: '2025-04',
  stack: ['Next.js', 'WebSockets', 'PostgreSQL', 'Tailwind CSS'],
  categories: ['full-stack'],
  featured: true,
  media: { src: '/media/pulse/cover.svg', alt: 'Kanban board with three columns and live cursors of teammates' },
  links: [{ label: 'Code', href: 'https://github.com/kushwantkr/pulse' }],
  body: {
    problem: 'Student project teams tracked work in group chats and lost track of who was doing what.',
    built: 'A kanban board where every change appears for teammates instantly, with presence and history.',
    decisions: [
      { title: 'WebSockets with an event log', detail: 'Every change is an event, so reconnecting clients replay what they missed.' },
      { title: 'Optimistic updates', detail: 'Cards move instantly and roll back only if the server disagrees.' },
      { title: 'Free-tier friendly', detail: 'One small server and one database, so it costs nothing to run.' },
    ],
    results: ['300+ students across 4 colleges', 'Median sync delay under 120 ms'],
    differently: 'I would use a CRDT library instead of hand-written conflict rules.',
  },
  placeholder: true,
});
