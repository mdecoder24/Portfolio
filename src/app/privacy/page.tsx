import type { Metadata } from 'next';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { config } from '@/content';

export const metadata: Metadata = { title: 'Privacy', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  const p = 'type-body max-w-(--measure)';
  return (
    <SiteChrome>
      <article className="container-kit grid gap-8 py-(--section-pad) lg:pl-[calc(2/12*100%)]">
        <h1 className="type-h1 text-ink">Privacy</h1>
        <p className="type-lead max-w-[60ch] text-ink-2">What this site collects, why, and how to have it deleted.</p>
        <section className="grid gap-3">
          <h2 className="type-h3">Contact form</h2>
          <p className={p}>
            When you send a message, your name, email, and message are emailed to me so I can reply. They are not stored
            in a database on this site. I keep the email only as long as the conversation needs it.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="type-h3">Analytics</h2>
          <p className={p}>
            This site uses no cookies and no tracking scripts. Your motion and 3D preferences are saved in your
            browser&apos;s local storage and never leave your device.
          </p>
        </section>
        <section className="grid gap-3">
          <h2 className="type-h3">Your rights</h2>
          <p className={p}>
            To see or delete anything you sent me, email{' '}
            <a href={`mailto:${config.links.email}`} className="text-accent underline underline-offset-4">
              {config.links.email}
            </a>
            . I act on requests within 7 days, following the notice-and-consent principles of India&apos;s Digital
            Personal Data Protection Act, 2023.
          </p>
        </section>
      </article>
    </SiteChrome>
  );
}
