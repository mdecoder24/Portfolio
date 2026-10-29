// Authors the sample figure plates in public/media as line-ink drawings: 1.5 px ink on white, square corners,
// orange only for callout dots. Placeholders until real screenshots replace them. Run: node scripts/covers.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

// Dark plates sit quietly on the dark ground and still read on the light theme
const INK = '#d6d6db';
const FILL = '#131315';
const BG = '#0e0e10';
const ACCENT = '#c2410c';
const W = 1600;
const H = 1000;

const rect = (x, y, w, h, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra.includes('fill=') ? '' : `fill="${FILL}"`} ${extra.includes('stroke=') ? '' : `stroke="${INK}"`} stroke-width="3" ${extra}/>`;
const line = (x1, y1, x2, y2, w = 3, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
const text = (x, y, s, t, weight = 600) => `<text x="${x}" y="${y}" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="${s}" font-weight="${weight}" fill="${INK}">${t}</text>`;
const rules = (x, y, n, w, gap = 30) => Array.from({ length: n }, (_, i) => line(x, y + i * gap, x + w * (0.5 + ((i * 37) % 50) / 100), y + i * gap, 2)).join('');
const win = (x, y, w, h) => rect(x, y, w, h) + line(x, y + 44, x + w, y + 44) + [0, 1, 2].map((i) => `<circle cx="${x + 26 + i * 22}" cy="${y + 22}" r="6" fill="none" stroke="${INK}" stroke-width="2"/>`).join('');
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${inner}</svg>`;

const covers = {
  'sign-language-recognition':
    win(120, 100, 1360, 800) + rect(170, 190, 820, 650) +
    `<path d="M520 760 L520 520 L470 360 M520 520 L560 330 M540 520 L620 340 M560 520 L670 380 M580 560 L720 480" fill="none" stroke="${INK}" stroke-width="4"/>` +
    [[470, 360], [560, 330], [620, 340], [670, 380], [720, 480], [520, 520], [520, 760]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${ACCENT}"/>`).join('') +
    rect(1040, 190, 400, 650) + text(1075, 250, 26, 'Detected sign', 700) + rect(1075, 290, 330, 110) + rules(1075, 460, 8, 300, 44),
  sensai:
    win(120, 100, 1360, 800) + rect(160, 180, 560, 680) + text(200, 240, 30, 'Résumé', 700) + rules(200, 290, 13, 470, 42) +
    rect(780, 180, 660, 680) + text(820, 240, 30, 'Interview feedback', 700) + rules(820, 300, 5, 560, 44) +
    rect(820, 540, 270, 120) + text(850, 620, 56, '35%', 700) + rect(1120, 540, 280, 120) + rules(1150, 590, 2, 220, 34) + rect(820, 720, 200, 56, `fill="${ACCENT}" stroke="${ACCENT}"`),
  'tedx-mlrit':
    win(120, 100, 1360, 800) + text(180, 330, 110, 'TEDx MLRIT', 700) + rules(180, 400, 3, 560, 40) +
    rect(180, 520, 220, 64, `fill="${ACCENT}" stroke="${ACCENT}"`) +
    [0, 1, 2, 3].map((i) => rect(180 + i * 310, 640, 280, 200) + `<circle cx="${320 + i * 310}" cy="710" r="40" fill="none" stroke="${INK}" stroke-width="3"/>` + line(230 + i * 310, 790, 410 + i * 310, 790, 2)).join(''),
};

for (const [slug, inner] of Object.entries(covers)) {
  mkdirSync(`public/media/${slug}`, { recursive: true });
  writeFileSync(`public/media/${slug}/cover.svg`, svg(inner));
}
console.log(`${Object.keys(covers).length} plates written`);
