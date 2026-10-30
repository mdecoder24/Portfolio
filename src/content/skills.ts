import { Skill } from './schema.ts';

// The résumé's technical skills, tools only: practices such as Agile or responsive design live in the experience
const groups: Record<Skill['group'], string[]> = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Dart', 'SQL', 'HTML5', 'CSS3'],
  frontend: ['React', 'Redux', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Framer Motion'],
  backend: ['Node.js', 'REST APIs', 'Microservices', 'PostgreSQL (Supabase)', 'Firebase', 'NoSQL', 'Prisma'],
  'ai-ml': [
    'Machine learning',
    'Deep learning',
    'Computer vision',
    'Generative AI',
    'LLM integration',
    'RAG',
    'Prompt engineering',
    'Vector search (pgvector)',
    'Gemini API',
  ],
  'ml-libraries': [
    'PyTorch',
    'TensorFlow',
    'Keras',
    'scikit-learn',
    'Hugging Face',
    'OpenCV',
    'MediaPipe',
    'Pandas',
    'NumPy',
  ],
  cloud: ['AWS (EC2, Lambda, S3)', 'GitHub Actions', 'Vercel', 'Git', 'GitHub'],
};

// Each skill links to the strongest evidence of it (a case study, a timeline entry, or a repo)
const evidence: Record<string, string[]> = {
  TypeScript: ['/projects/tedx-mlrit', '#experience'],
  JavaScript: ['/projects/tedx-mlrit', '#experience'],
  React: ['/projects/sign-language-recognition', '#experience'],
  'Tailwind CSS': ['/projects/mun-website'],
  'shadcn/ui': ['/projects/mun-website'],
  'Next.js': ['/projects/mun-website', '#experience'],
  'PostgreSQL (Supabase)': ['/projects/tedx-mlrit', '#experience'],
  Firebase: ['/projects/sign-language-recognition'],
  'Computer vision': ['/projects/sign-language-recognition'],
  TensorFlow: ['/projects/sign-language-recognition'],
  MediaPipe: ['/projects/sign-language-recognition'],
  Vercel: ['/projects/mun-website', '#experience'],
  GitHub: ['https://github.com/mdecoder24'],
};

export const skills = Skill.array().parse(
  Object.entries(groups).flatMap(([group, names]) =>
    names.map((name) => ({ name, group, evidence: evidence[name] ?? [] })),
  ),
);
