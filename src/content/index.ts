// The single content entry point: pages import from here and pass typed props down.
import { cafeQrOrdering } from './freelance/cafe-qr-ordering.ts';
import { clinicBooking } from './freelance/clinic-booking.ts';
import { realtyLeadDashboard } from './freelance/realty-lead-dashboard.ts';
import { skincare3dLaunch } from './freelance/skincare-3d-launch.ts';
import { codelens } from './projects/codelens.ts';
import { documind } from './projects/documind.ts';
import { orbit } from './projects/orbit.ts';
import { pulse } from './projects/pulse.ts';
import type { CaseStudy } from './schema.ts';

export { config } from './config.ts';
export { profile } from './profile.ts';
export { experience } from './experience.ts';
export { skills, tierCopy } from './skills.ts';
export { services, process } from './services.ts';
export { testimonials } from './testimonials.ts';
export { education, achievements } from './education.ts';

export const projects: CaseStudy[] = [documind, pulse, orbit, codelens];
export const freelance: CaseStudy[] = [clinicBooking, cafeQrOrdering, realtyLeadDashboard, skincare3dLaunch];

export const caseStudyHref = (c: CaseStudy) => `/${c.kind === 'freelance' ? 'freelance' : 'projects'}/${c.slug}`;
