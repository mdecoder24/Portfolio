import type { KnowledgeSection } from './knowledge';

export type SkillRef = { name: string; evidence: string[] };
export type PearlData = { sections: KnowledgeSection[]; skills: SkillRef[]; email: string };
export type Source = { id: string; title: string; href?: string };

// Pasted job descriptions arrive as long blocks; a question is rarely this long
export const JD_MIN_LENGTH = 300;
export const MAX_INPUT = 6000;

const STOP = new Set(
  'a an and are as at be been but by can do does did for from had has have he him his how i in is it its me my of on or our she so that the their them they this to us was we what when where which who why will with you your about tell show any some'.split(
    ' ',
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t));
}

const KIND_HINTS: Record<string, string[]> = {
  profile: ['who'],
  'projects/': ['project', 'built', 'case'],
  'experience/': ['experience', 'job', 'role', 'employer', 'company', 'career', 'work'],
  freelance: ['freelance', 'client', 'hire'],
  skills: ['skill', 'stack', 'technolog', 'tech', 'used', 'know'],
  education: ['education', 'degree', 'college', 'university'],
  certifications: ['certif'],
};

type Indexed = { section: KnowledgeSection; terms: Map<string, number>; length: number };

/** A small BM25 index: the whole portfolio is a few dozen sections, so this runs in well under a millisecond. */
export function createIndex(sections: KnowledgeSection[]) {
  const docs: Indexed[] = sections.map((section) => {
    // The title counts twice, so a question naming a project finds that project first
    const tokens = tokenize(`${section.title} ${section.title} ${section.text}`);
    const terms = new Map<string, number>();
    for (const t of tokens) terms.set(t, (terms.get(t) ?? 0) + 1);
    return { section, terms, length: tokens.length };
  });
  const avg = docs.reduce((n, d) => n + d.length, 0) / Math.max(docs.length, 1);
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);

  return function search(query: string, k = 3) {
    const q = [...new Set(tokenize(query))];
    // A question that names a kind of section ("which projects…") prefers sections of that kind
    const words = query.toLowerCase().match(/[a-z]+/g) ?? [];
    const kinds = Object.entries(KIND_HINTS)
      .filter(([, hints]) => hints.some((h) => words.some((w) => w.startsWith(h))))
      .map(([prefix]) => prefix);
    const k1 = 1.2;
    const b = 0.75;
    return docs
      .map((d) => {
        let score = 0;
        for (const t of q) {
          const tf = d.terms.get(t);
          if (!tf) continue;
          const n = df.get(t) ?? 0;
          const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
          score += (idf * tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.length) / avg));
        }
        // A hinted section ranks above the rest even with no matching words, so "his best project" still finds
        // a project; ties keep content order, which puts featured projects first
        const hinted = kinds.some((p) => d.section.id.startsWith(p));
        return { section: d.section, score, hinted };
      })
      .filter((h) => h.score > 0 || h.hinted)
      .sort((x, y) => Number(y.hinted) - Number(x.hinted) || y.score - x.score)
      .slice(0, k);
  };
}

export type Intent = 'greeting' | 'pay' | 'jd' | 'question';

export function classify(text: string): Intent {
  const t = text.trim();
  if (t.length >= JD_MIN_LENGTH) return 'jd';
  if (/\b(salary|ctc|lpa|compensation|expected pay|hourly rate|rates?|how much (does|do|would) he charge)\b/i.test(t))
    return 'pay';
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b[\s.,!?]*$/i.test(t)) return 'greeting';
  return 'question';
}

export const OPENING =
  "Hi, I'm Pearl, Kushwant's AI guide. Ask about his work, check his fit for a role, or scope a project with him.";
export const PAY_REPLY = "That's best discussed with Kushwant directly. You can email him or use the contact form.";
export const dontKnow = (email: string) =>
  `I don't have that in Kushwant's notes. You can ask him directly at ${email}.`;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (text: string, word: string) =>
  new RegExp(`(^|[^A-Za-z0-9])${escape(word)}($|[^A-Za-z0-9#+])`).test(text);

/** Skills from the portfolio that a job description names, matched on whole words. */
export function matchSkills(jd: string, skills: SkillRef[]) {
  const text = ` ${jd.toLowerCase()} `;
  return skills.filter((s) =>
    // "PostgreSQL (Supabase)" matches on "PostgreSQL" or "Supabase"; "AWS (EC2, Lambda, S3)" on any of them
    s.name
      .toLowerCase()
      .split(/[(),/]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 1)
      .some((n) => hasWord(text, n)),
  );
}

// Technologies job descriptions often ask for. Any the JD names that the portfolio never mentions are reported as gaps,
// so gaps come from the portfolio's silence, not from a model's guess
const COMMON_TECH = [
  'Angular', 'Vue', 'Svelte', 'GraphQL', 'Redis', 'MongoDB', 'MySQL', 'Docker', 'Kubernetes', 'Terraform', 'Azure',
  'GCP', 'Kafka', 'Golang', 'Rust', 'C++', 'C#', '.NET', 'Kotlin', 'Swift', 'Flutter', 'React Native', 'PHP',
  'Laravel', 'Ruby', 'Rails', 'Django', 'Flask', 'FastAPI', 'Spring', 'Jest', 'Cypress', 'Playwright', 'Storybook',
  'Webpack', 'Elasticsearch', 'Spark', 'Airflow', 'LangChain', 'OpenAI', 'Figma', 'Jenkins', 'Linux',
];

export function techGaps(jd: string, data: PearlData) {
  const known = ` ${data.sections.map((s) => `${s.title} ${s.text}`).join(' ').toLowerCase()} `;
  // Case-sensitive on the JD, so "a swift rollout" or "spring 2027" never reads as Swift or Spring
  return COMMON_TECH.filter((t) => hasWord(` ${jd} `, t) && !hasWord(known, t.toLowerCase()));
}

/** A job-description fit summary built only from the portfolio: matches with evidence, gaps, a next step. */
export function fitAnswer(jd: string, data: PearlData) {
  const matched = matchSkills(jd, data.skills);
  const gaps = techGaps(jd, data);
  const skills = data.sections.find((s) => s.id === 'skills');
  if (matched.length === 0) {
    return {
      text: `I couldn't match this role to the skills on Kushwant's portfolio. The best next step is to ask him directly at ${data.email}.`,
      sources: [],
    };
  }
  const list = matched
    .slice(0, 8)
    .map((s) => `- **${s.name}**${s.evidence[0] ? `: [see the work](${s.evidence[0]})` : ''}`)
    .join('\n');
  const gapLine =
    gaps.length > 0
      ? `His portfolio doesn't show ${gaps.slice(0, 5).join(', ')}, so ask him about ${gaps.length === 1 ? 'it' : 'those'}.`
      : 'I found no named technology that his portfolio is missing, but check experience levels with him.';
  return {
    text: `This role names ${matched.length} skill${matched.length === 1 ? '' : 's'} on Kushwant's portfolio:\n${list}\n\n${gapLine} Next step: his [résumé](/resume), or email him at ${data.email}.`,
    sources: skills ? [sourceOf(skills)] : [],
  };
}

export const sourceOf = (s: KnowledgeSection): Source => ({ id: s.id, title: s.title, href: s.href });

/**
 * The answer when no model runs in this browser: deterministic, and built only from the portfolio's own sentences, so
 * it can never invent a fact.
 */
export function quickAnswer(text: string, data: PearlData, search: ReturnType<typeof createIndex>) {
  const intent = classify(text);
  if (intent === 'greeting') return { text: OPENING, sources: [] };
  if (intent === 'pay') return { text: PAY_REPLY, sources: [] };
  if (intent === 'jd') return fitAnswer(text, data);
  const hits = search(text, 2);
  if (hits.length === 0 || (!hits[0].hinted && hits[0].score < 1)) return { text: dontKnow(data.email), sources: [] };
  const used = hits.filter((h) => h.hinted === hits[0].hinted && h.score >= hits[0].score * 0.6);
  const body = used
    .map((h) => `${h.section.summary}${h.section.sample ? ' (sample content)' : ''}`)
    .join('\n\n');
  return { text: body, sources: used.map((h) => sourceOf(h.section)) };
}
