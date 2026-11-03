import { CaseStudy } from '../schema.ts';

// From krudex.in and the Krudex-Tech repository's README (3 Nov 2026)
export const krudex = CaseStudy.parse({
  slug: 'krudex',
  kind: 'work',
  title: 'Krudex Global website',
  context: 'Live website',
  outcome:
    'Designed and built the live website for my studio, Krudex Global: a 3D WebGL hero, an edge database and a hardened contact API.',
  role: 'Founder',
  // The repository's first commit, 26 Jun 2026; the site is still in active development, so there is no end
  start: '2026-06',
  stack: ['Next.js', 'React 19', 'TypeScript', 'Three.js', 'Cloudflare D1'],
  categories: ['full-stack', '3d-creative'],
  // The repository is private, so the GitHub button explains that instead of linking to it (3 Nov 2026)
  links: [{ label: 'Live', href: 'https://krudex.in/' }],
  privateCode:
    "The code for this site is private, so I'm sorry, I can't share the GitHub link. You can see the site live at krudex.in.",
  // Shown under "View more projects" rather than in the main grid
  featured: false,
  media: {
    src: '/media/krudex/screen.jpg',
    screen: '/media/krudex/phone.jpg',
    alt: 'The Krudex Global home page: the headline "We build SaaS products that scale" beside 3D pillars labelled web, app and AI',
  },
  readme: {
    overview:
      'The website for Krudex Global, my studio for SaaS products, Google Ads and digital marketing, and student training with NovaSkill Hub: a dark, animated site with a 3D hero.',
    features: [
      'A 3D hero in React Three Fiber with mouse tracking and custom shaders',
      'An interactive globe drawn with cobe, with auto-rotation and point markers',
      'Contact inquiries saved to Cloudflare D1 through a Route Handler',
      'A contact API with length caps, a honeypot, per-IP rate limits and Turnstile',
      'A sitemap, robots.txt, Open Graph image and JSON-LD for search',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Three.js',
      'React Three Fiber',
      'Framer Motion',
      'Cloudflare D1',
      'Resend',
    ],
  },
  body: {
    problem:
      'Krudex Global needed one site that presented its 3 lines of work, SaaS builds, digital marketing and student training, and turned visitors into inquiries.',
    built:
      'The live website, built in Next.js (App Router), React 19 and TypeScript: home, services, training, about, team and contact pages, a 3D WebGL hero, and a contact form backed by Cloudflare D1.',
    decisions: [
      {
        title: '3D that steps aside',
        detail:
          'The WebGL hero falls back to a static logo for reduced motion, Save-Data and low-memory devices, and pauses rendering when off screen.',
      },
      {
        title: 'An edge database for inquiries',
        detail:
          'Contact submissions go to Cloudflare D1 (serverless SQLite), with an optional email to the team through Resend.',
      },
      {
        title: 'A hardened contact API',
        detail:
          'Field length caps, a honeypot, per-IP rate limiting, optional Cloudflare Turnstile and security headers including HSTS.',
      },
    ],
    results: ['Live at krudex.in', 'Lint, typecheck, build and end-to-end tests run in CI on every pull request'],
  },
});
