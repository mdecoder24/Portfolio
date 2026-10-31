import { CaseStudy } from '../schema.ts';

// From kemplast.in, the Kemplast role in experience.ts, and the repository's README and package.json (31 Oct 2026)
export const kemplast = CaseStudy.parse({
  slug: 'kemplast',
  kind: 'work',
  title: 'Kemplast Process Solutions website',
  context: 'Client website',
  // The year ends the sentence: a comma straight after it would make the count-up read it as 1,986
  outcome:
    'Rebuilt end to end in Next.js: the production website for an industrial instrumentation dealer founded in 1986.',
  role: 'Software Development Engineer',
  start: '2025-09',
  end: '2026-02',
  stack: ['Next.js', 'React 19', 'TypeScript', 'Supabase', 'Vercel'],
  categories: ['full-stack'],
  links: [
    { label: 'GitHub', href: 'https://github.com/Kemplast-main/v0-kemplast-website-redesign' },
    { label: 'Live', href: 'https://www.kemplast.in/' },
  ],
  featured: true,
  media: {
    src: '/media/kemplast/screen.jpg',
    screen: '/media/kemplast/phone.jpg',
    alt: 'The Kemplast Process Solutions home page: the company name in black and orange beside cards for 38+ years, 500+ clients and 24/7 support',
  },
  readme: {
    overview:
      'A full redesign of the website for Kemplast Process Solutions, a process instrumentation dealer since 1986: products, quotes and job applications in one modern, animated site.',
    features: [
      'An animated hero with floating stat cards',
      'A company timeline that responds to scroll and hover',
      'A product catalogue, including the Siemens PLC range',
      'Quote and job application forms that email the sales team through Resend',
      'Structured data for search, and IndiaMART links through the product pages',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'shadcn/ui',
      'Supabase',
      'Resend',
    ],
    run: ['npm install', 'npm run dev'],
    needs: 'a Resend API key in a .env.local file',
  },
  body: {
    problem:
      'Kemplast, an authorised dealer for brands such as Siemens and WIKA since 1986, needed a website that showed its whole range and let customers ask for a quote.',
    built:
      'The production website, rebuilt in Next.js (App Router), React 19 and TypeScript: a product catalogue by category, a page for each brand, services, the team and quote requests, in light and dark themes, on a Supabase back end.',
    decisions: [
      {
        title: 'A 3-tier build on Supabase',
        detail:
          'A client, server and database architecture on Supabase (PostgreSQL), with transactional email through Resend.',
      },
      {
        title: 'Validated forms',
        detail: 'Quote and contact forms are checked with React Hook Form and Zod.',
      },
      {
        title: 'Fast on every device',
        detail:
          'Image optimisation, lazy loading and code splitting, with all 3 Core Web Vitals tracked in Vercel Analytics.',
      },
    ],
    results: ['Live at kemplast.in', 'All 3 Core Web Vitals tracked in production'],
  },
});
