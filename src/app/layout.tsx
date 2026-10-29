import type { Metadata, Viewport } from 'next';
import { PageObserver } from '@/components/layout/PageObserver';
import { SkipLink } from '@/components/layout/SkipLink';
import { config, profile } from '@/content';
import tokens from '../../design/tokens.json';
import { geist, geistMono } from './fonts';
import './globals.css';

export const ensureStatic = 'navigation';

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: { default: 'Kushwant KR – Full-stack and AI engineer in Hyderabad', template: '%s – Kushwant KR' },
  description:
    'Kushwant KR builds web products that think and move: full-stack apps, AI chatbots, and 3D on the web. Associate Software Engineer and freelance developer in Hyderabad.',
  authors: [{ name: profile.name, url: config.site.url }],
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', siteName: 'Kushwant KR', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

// Theme colours for the browser chrome, read from the tokens rather than repeated here
const paper = tokens.color.tokens.find((t) => t.name === 'paper')?.value ?? { light: '', dark: '' };
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: paper.dark },
    { media: '(prefers-color-scheme: light)', color: paper.light },
  ],
  viewportFit: 'cover',
};

// Applies saved theme and motion preferences before first paint, so neither flashes, and skips the home intro when it
// has already played this session or the visitor followed a link straight to a section
const prefScript = `try{var d=document.documentElement,t=localStorage.getItem('kr-theme');if(t==='dark'||t==='light')d.dataset.theme=t;var m=localStorage.getItem('kr-motion-v2');if(m)d.dataset.motion=m;if(location.hash||sessionStorage.getItem('kr-intro'))d.dataset.introSeen=''}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefScript }} />
      </head>
      {/* Browser extensions stamp classes on <body> before React hydrates (for example "check_gok_chrome_installed");
          this silences only that element's own attribute mismatch, not its children's */}
      <body id="top" suppressHydrationWarning>
        <SkipLink />
        {children}
        <PageObserver />
      </body>
    </html>
  );
}
