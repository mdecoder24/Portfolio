import type { Metadata, Viewport } from 'next';
import { PageObserver } from '@/components/layout/PageObserver';
import { SceneMount } from '@/components/layout/SceneMount';
import { SkipLink } from '@/components/layout/SkipLink';
import { config, profile } from '@/content';
import { anek, anekTelugu, martian } from './fonts';
import tokens from '../../design/tokens.json';
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

const lagoon = tokens.color.tokens.find((t) => t.name === 'lagoon')?.value.dark;
export const viewport: Viewport = { themeColor: lagoon, colorScheme: 'dark', viewportFit: 'cover' };

// Applies the saved motion preference before first paint, so reduced motion never flashes an animation
const prefScript = `try{var m=localStorage.getItem('kr-motion');if(m)document.documentElement.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${anek.variable} ${anekTelugu.variable} ${martian.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefScript }} />
      </head>
      <body id="top">
        <SkipLink />
        {config.flags.threeD && <SceneMount />}
        <PageObserver />
        {children}
      </body>
    </html>
  );
}
