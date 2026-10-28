'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem('kr-theme', next);
        } catch {
          // Storage unavailable: the theme lasts for this page only
        }
      }}
      className="inline-flex size-10 items-center justify-center rounded-full border border-rule text-ink transition-colors duration-150 hover:border-rule-strong hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
    >
      {theme === 'dark' ? (
        <Sun className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
