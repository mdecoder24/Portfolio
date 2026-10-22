import { z } from 'zod';

const month = z.string().regex(/^\d{4}-\d{2}$/); // "2026-07"
const slug = z.string().regex(/^[a-z0-9-]+$/);
// Site-relative paths ("/projects/pulse", "#freelance") or absolute URLs
const href = z.string().refine((v) => v.startsWith('/') || v.startsWith('#') || URL.canParse(v), 'Invalid href');

export const CaseStudy = z.object({
  slug,
  kind: z.enum(['work', 'freelance', 'personal', 'academic']),
  title: z.string().max(60),
  context: z.string(), // "Freelance, a Hyderabad clinic, 4 weeks"
  outcome: z.string().max(140), // leads with the result and its number
  client: z.object({ label: z.string(), named: z.boolean(), permission: z.boolean() }).optional(),
  role: z.string(),
  team: z.string().default('Solo'),
  start: month,
  end: month.optional(),
  stack: z.array(z.string()).min(1).max(12),
  categories: z.array(z.enum(['ai-ml', 'full-stack', '3d-creative', 'tools'])).min(1),
  featured: z.boolean().default(false),
  media: z.object({
    src: z.string(),
    alt: z.string().min(10),
    video: z.string().optional(),
    poster: z.string().optional(),
  }),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  testimonialId: z.string().optional(),
  // Case-study body, following the PRD's template
  body: z.object({
    problem: z.string(),
    built: z.string(),
    decisions: z.array(z.object({ title: z.string(), detail: z.string() })).min(3).max(5),
    results: z.array(z.string()).min(1),
    differently: z.string(),
  }),
  pearlNotes: z.string().optional(), // facts Pearl may use that the page doesn't show
  confidential: z.array(z.string()).default([]), // facts Pearl must never reveal
  placeholder: z.boolean().default(false),
});

export const Config = z.object({
  availability: z.object({
    freelance: z.enum(['available', 'limited', 'booked']),
    freelanceLabel: z.string(), // "Freelance: 1 slot open in November"
    openToRoles: z.boolean(),
    replyTime: z.string(),
  }),
  flags: z.object({
    showFreelance: z.boolean(),
    showPrices: z.boolean(),
    pearl: z.boolean(),
    threeD: z.boolean(),
    showCgpa: z.boolean(),
  }),
  links: z.object({
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
    repo: z.url().optional(),
    booking: z.url().optional(),
  }),
  site: z.object({ url: z.url(), lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
  placeholder: z.boolean().default(false),
});

export const Profile = z.object({
  name: z.string(),
  role: z.string(),
  nameLine: z.string(),
  headline: z.string().refine((h) => !h.endsWith('.'), 'Headline omits its final full stop; the pearl draws it'),
  subheadline: z.string().max(180),
  employment: z.string(),
  location: z.object({ city: z.string(), region: z.string(), country: z.string(), timeZone: z.string() }),
  bio: z.string(),
  facts: z.array(z.object({ term: z.string(), detail: z.string() })).min(2).max(5),
  interests: z.array(z.string()).min(1).max(5),
  now: z.string(),
  placeholder: z.boolean().default(false),
});

export const Experience = z.object({
  id: slug,
  role: z.string(),
  org: z.string(),
  location: z.string(),
  start: month,
  end: month.optional(),
  points: z.array(z.string()).min(2).max(5),
  stack: z.array(z.string()).max(5),
  current: z.boolean().default(false),
  placeholder: z.boolean().default(false),
});

export const Skill = z.object({
  name: z.string(),
  tier: z.enum(['daily', 'comfortable', 'exploring']),
  evidence: z.array(href).default([]),
  placeholder: z.boolean().default(false),
});

export const Service = z.object({
  id: slug,
  name: z.string(),
  description: z.string(),
  timeline: z.string(),
  stack: z.string(),
  startingFrom: z.number().int().positive().optional(),
  placeholder: z.boolean().default(false),
});

export const Testimonial = z.object({
  id: slug,
  quote: z.string(),
  role: z.string(),
  name: z.string().optional(),
  org: z.string().optional(),
  permissionDate: z.string().optional(),
  placeholder: z.boolean().default(false),
});

export const EducationItem = z.object({
  degree: z.string(),
  institution: z.string(),
  start: z.number().int(),
  end: z.number().int(),
  cgpa: z.string().optional(),
  coursework: z.array(z.string()).default([]),
  finalProject: z.object({ label: z.string(), href }).optional(),
  placeholder: z.boolean().default(false),
});

export const Achievement = z.object({
  title: z.string(),
  issuer: z.string().optional(),
  date: month,
  href: z.url().optional(),
  placeholder: z.boolean().default(false),
});

export type CaseStudy = z.infer<typeof CaseStudy>;
export type Config = z.infer<typeof Config>;
export type Profile = z.infer<typeof Profile>;
export type Experience = z.infer<typeof Experience>;
export type Skill = z.infer<typeof Skill>;
export type Service = z.infer<typeof Service>;
export type Testimonial = z.infer<typeof Testimonial>;
export type EducationItem = z.infer<typeof EducationItem>;
export type Achievement = z.infer<typeof Achievement>;
