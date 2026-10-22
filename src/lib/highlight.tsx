import { Fragment, type ReactNode } from 'react';

/** Sets the given phrases in bold inside running text, the way the bio card stresses its facts. */
export function highlight(text: string, phrases: string[]): ReactNode {
  if (phrases.length === 0) return text;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return parts.map((part, i) =>
    phrases.includes(part) ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
