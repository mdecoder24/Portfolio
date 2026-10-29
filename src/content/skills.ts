import { Skill } from './schema.ts';

// The résumé's technical skills, tools only: practices such as Agile or responsive design live in the experience
const groups: Record<Skill['group'], string[]> = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Dart', 'SQL', 'HTML5', 'CSS3'],
  frontend: ['React', 'Redux', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Framer Motion'],
  backend: ['Node.js', 'REST APIs', 'Microservices', 'PostgreSQL (Supabase)', 'Firebase', 'NoSQL', 'Prisma'],
  'ai-ml': ['LLM integration', 'RAG', 'TensorFlow', 'MediaPipe', 'Gemini API', 'Prompt engineering'],
  cloud: ['AWS (EC2, Lambda, S3)', 'GitHub Actions', 'Vercel', 'Git', 'GitHub'],
};

// Each skill links to the strongest evidence of it (a case study, a timeline entry, or a repo)
const evidence: Record<string, string[]> = {
  TypeScript: ['/projects/tedx-mlrit', '#experience'],
  JavaScript: ['/projects/tedx-mlrit', '#experience'],
  React: ['/projects/sign-language-recognition', '#experience'],
  'Next.js': ['/projects/sensai', '#experience'],
  'Node.js': ['/projects/sensai'],
  'PostgreSQL (Supabase)': ['/projects/tedx-mlrit', '#experience'],
  Firebase: ['/projects/sign-language-recognition'],
  Prisma: ['/projects/sensai'],
  'LLM integration': ['#experience'],
  TensorFlow: ['/projects/sign-language-recognition'],
  MediaPipe: ['/projects/sign-language-recognition'],
  'Gemini API': ['/projects/sensai'],
  Vercel: ['#experience'],
  GitHub: ['https://github.com/mdecoder24'],
};

export const skills = Skill.array().parse(
  Object.entries(groups).flatMap(([group, names]) =>
    names.map((name) => ({ name, group, evidence: evidence[name] ?? [] })),
  ),
);
