// Tailwind's default palette still compiles, so fail lint when a component uses it (Nacre "Guardrails").
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const palette =
  /\b(bg|text|border|ring|fill|stroke|outline|decoration)-((slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}|black|white)\b/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css|mdx)$/.test(p) ? [p] : [];
  });

const hits = walk('src').flatMap((file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .map((line, i) => (palette.test(line) ? `${file}:${i + 1}: ${line.trim()}` : null))
    .filter((x): x is string => x !== null),
);

if (hits.length) {
  console.error('Default Tailwind palette classes found:\n' + hits.join('\n'));
  process.exit(1);
}
console.log('palette-check: no default palette classes');
