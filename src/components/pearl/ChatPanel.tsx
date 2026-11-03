'use client';

import { ArrowUp, RotateCcw, Square, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MAX_INPUT, type PearlData } from '@/lib/pearl-local/search';
import { cn } from '@/lib/cn';
import { useUi, type SectionId } from '@/stores/ui';
import { AnswerText } from './AnswerText';
import { usePearl } from './usePearl';

// Starter chips from the PRD; they follow the section in view
const STARTERS: Partial<Record<SectionId, string[]>> & { default: string[] } = {
  default: ['Who is Kushwant?', 'Show me his best project', 'Is he available for freelance?', 'Check his fit for my role'],
  freelance: ['What has he built for clients?', 'Is he available for freelance?', 'What does he use for AI work?'],
  work: ["What's the hardest problem he solved?", 'Which projects use AI?', 'Has he used Next.js?'],
};
const FIT_PROMPT = 'Paste the job description below and I’ll compare it with Kushwant’s portfolio.';

const iconButton =
  'inline-flex size-10 items-center justify-center rounded-control text-ink-2 transition-[background-color,color,scale] duration-150 ease-out hover:bg-plate-hover hover:text-ink focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97]';

export default function ChatPanel({ data, onClose }: { data: PearlData; onClose: () => void }) {
  const { messages, status, model, progress, send, stop, newChat, enableModel } = usePearl(data);
  const section = useUi((s) => s.activeSection);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const [allowed] = useState(() => {
    // Absolute links Pearl may show: the ones the portfolio itself lists, plus the email address
    const urls = data.sections.flatMap((s) => s.text.match(/https?:\/\/[^\s,)]+[^\s,).]/g) ?? []);
    return new Set([...urls, data.email]);
  });

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    // A bottom sheet on phones is modal (focus stays inside, the page is inert); the desktop side panel is not
    if (matchMedia('(max-width: 39.999rem)').matches) d.showModal();
    else d.show();
    input.current?.focus();
    return () => d.close();
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages]);

  const busy = status !== 'idle';
  const last = messages.at(-1);
  const starters = messages.length === 0 ? (STARTERS[section] ?? STARTERS.default) : [];
  const subline =
    model === 'available'
      ? 'Answers from Kushwant’s portfolio, on your device'
      : model === 'downloading'
        ? `Getting on-device answers ready${progress != null ? `: ${Math.round(progress * 100)}%` : ''}`
        : 'Quick answers mode';

  function submit(text: string) {
    if (!text.trim() || busy) return;
    if (text === 'Check his fit for my role') {
      setHint(FIT_PROMPT);
      input.current?.focus();
      return;
    }
    setHint(null);
    setDraft('');
    void send(text);
  }

  return (
    <dialog
      ref={dialog}
      id="pearl-panel"
      aria-labelledby="pearl-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      className={cn(
        'fixed z-toast m-0 hidden flex-col open:flex overflow-hidden border border-rule bg-plate p-0 text-ink shadow-float',
        // Desktop: a 400 px side panel; phones: a bottom sheet at 90% of the screen (Nacre ChatPanel)
        'inset-auto right-6 bottom-6 h-[min(44rem,calc(100svh-3rem))] w-100 rounded-lg',
        'max-sm:inset-x-0 max-sm:bottom-0 max-sm:h-[90svh] max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none',
        'backdrop:bg-paper-veil',
        'transition-[opacity,translate] duration-200 ease-out-quint starting:translate-y-6 starting:opacity-0 calm:starting:translate-y-0',
      )}
    >
      <header className="flex items-center gap-3 border-b border-rule px-5 py-3">
        <span aria-hidden="true" className="kr-pearl size-7 shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 id="pearl-title" className="type-ui font-semibold">
            Pearl
          </h2>
          <p className="truncate type-small text-ink-2" aria-live="polite">
            {subline}
          </p>
        </div>
        <button type="button" className={iconButton} aria-label="New chat" onClick={newChat}>
          <RotateCcw className="size-4.5" aria-hidden="true" />
        </button>
        <button type="button" className={iconButton} aria-label="Close Pearl" onClick={onClose}>
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <div ref={log} role="log" aria-live="polite" aria-busy={busy} className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 type-body">
        {messages.length === 0 && (
          <p className="text-ink">
            Hi, I’m Pearl, Kushwant’s AI guide. Ask about his work, check his fit for a role, or scope a project with him.
          </p>
        )}
        {model === 'downloadable' && messages.length === 0 && (
          <div className="rounded-md border border-rule bg-tint p-4 type-small text-ink-2">
            <p>
              Your browser can run Pearl’s AI on this device, for free and without sending your questions anywhere. It
              needs a one-time model download.
            </p>
            <button
              type="button"
              onClick={() => void enableModel()}
              className="mt-2 min-h-11 text-accent underline decoration-1 underline-offset-4 hover:text-accent-hover focus-visible:outline-none focus-visible:shadow-focus"
            >
              Turn on on-device AI
            </button>
          </div>
        )}
        {messages.map((m) =>
          m.role === 'visitor' ? (
            <p
              key={m.id}
              className="max-w-[85%] self-end whitespace-pre-wrap rounded-t-lg rounded-bl-lg rounded-br-xs bg-tint px-4 py-2.5 break-words"
            >
              {m.text.length > 600 ? `${m.text.slice(0, 600)}…` : m.text}
            </p>
          ) : (
            <div key={m.id} className="flex flex-col gap-2">
              <p className="flex items-center gap-2 type-small text-ink-2">
                <span aria-hidden="true" className="kr-pearl size-3.5" />
                Pearl
                {m === last && status === 'thinking' && (
                  <span className="sr-only">is thinking</span>
                )}
                {m === last && status === 'thinking' && (
                  <span aria-hidden="true" className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 animate-bounce rounded-full bg-ink-2 calm:animate-none"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                )}
              </p>
              {m.text ? (
                <AnswerText text={m.text} allowed={allowed} />
              ) : (
                m !== last || !busy ? <p className="text-ink-2">Stopped.</p> : null
              )}
              {m.sources.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Sources">
                  {m.sources.map((s) => (
                    <li key={s.id}>
                      {s.href ? (
                        <Link
                          href={s.href}
                          className="inline-flex min-h-8 items-center rounded-control border border-rule-strong px-3 type-caption text-ink-2 transition-colors duration-150 hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:shadow-focus"
                        >
                          {s.title}
                        </Link>
                      ) : (
                        <span className="type-caption text-ink-2">{s.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}
      </div>

      {starters.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="inline-flex min-h-9 items-center rounded-control border border-rule-strong px-3.5 type-small text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-t border-rule px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        {hint && <p className="pb-2 type-small text-ink-2">{hint}</p>}
        <div className="flex items-end gap-2">
          <label htmlFor="pearl-input" className="sr-only">
            Ask Pearl
          </label>
          <textarea
            ref={input}
            id="pearl-input"
            rows={1}
            value={draft}
            maxLength={MAX_INPUT}
            placeholder={hint ? 'Paste the job description' : 'Ask about Kushwant’s work'}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit(draft);
              }
            }}
            className="field-sizing-content max-h-35 min-h-12 flex-1 resize-none rounded-md border border-rule-strong bg-paper px-3.5 py-3 type-body text-ink placeholder:text-ink-2 focus-visible:outline-none focus-visible:shadow-focus"
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop answering"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-rule-strong text-ink transition-[scale] duration-150 ease-out focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97]"
            >
              <Square className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send"
              aria-disabled={!draft.trim() || undefined}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-[background-color,scale] duration-150 ease-out hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97] aria-disabled:opacity-45"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="pt-2 type-caption text-ink-2">
          AI can make mistakes. Answers come from Kushwant’s portfolio content.{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
            Privacy
          </Link>
        </p>
      </form>
    </dialog>
  );
}
