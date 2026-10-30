// The single content entry point: pages import from here and pass typed props down.
import { munWebsite } from './projects/mun-website.ts';
import { sensai } from './projects/sensai.ts';
import { signLanguageRecognition } from './projects/sign-language-recognition.ts';
import { tedxMlrit } from './projects/tedx-mlrit.ts';
import type { CaseStudy } from './schema.ts';

export { config } from './config.ts';
export { profile } from './profile.ts';
export { experience } from './experience.ts';
export { skills } from './skills.ts';
export { education, achievements } from './education.ts';
export { freelance } from './freelance.ts';
export { certifications } from './certifications.ts';

export const projects: CaseStudy[] = [munWebsite, signLanguageRecognition, tedxMlrit, sensai];

export const caseStudyHref = (c: CaseStudy) => `/projects/${c.slug}`;
