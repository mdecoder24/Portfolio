import { describe, expect, it } from 'vitest';
import { ContactInput, fieldErrors } from '@/lib/contact-schema';

const valid = { name: 'Ananya Rao', email: 'ananya@example.com', topic: 'job', message: 'We would like to talk about a role.' };

describe('ContactInput', () => {
  it('accepts a complete message', () => {
    expect(ContactInput.safeParse(valid).success).toBe(true);
  });

  it('returns the interface copy for each invalid field', () => {
    const r = ContactInput.safeParse({ name: 'A', email: 'nope', topic: '', message: 'hi' });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrors(r.error)).toEqual({
      name: 'Enter your name.',
      email: 'Enter an email address like name@example.com.',
      topic: 'Choose what this is about.',
      message: 'Tell me a little about what you need.',
    });
  });

  it('keeps budget and timeline only for freelance enquiries', () => {
    const extra = { budget: 'Not sure yet', timeline: 'Flexible', projectType: 'Landing page' };
    const job = ContactInput.parse({ ...valid, ...extra });
    expect(job.budget).toBeUndefined();
    const freelance = ContactInput.parse({ ...valid, ...extra, topic: 'freelance' });
    expect(freelance.budget).toBe('Not sure yet');
  });

  it('rejects a budget that is not one of the options', () => {
    expect(ContactInput.safeParse({ ...valid, topic: 'freelance', budget: '₹1' }).success).toBe(false);
  });
});
