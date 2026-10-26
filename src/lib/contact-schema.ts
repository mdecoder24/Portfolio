import { z } from 'zod';

// Shared by the browser form and the server action, so both validate the same way.
export const TOPICS = [
  { value: 'job', label: 'Job opportunity' },
  { value: 'freelance', label: 'Freelance project' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'hello', label: 'Just saying hi' },
] as const;

export const PROJECT_TYPES = ['Web app or dashboard', 'AI chatbot or automation', 'Landing page', '3D or interactive', 'Something else'] as const;
export const BUDGETS = ['Under ₹40,000', '₹40,000 – ₹1,00,000', '₹1,00,000 – ₹2,50,000', 'Above ₹2,50,000', 'Not sure yet'] as const;
export const TIMELINES = ['As soon as possible', 'In 1–3 months', 'Later this year', 'Flexible'] as const;
`
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), z.enum(values).optional());

export const ContactInput = z
  .object({
    name: z.string().trim().min(2, 'Enter your name.').max(80, 'Keep your name under 80 characters.'),
    email: z.email('Enter an email address like name@example.com.').max(200),
    topic: z.enum(TOPICS.map((t) => t.value) as ['job', 'freelance', 'collaboration', 'hello'], {
      error: 'Choose what this is about.',
    }),
    message: z
      .string()
      .trim()
      .min(10, 'Tell me a little about what you need.')
      .max(4000, 'Keep the message under 4,000 characters.'),
    projectType: optionalEnum(PROJECT_TYPES),
    budget: optionalEnum(BUDGETS),
    timeline: optionalEnum(TIMELINES),
  })
  .transform((v) =>
    // Budget and timeline only mean something for freelance enquiries
    v.topic === 'freelance' ? v : { ...v, projectType: undefined, budget: undefined, timeline: undefined },
  );

export type ContactInput = z.infer<typeof ContactInput>;
export type ContactField = 'name' | 'email' | 'topic' | 'message';

export type ContactState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: Partial<Record<ContactField, string>>; values: Record<string, string> }
  | { status: 'sent' }
  | { status: 'failed'; values: Record<string, string> };

export function formValues(data: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ['name', 'email', 'topic', 'message', 'projectType', 'budget', 'timeline']) {
    const v = data.get(k);
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    errors[key] ??= issue.message;
  }
  return errors;
}
