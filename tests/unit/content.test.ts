import { describe, expect, it } from 'vitest';
import * as content from '@/content';
import { CaseStudy, Profile } from '@/content/schema';

describe('content', () => {
  it('has at least one featured project and one freelance case study', () => {
    expect(content.projects.some((p) => p.featured)).toBe(true);
    expect(content.freelance.length).toBeGreaterThan(0);
  });

  it('gives every Daily-driver skill an evidence link', () => {
    for (const s of content.skills.filter((s) => s.tier === 'daily')) expect(s.evidence.length).toBeGreaterThan(0);
  });

  it('uses unique, permanent slugs', () => {
    const slugs = [...content.projects, ...content.freelance].map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('rejects a headline that ends in a full stop: the pearl draws it', () => {
    expect(Profile.safeParse({ ...content.profile, headline: 'I build things.' }).success).toBe(false);
  });

  it('rejects alt text shorter than 10 characters', () => {
    const study = content.projects[0];
    expect(CaseStudy.safeParse({ ...study, media: { ...study.media, alt: 'shot' } }).success).toBe(false);
  });
});
