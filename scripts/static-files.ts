// Writes public/llms.txt and public/humans.txt from content on every build.
import { writeFileSync } from 'node:fs';
import { caseStudyHref, config, profile, projects } from '../src/content/index.ts';

const url = config.site.url;
const best = projects.filter((p) => p.featured).slice(0, 3);

const llms = `# ${profile.name}

> ${profile.role}, based in ${profile.location.city}, ${profile.location.country}. ${profile.subheadline}

## About
${profile.bio}

## Selected work
${best.map((p) => `- [${p.title}](${url}${caseStudyHref(p)}): ${p.outcome}`).join('\n')}

## Contact
- Email: ${config.links.email}
- LinkedIn: ${config.links.linkedin}
- GitHub: ${config.links.github}
- Résumé: ${url}/resume
`;

const humans = `/* TEAM */
Developer: ${profile.name}
Location: ${profile.location.city}, ${profile.location.country}
Contact: ${config.links.email}

/* SITE */
Last update: ${config.site.lastUpdated}
Standards: HTML, CSS, WebGL 2
Components: Next.js, React, React Three Fiber, Tailwind CSS
Type: Anek Latin, Anek Telugu, Martian Mono
`;

writeFileSync('public/llms.txt', llms);
writeFileSync('public/humans.txt', humans);
console.log('public/llms.txt and public/humans.txt written');
