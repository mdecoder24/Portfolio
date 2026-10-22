'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buttonClasses } from '@/components/ui/Button';

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={buttonClasses({ variant: 'quiet' })}
      onClick={() =>
        navigator.clipboard.writeText(email).then(
          () => setCopied(true),
          () => window.open(`mailto:${email}`),
        )
      }
    >
      {copied ? (
        <Check className="size-5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Copy className="size-5" strokeWidth={1.75} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? 'Email copied' : 'Copy email'}</span>
    </button>
  );
}

/** "It's 8:08 PM in Hyderabad", updated every minute. Client-only, so the static page carries no stale time. */
export function LocalTime({ city, timeZone }: { city: string; timeZone: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone });
    const tick = () => setNow(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return (
    <p className="min-h-[1.5em] type-small tabular text-mist">{now && `It's ${now} in ${city}`}</p>
  );
}
