import { Skill } from './schema.ts';

const daily = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Git'];
const comfortable = [
  'Three.js / React Three Fiber',
  'FastAPI',
  'Docker',
  'MongoDB',
  'AI SDK',
  'LangChain',
  'REST and GraphQL',
  'AWS basics',
];
const exploring = ['GLSL shaders', 'Rust', 'Kubernetes', 'LLM fine-tuning', 'Agent evaluation'];

// Each skill links to the strongest evidence of it (a case study, a timeline entry, or a repo)
const evidence: Record<string, string[]> = {
  TypeScript: ['/projects/codelens', '#experience'],
  JavaScript: ['/projects/pulse'],
  React: ['/freelance/cafe-qr-ordering'],
  'Next.js': ['/freelance/clinic-booking', '#experience'],
  'Node.js': ['/freelance/clinic-booking', '#experience'],
  Python: ['/projects/documind'],
  'Tailwind CSS': ['/projects/pulse'],
  PostgreSQL: ['/freelance/realty-lead-dashboard', '#experience'],
  Git: ['https://github.com/kushwantkr'],
  'Three.js / React Three Fiber': ['/projects/orbit', '/freelance/skincare-3d-launch'],
  FastAPI: ['/projects/documind'],
  'AI SDK': ['/projects/documind'],
  'GLSL shaders': ['/projects/orbit'],
};

export const skills = Skill.array().parse(
  [
    ...daily.map((name) => ({ name, tier: 'daily' })),
    ...comfortable.map((name) => ({ name, tier: 'comfortable' })),
    ...exploring.map((name) => ({ name, tier: 'exploring' })),
  ].map((s) => ({ ...s, evidence: evidence[s.name] ?? [], placeholder: true })),
);

export const tierCopy = {
  daily: { name: 'Daily driver', note: 'Used every week at work or on client projects.' },
  comfortable: { name: 'Comfortable', note: 'Shipped at least one real project with it.' },
  exploring: { name: 'Exploring', note: "Learning now; ask me what I've built so far." },
} as const;
