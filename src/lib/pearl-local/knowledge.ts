import type {
  Achievement,
  CaseStudy,
  Certification,
  Config,
  EducationItem,
  Experience,
  Freelance,
  Profile,
  Skill,
} from '@/content/schema';

/**
 * One citable piece of Kushwant's content. The browser model reads `text`; quick answers show `summary`.
 * Built on the server at build time and passed to the client island as plain data, so the panel never imports
 * src/content (or zod) into the browser bundle.
 */
export type KnowledgeSection = {
  id: string;
  title: string;
  summary: string;
  text: string;
  href?: string;
  sample: boolean;
};

type Content = {
  profile: Profile;
  config: Config;
  experience: Experience[];
  projects: CaseStudy[];
  freelance: Freelance;
  skills: Skill[];
  education: EducationItem[];
  achievements: Achievement[];
  certifications: Certification[];
};

const AVAILABILITY: Record<Config['availability']['freelance'], string> = {
  available: 'available for freelance projects',
  limited: 'taking a limited number of freelance projects',
  booked: 'fully booked for freelance work right now',
};

// Strips the ==highlight== markup the freelance bio uses for the page
const plain = (s: string) => s.replace(/==(.+?)==/g, '$1').trim();
const lines = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('\n');
const range = (start?: string, end?: string, current?: boolean) =>
  start ? `${start} to ${current ? 'present' : (end ?? 'present')}` : undefined;

export function buildKnowledge(c: Content): KnowledgeSection[] {
  const sections: KnowledgeSection[] = [];
  const add = (s: KnowledgeSection) => sections.push(s);

  add({
    id: 'profile',
    title: `About ${c.profile.name}`,
    summary: plain(c.profile.bio),
    text: lines(
      `${c.profile.name}, ${c.profile.role}. ${c.profile.employment}.`,
      `Based in ${c.profile.location.city}, ${c.profile.location.region}, ${c.profile.location.country}.`,
      plain(c.profile.bio),
      ...c.profile.facts.map((f) => `${f.term}: ${f.detail}`),
      `Interests: ${c.profile.interests.join(', ')}.`,
      `Now: ${c.profile.now}`,
    ),
    href: '/#about',
    sample: c.profile.placeholder,
  });

  const a = c.config.availability;
  add({
    id: 'availability',
    title: 'Availability and contact',
    summary: `He is ${a.freelanceLabel ?? AVAILABILITY[a.freelance]}${a.openToRoles ? ' and open to new roles' : ''}. He replies ${a.replyTime}.`,
    text: lines(
      `Freelance: ${a.freelanceLabel ?? AVAILABILITY[a.freelance]}.`,
      `Open to new full-time roles: ${a.openToRoles ? 'yes' : 'not right now'}.`,
      `Reply time: ${a.replyTime}.`,
      `Email: ${c.config.links.email}. LinkedIn: ${c.config.links.linkedin}. GitHub: ${c.config.links.github}.`,
      c.config.links.booking && `Book a call: ${c.config.links.booking}.`,
      'Résumé: /resume.',
    ),
    href: '/#contact',
    sample: c.config.placeholder,
  });

  for (const e of c.experience) {
    add({
      id: `experience/${e.id}`,
      title: `${e.role}, ${e.org}`,
      summary: lines(`${e.role} at ${e.org}${e.current ? ' (current)' : ''}.`, e.points[0]),
      text: lines(
        `${e.role} at ${e.org}${e.location ? `, ${e.location}` : ''}${e.kind === 'volunteer' ? ' (volunteer)' : ''}.`,
        range(e.start, e.end, e.current) && `Dates: ${range(e.start, e.end, e.current)}.`,
        ...e.points.map((p) => `- ${p}`),
        e.stack.length > 0 && `Stack: ${e.stack.join(', ')}.`,
      ),
      href: '/#experience',
      sample: e.placeholder,
    });
  }

  for (const p of c.projects) {
    add({
      id: `projects/${p.slug}`,
      title: p.title,
      summary: `${p.title}: ${p.outcome}`,
      text: lines(
        `${p.title} (${p.kind}; ${p.context}).`,
        `Outcome: ${p.outcome}`,
        `Role: ${p.role}.${p.team ? ` Team: ${p.team}.` : ''}`,
        `Stack: ${p.stack.join(', ')}.`,
        `Problem: ${p.body.problem}`,
        `Built: ${p.body.built}`,
        `Key decisions: ${p.body.decisions.map((d) => `${d.title}: ${d.detail}`).join(' ')}`,
        `Results: ${p.body.results.join(' ')}`,
        p.pearlNotes && `Notes: ${p.pearlNotes}`,
      ),
      href: `/projects/${p.slug}`,
      sample: p.placeholder,
    });
  }

  const f = c.freelance;
  add({
    id: 'freelance',
    title: 'Freelance work',
    summary: plain(f.bio[0] ?? ''),
    text: lines(
      ...f.bio.map(plain),
      ...f.work.map(
        (w) =>
          `- ${w.title}${w.client ? ` for ${w.client}` : ''}${w.year ? ` (${w.year})` : ''}: ${w.summary}${w.stack.length ? ` Stack: ${w.stack.join(', ')}.` : ''}${w.placeholder ? ' (sample)' : ''}`,
      ),
      ...f.stats.map((s) => `${s.value} ${s.label}${s.detail ? ` (${s.detail})` : ''}.`),
    ),
    href: '/#freelance',
    sample: f.placeholder,
  });

  const groups = Map.groupBy(c.skills, (s) => s.group);
  add({
    id: 'skills',
    title: 'Skills',
    summary: `Skills include ${c.skills
      .slice(0, 8)
      .map((s) => s.name)
      .join(', ')}, and more.`,
    text: lines(
      ...[...groups].map(([group, list]) => `${group}: ${list.map((s) => s.name).join(', ')}.`),
      ...c.skills
        .filter((s) => s.evidence.length > 0)
        .map((s) => `Evidence for ${s.name}: ${s.evidence.join(', ')}.`),
    ),
    href: '/#about',
    sample: c.skills.some((s) => s.placeholder),
  });

  add({
    id: 'education',
    title: 'Education and achievements',
    summary: c.education[0] ? `${c.education[0].degree}, ${c.education[0].institution}.` : 'Education',
    text: lines(
      ...c.education.map(
        (e) =>
          `${e.level}: ${e.degree}, ${e.institution}, ${e.start ? `${e.start} to ` : ''}${e.end}.${
            e.score && (e.score.kind !== 'cgpa' || c.config.flags.showCgpa)
              ? ` ${e.score.kind === 'cgpa' ? 'CGPA' : 'Score'}: ${e.score.value}/${e.score.outOf}.`
              : ''
          }${e.coursework.length ? ` Coursework: ${e.coursework.join(', ')}.` : ''}`,
      ),
      ...c.achievements.map((x) => `- ${x.title}${x.issuer ? `, ${x.issuer}` : ''}${x.date ? ` (${x.date})` : ''}`),
    ),
    href: '/#education',
    sample: c.education.some((e) => e.placeholder),
  });

  add({
    id: 'certifications',
    title: 'Certifications',
    summary: `${c.certifications.length} certifications, including ${c.certifications
      .slice(0, 2)
      .map((x) => x.title)
      .join(' and ')}.`,
    text: lines(...c.certifications.map((x) => `- ${x.title} (${x.issuer}${x.provider ? `, ${x.provider}` : ''})`)),
    href: '/#certifications',
    sample: c.certifications.some((x) => x.placeholder),
  });

  return sections;
}

