import Link from 'next/link';
import type { ReactNode } from 'react';

// Pearl's answers are plain text with a little Markdown: paragraphs, "- " lists, **bold**, and [label](href).
// Rendered as React elements, never as HTML, so a model can't inject markup. Links go only to this site, to email, or to
// a URL the portfolio itself lists.
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function safeHref(href: string, allowed: Set<string>) {
  // "//host" and "/\host" are protocol-relative in browsers, so they would leave the site
  if (/^\/(?![/\\])/.test(href)) return href;
  if (href.startsWith('#')) return `/${href}`;
  if (href.startsWith('mailto:') && allowed.has(href.slice(7))) return href;
  return allowed.has(href) ? href : null;
}

function inline(text: string, allowed: Set<string>, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k} className="font-semibold">{m[1]}</strong>);
    else {
      const href = safeHref(m[3], allowed);
      const cls = 'text-accent underline decoration-1 underline-offset-4 hover:text-accent-hover';
      if (!href) out.push(m[2]);
      else if (href.startsWith('/')) out.push(<Link key={k} href={href} className={cls}>{m[2]}</Link>);
      else out.push(<a key={k} href={href} className={cls} rel="noopener noreferrer" target={href.startsWith('mailto:') ? undefined : '_blank'}>{m[2]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function AnswerText({ text, allowed }: { text: string; allowed: Set<string> }) {
  // Models sometimes add their own "Sources:" line; the panel shows source chips instead
  const cleaned = text
    .replace(/\n*Sources?:.*$/i, '')
    // Small models cite bare paths, "([/projects/x])"; the source chips already link them
    .replace(/\s*\(?\[(?:\/|#|https?:)[^\]]*\](?!\()\)?/g, '')
    .trim();
  // Consecutive "- " rows form one list; any other rows form a paragraph; blank lines also break paragraphs
  const groups: { list: boolean; rows: string[] }[] = [];
  for (const row of cleaned.split('\n')) {
    if (!row.trim()) {
      groups.push({ list: false, rows: [] });
      continue;
    }
    const list = /^\s*[-*] /.test(row);
    const prev = groups.at(-1);
    if (prev && prev.list === list && (list || prev.rows.length > 0)) prev.rows.push(row);
    else groups.push({ list, rows: [row] });
  }
  return (
    <div className="flex flex-col gap-3">
      {groups
        .filter((g) => g.rows.length > 0)
        .map((g, b) =>
          g.list ? (
            <ul key={b} className="flex list-disc flex-col gap-1 pl-5">
              {g.rows.map((r, j) => (
                <li key={j}>{inline(r.replace(/^\s*[-*] /, ''), allowed, `${b}-${j}`)}</li>
              ))}
            </ul>
          ) : (
            <p key={b}>{inline(g.rows.join(' '), allowed, `${b}`)}</p>
          ),
        )}
    </div>
  );
}
