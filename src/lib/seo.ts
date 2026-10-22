import { caseStudyHref, config, profile, skills } from '@/content';
import type { CaseStudy } from '@/content/schema';

/** JSON-LD as a string safe to inline in a script tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personLd() {
  const url = config.site.url;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    dateModified: config.site.lastUpdated,
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      jobTitle: 'Associate Software Engineer',
      worksFor: { '@type': 'Organization', name: 'Knowvation Learnings Pvt Ltd' },
      address: { '@type': 'PostalAddress', addressLocality: profile.location.city, addressCountry: 'IN' },
      email: `mailto:${config.links.email}`,
      url,
      sameAs: [config.links.linkedin, config.links.github],
      knowsAbout: skills.filter((s) => s.tier === 'daily').map((s) => s.name),
    },
  };
}

export function caseStudyLd(study: CaseStudy) {
  const url = `${config.site.url}${caseStudyHref(study)}`;
  const section = study.kind === 'freelance' ? 'Freelance' : 'Projects';
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: study.title,
      description: study.outcome,
      url,
      author: { '@type': 'Person', name: profile.name, url: config.site.url },
      keywords: study.stack.join(', '),
      dateCreated: study.start,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: config.site.url },
        { '@type': 'ListItem', position: 2, name: section, item: `${config.site.url}/#${section.toLowerCase()}` },
        { '@type': 'ListItem', position: 3, name: study.title, item: url },
      ],
    },
  ];
}
