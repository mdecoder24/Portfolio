import { z } from 'zod';

const month = z.string().regex(/^\d{4}-\d{2}$/); // "2026-07"
const slug = z.string().regex(/^[a-z0-9-]+$/);
// Site-relative paths ("/projects/tedx-mlrit", "#experience") or absolute URLs
const href = z
  .string()
  .refine((v) => v.startsWith('/') || v.startsWith('#') || URL.canParse(v), 'Invalid href');

export const CaseStudy = z.object({
  slug,
  kind: z.enum(['work', 'personal', 'academic']),
  title: z.string().max(60),
  context: z.string(), // "Freelance, a Hyderabad clinic, 4 weeks"
  outcome: z.string().max(140), // leads with the result and its number
  client: z.object({ label: z.string(), named: z.boolean(), permission: z.boolean() }).optional(),
  role: z.string(),
  // Left out when unknown; the page then skips the row rather than guess "Solo"
  team: z.string().optional(),
  // Optional: leave it out rather than guess when the work started
  start: month.optional(),
  end: month.optional(),
  stack: z.array(z.string()).min(1).max(12),
  categories: z.array(z.enum(['ai-ml', 'full-stack', '3d-creative', 'tools'])).min(1),
  featured: z.boolean().default(false),
  media: z.object({
    src: z.string(),
    device: z.enum(['laptop', 'phone']).default('laptop'), // the 3D mockup the screenshot is shown in
    // Portrait screenshot: the phone mockup's screen, or a phone shown beside the laptop. A phone falls back to src
    screen: z.string().optional(),
    alt: z.string().min(10),
    video: z.string().optional(),
    poster: z.string().optional(),
  }),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  // Case-study body, following the PRD's template
  body: z.object({
    problem: z.string(),
    built: z.string(),
    decisions: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string(),
        }),
      )
      .min(3)
      .max(5),
    results: z.array(z.string()).min(1),
    // Only Kushwant can write this; the section is hidden until he does
    differently: z.string().optional(),
  }),
  // A short README for the card's details panel, taken from the project's repository
  readme: z
    .object({
      overview: z.string().max(240),
      features: z.array(z.string().max(90)).min(1).max(5),
      tech: z.array(z.string()).min(1).max(10),
      run: z.array(z.string()).min(1).max(4), // shell commands, in order
      needs: z.string().optional(), // finishes the sentence "Needs …": what to set up before the commands work
    })
    .optional(),
  pearlNotes: z.string().optional(), // facts Pearl may use that the page doesn't show
  confidential: z.array(z.string()).default([]), // facts Pearl must never reveal
  placeholder: z.boolean().default(false),
});

// The freelance section: a short bio in first person, then the client work, newest first
export const Freelance = z.object({
  bio: z.array(z.string()).min(1), // one string per paragraph; ==phrase== is highlighted
  work: z
    .array(
      z.object({
        title: z.string().max(60),
        client: z.string().optional(), // a name only with the client's permission, otherwise a label such as "a Hyderabad clinic"
        summary: z.string().max(200),
        stack: z.array(z.string()).default([]),
        year: z.string().regex(/^\d{4}$/).optional(),
        href: z.url().optional(),
        placeholder: z.boolean().default(false),
      }),
    )
    .default([]),
  // The headline numbers, one card each; value is counted up from zero, so it leads with its number
  stats: z
    .array(z.object({
        value: z.string().regex(/^\d/),
        label: z.string(),
        detail: z.string().optional(),
        // Short words inked on the card's stub; decoration, since the label and detail already say them
        stamps: z.array(z.string().max(12)).max(6).default([]),
      }),
    )
    .max(4)
    .default([]),
  // Where someone who wants a build is sent; the label comes from the design system's interface copy
  cta: z.object({ text: z.string(), label: z.string(), href: z.url() }).optional(),
  placeholder: z.boolean().default(false),
});

// A certificate from the résumé, linked to the proof of it
export const Certification = z.object({
  title: z.string(),
  issuer: z.string(),
  href: z.url(),
  placeholder: z.boolean().default(false),
});

export const Config = z.object({
  availability: z.object({
    freelance: z.enum(['available', 'limited', 'booked']),
    freelanceLabel: z.string().optional(),
    openToRoles: z.boolean(),
    replyTime: z.string(),
  }),
  flags: z.object({
    pearl: z.boolean(),
    threeD: z.boolean(),
    showCgpa: z.boolean(),
  }),
  links: z.object({
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
    leetcode: z.url(),
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
  headline: z
    .string()
    .refine((h) => !h.endsWith('.'), 'Headline omits its final full stop; the pearl draws it'),
  subheadline: z.string().max(180),
  employment: z.string(),
  location: z.object({ city: z.string(), region: z.string(), country: z.string(), timeZone: z.string() }),
  bio: z.string(),
  facts: z
    .array(z.object({ term: z.string(), detail: z.string() }))
    .min(2)
    .max(5),
  interests: z.array(z.string()).min(1).max(5),
  now: z.string(),
  /**
   * The hero photograph: a path under /public, cropped 4:5. Until it is set, the 3D KR monogram fills the frame. It has
   * no alt text because it sits inside the h1, between the two halves of the name that already say who it shows.
   */
  portrait: z.string().startsWith('/').optional(),
  placeholder: z.boolean().default(false),
});

export const Experience = z.object({
  id: slug,
  // Paid roles and volunteer roles sit under their own headings in the section
  kind: z.enum(['professional', 'volunteer']).default('professional'),
  role: z.string(),
  org: z.string(),
  // Square logo in public/media/logos, from the organisation's LinkedIn page; rows without one show its initials
  logo: z.string().startsWith('/').optional(),
  location: z.string().optional(),
  // Optional for volunteer roles whose dates aren't known yet; the row then shows no dates rather than guess them
  start: month.optional(),
  end: month.optional(),
  // Empty when LinkedIn gives no detail; the row then has nothing to open
  points: z.array(z.string()).max(7).default([]),
  stack: z.array(z.string()).max(5).default([]),
  current: z.boolean().default(false),
  placeholder: z.boolean().default(false),
});

export const Skill = z.object({
  name: z.string(),
  // The résumé's groups, in its order
  group: z.enum(['languages', 'frontend', 'backend', 'ai-ml', 'ml-libraries', 'cloud']),
  evidence: z.array(href).default([]),
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
  // Optional: certifications and ongoing roles often carry no month worth showing
  date: month.optional(),
  href: z.url().optional(),
  placeholder: z.boolean().default(false),
});

export type CaseStudy = z.infer<typeof CaseStudy>;
export type Config = z.infer<typeof Config>;
export type Freelance = z.infer<typeof Freelance>;
export type Certification = z.infer<typeof Certification>;
export type Profile = z.infer<typeof Profile>;
export type Experience = z.infer<typeof Experience>;
export type Skill = z.infer<typeof Skill>;
export type EducationItem = z.infer<typeof EducationItem>;
export type Achievement = z.infer<typeof Achievement>;
