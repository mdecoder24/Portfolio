import { CaseStudy } from '../schema.ts';

// From kemplast.in and the Kemplast role in experience.ts (31 Oct 2026). The code is the client's, so there is no
// GitHub link, and no README panel since its setup isn't public
export const kemplast = CaseStudy.parse({
  slug: 'kemplast',
  kind: 'work',
  title: 'Kemplast Process Solutions website',
  context: 'Client website',
  outcome:
    'The production website for an industrial instrumentation dealer in business since 1986, rebuilt end to end in Next.js.',
  role: 'Software Development Engineer',
  start: '2025-09',
  end: '2026-02',
  stack: ['Next.js', 'React 19', 'TypeScript', 'Supabase', 'Vercel'],
  categories: ['full-stack'],
  links: [{ label: 'Live', href: 'https://www.kemplast.in/' }],
  featured: true,
  media: {
    src: '/media/kemplast/screen.jpg',
    screen: '/media/kemplast/phone.jpg',
    alt: 'The Kemplast Process Solutions home page: the company name in black and orange beside cards for 38+ years, 500+ clients and 24/7 support',
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
