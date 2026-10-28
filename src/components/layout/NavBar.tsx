'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useUi } from '@/stores/ui';
import { NAV_ITEMS, RESUME_HREF } from './navItems';
import { Monogram } from './Monogram';
import { ThemeToggle } from './ThemeToggle';

export function NavBar({ socials, onHome }: { socials: { label: string; href: string }[]; onHome: boolean }) {
  const active = useUi((s) => s.activeSection);
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // The rule under the bar fills with reading progress; written straight to the element, no re-render per scroll
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current?.style.setProperty('scale', `${max > 0 ? window.scrollY / max : 0} 1`);
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const hash = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const close = () => dialog.current?.close();

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-nav h-(--nav-height) bg-paper/0 transition-[background-color] duration-300 data-[scrolled=true]:bg-paper-veil data-[scrolled=true]:backdrop-blur-md"
    >
      <nav aria-label="Main" className="container-kit flex h-full items-center gap-6">
        <Link
          href="/#top"
          aria-label="Kushwant KR"
          className="inline-flex min-h-11 items-center rounded-xs text-ink focus-visible:outline-none focus-visible:shadow-focus"
        >
          <Monogram />
        </Link>
        <ul className="ml-auto hidden items-center gap-7 min-[900px]:flex">
          {NAV_ITEMS.map((item) => {
            const current = onHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={hash(item.id)}
                  aria-current={current ? 'location' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-xs type-small font-medium text-ink-2 transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:shadow-focus',
                    'after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 after:ease-out-quint',
                    'aria-[current=location]:text-ink aria-[current=location]:after:scale-x-100',
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="ml-auto flex items-center gap-2 min-[900px]:ml-2">
          <a
            href={RESUME_HREF}
            download="Kushwant-KR-Resume.pdf"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-control bg-cream px-4 type-small font-medium text-on-cream transition-[background-color,scale] duration-150 hover:bg-ink-hover focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97]"
          >
            Résumé
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => dialog.current?.showModal()}
            className="inline-flex size-10 items-center justify-center rounded-full border border-rule text-ink hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus min-[900px]:hidden"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </nav>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-rule" />
      <span
        ref={progress}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink"
        style={{ scale: '0 1' }}
      />

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-transparent open:flex open:flex-col"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="container-kit flex h-(--nav-height) items-center justify-between">
          <Monogram />
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex size-10 items-center justify-center rounded-full border border-rule hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <ul className="container-kit grid pt-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="border-b border-rule">
              <a
                href={hash(item.id)}
                onClick={close}
                className="flex min-h-18 items-center type-h2 text-ink hover:text-ink-2 focus-visible:outline-none focus-visible:shadow-focus"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-kit mt-auto flex flex-wrap gap-6 pb-[max(32px,env(safe-area-inset-bottom))]">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="inline-flex min-h-11 items-center type-ui text-ink-2 hover:text-ink">
              {s.label}
            </a>
          ))}
        </div>
      </dialog>
    </header>
  );
}
