// scripts/tokens.ts: turns design/tokens.json (exported from the Nacre design system) into src/styles/tokens.css.
// Run with `node scripts/tokens.ts` (Node 22.18+ runs TypeScript directly) or via `pnpm tokens`.
import { readFileSync, writeFileSync } from 'node:fs';

type Value = string | Record<string, string>;
interface Token { name: string; value: Value; usage?: string }
interface Family { tokens: Token[] }

const src = JSON.parse(readFileSync('design/tokens.json', 'utf8'));
const themes: { id: string }[] = src.color.themes;
const first = themes[0].id;

const pick = (t: Token, theme: string): string =>
  typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[first]);
// "{lagoon}" is an alias of another token
const css = (v: string): string => v.replace(/^\{([A-Za-z0-9_.-]+)\}$/, 'var(--$1)');
const fam = (key: string): Token[] => ((src[key] as Family | undefined)?.tokens ?? []);

const colors = fam('color');
const shadows = fam('shadow');
const themed = (theme: string, onlyChanged: boolean): string =>
  [
    ...colors.map((t) => [t.name, t] as const),
    ...shadows.map((t) => [`nacre-${t.name}`, t] as const),
  ]
    .filter(([, t]) => !onlyChanged || (typeof t.value !== 'string' && pick(t, theme) !== pick(t, first)))
    .map(([name, t]) => `  --${name}: ${css(pick(t, theme))};`)
    .join('\n');

const plain = (keys: string[]): string =>
  keys.flatMap(fam).map((t) => `  --${t.name}: ${pick(t, first)};`).join('\n');

const out = [
  '/* Generated from design/tokens.json by scripts/tokens.ts. Edit the design system, not this file. */',
  '',
  `:root,\n[data-theme="${first}"] {\n  color-scheme: ${first};\n${themed(first, false)}\n}`,
  ...themes.slice(1).map((t) => `[data-theme="${t.id}"] {\n  color-scheme: ${t.id};\n${themed(t.id, true)}\n}`),
  '',
  `:root {\n${plain(['spacing', 'size', 'zIndex'])}\n}`,
  '',
  '@theme {',
  '  --radius-*: initial;',
  fam('radius').map((t) => `  --${t.name}: ${pick(t, first)};`).join('\n'),
  '}',
  '',
  '@theme inline {',
  colors.map((t) => `  --color-${t.name}: var(--${t.name});`).join('\n'),
  ...shadows.map((t) =>
    t.name === 'shadow-lustre'
      ? '  --inset-shadow-lustre: var(--nacre-shadow-lustre);'
      : `  --${t.name}: var(--nacre-${t.name});`,
  ),
  '}',
  '',
  ...fam('zIndex').map((t) => `@utility ${t.name} {\n  z-index: var(--${t.name});\n}`),
  '',
].join('\n');

writeFileSync('src/styles/tokens.css', out);
console.log(`src/styles/tokens.css: ${colors.length} colours, ${themes.length} themes`);
