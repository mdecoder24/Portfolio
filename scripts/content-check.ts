// Validates content beyond the zod schemas; --strict also fails on placeholder entries (production builds).
import { existsSync } from 'node:fs';
import * as c from '../src/content/index.ts';

const strict = process.argv.includes('--strict');
const errors: string[] = [];
const placeholders: string[] = [];

const caseStudies = c.projects;
const known = new Set(caseStudies.map((s) => c.caseStudyHref(s)));

for (const s of caseStudies) {
  if (!existsSync(`public${s.media.src}`)) errors.push(`${s.slug}: media ${s.media.src} is missing`);
  if (s.client?.named && !s.client.permission) errors.push(`${s.slug}: client named without permission`);
}
if (!c.projects.some((p) => p.featured)) errors.push('No featured project');
if (!c.certifications.some((cert) => cert.featured)) errors.push('No featured certification');

for (const g of new Set(c.skills.map((s) => s.group)))
  if (!c.skills.some((s) => s.group === g && s.evidence.length > 0)) errors.push(`Skill group "${g}" has no evidence link`);
for (const s of c.skills) {
  for (const e of s.evidence)
    if (e.startsWith('/') && !known.has(e)) errors.push(`Skill "${s.name}" links to unknown page ${e}`);
}

const collect = (label: string, items: { placeholder?: boolean }[]) =>
  items.forEach((item, i) => item.placeholder && placeholders.push(`${label}[${i}]`));
collect('config', [c.config]);
collect('profile', [c.profile]);
collect('experience', c.experience);
collect('skills', c.skills);
collect('freelance', [c.freelance]);
collect('freelance work', c.freelance.work);
collect('education', c.education);
collect('achievements', c.achievements);
collect('certifications', c.certifications);
caseStudies.forEach((s) => s.placeholder && placeholders.push(`case study ${s.slug}`));

if (placeholders.length) {
  console.log(`${placeholders.length} placeholder entries:\n  ${placeholders.join('\n  ')}`);
  if (strict) errors.push(`${placeholders.length} placeholder entries remain (--strict)`);
}
if (errors.length) {
  console.error(`content:check failed:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('content:check passed');
