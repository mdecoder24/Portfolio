import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import type { Config, Profile } from '@/content/schema';
import { ContactForm } from './ContactForm';
import { CopyEmail, LocalTime } from './ContactAside';

export function Contact({ config, profile }: { config: Config; profile: Profile }) {
  const { links } = config;
  const link =
    'w-fit rounded-xs type-body text-pearl underline decoration-line-strong underline-offset-4 hover:text-rose hover:decoration-rose focus-visible:outline-none focus-visible:shadow-focus';
  return (
    <Section id="contact">
      <SectionHeader
        id="contact"
        title="Let's build something"
        summary="Tell me about a role, a project, or an idea. I reply within 24 hours."
      />
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <ContactForm email={links.email} />
        </div>
        <aside aria-label="Reach me directly" className="grid content-start gap-4 lg:col-span-4 lg:col-start-9">
          <h3 className="type-h4 text-pearl">Or reach me directly</h3>
          <div className="grid gap-1">
            <a href={`mailto:${links.email}`} className={link}>
              {links.email}
            </a>
            <div className="-ml-2">
              <CopyEmail email={links.email} />
            </div>
          </div>
          <ul className="flex gap-6">
            <li>
              <a href={links.linkedin} className={link}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={links.github} className={link}>
                GitHub
              </a>
            </li>
          </ul>
          <LocalTime city={profile.location.city} timeZone={profile.location.timeZone} />
        </aside>
      </div>
    </Section>
  );
}
