import { Service } from './schema.ts';

export const services = Service.array().parse([
  {
    id: 'web-apps',
    name: 'Web apps and dashboards',
    description: 'Internal tools and customer portals that replace spreadsheets and phone calls.',
    timeline: 'Usually 4–8 weeks',
    stack: 'Next.js, PostgreSQL, Node.js',
    startingFrom: 60000,
    placeholder: true,
  },
  {
    id: 'ai-chatbots',
    name: 'AI chatbots and automation',
    description: 'A website or WhatsApp assistant that answers customers and books appointments.',
    timeline: 'Usually 3–6 weeks',
    stack: 'Next.js, Node.js, an LLM API',
    startingFrom: 40000,
    placeholder: true,
  },
  {
    id: 'landing-pages',
    name: 'Landing pages',
    description: 'A fast, search-friendly page that explains your product and collects enquiries.',
    timeline: 'Usually 1–2 weeks',
    stack: 'Next.js, Tailwind CSS',
    startingFrom: 20000,
    placeholder: true,
  },
  {
    id: '3d-interactive',
    name: '3D and interactive experiences',
    description: 'Product viewers and launch pages that people remember, tuned for phones.',
    timeline: 'Usually 2–4 weeks',
    stack: 'React Three Fiber, GLSL',
    startingFrom: 50000,
    placeholder: true,
  },
]);

export const process = [
  { name: 'Discovery call', description: 'A 30-minute call to understand the problem, the users, and the deadline.' },
  { name: 'Proposal and quote', description: 'A written scope, a fixed quote, and a timeline within 2 days.' },
  { name: 'Build with weekly demos', description: 'A working preview link every week, so nothing is a surprise.' },
  { name: 'Launch and support', description: 'Go-live, a handover call, and 30 days of fixes included.' },
];
