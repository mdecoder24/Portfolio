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
const callout = (x, y, tx, ty, letter) =>
  `${line(x, y, tx, ty, 2)}<circle cx="${x}" cy="${y}" r="5" fill="${INK}"/><circle cx="${tx}" cy="${ty}" r="22" fill="${ACCENT}"/>` +
  `<text x="${tx}" y="${ty + 8}" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="${BG}">${letter}</text>`;
const win = (x, y, w, h) => rect(x, y, w, h) + line(x, y + 44, x + w, y + 44) + [0, 1, 2].map((i) => `<circle cx="${x + 26 + i * 22}" cy="${y + 22}" r="6" fill="none" stroke="${INK}" stroke-width="2"/>`).join('');
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${inner}</svg>`;

const covers = {
  'clinic-booking':
    win(140, 110, 1000, 760) + text(200, 300, 52, 'Book a consultation', 700) + rules(200, 360, 6, 420) +
    rect(720, 200, 360, 600) + rules(760, 260, 3, 260) + rect(760, 400, 130, 50) + rect(910, 400, 130, 50, `fill="${ACCENT}" stroke="${ACCENT}"`) +
    text(778, 433, 20, 'Tue 10:30') + `<text x="928" y="433" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="20" font-weight="600" fill="#fff">Wed 9:00</text>` +
    rect(760, 720, 280, 50) + callout(975, 425, 1300, 330, 'A') + callout(900, 745, 1300, 640, 'B'),
  'cafe-qr-ordering':
    rect(220, 120, 320, 760, 'rx="0"') + Array.from({ length: 5 }, (_, i) => rect(255, 190 + i * 125, 250, 95) + rect(270, 205 + i * 125, 60, 60) + line(350, 225 + i * 125, 480, 225 + i * 125, 2) + line(350, 250 + i * 125, 430, 250 + i * 125, 2)).join('') +
    win(660, 220, 720, 520) + [0, 1, 2].map((i) => rect(700 + i * 225, 300, 200, 400) + rules(720 + i * 225, 340, 8, 150, 40)).join('') +
    callout(380, 360, 660, 140, 'A') + callout(1020, 300, 1300, 140, 'B'),
  'realty-lead-dashboard':
    win(120, 100, 1360, 800) + rect(150, 175, 240, 690) + rules(180, 220, 10, 170, 56) +
    [0, 1, 2].map((i) => rect(430 + i * 340, 175, 310, 130) + text(460 + i * 340, 265, 60, ['248', '31', '12'][i], 700)).join('') +
    Array.from({ length: 8 }, (_, i) => line(430, 350 + i * 64, 1450, 350 + i * 64, 2) + line(450, 378 + i * 64, 670, 378 + i * 64, 2) + rect(1270, 362 + i * 64, 150, 32)).join('') +
    callout(1345, 442, 1540, 300, 'A'),
  'skincare-3d-launch':
    text(160, 380, 76, 'Meet the serum', 700) + rules(160, 450, 4, 520, 36) + rect(160, 620, 240, 64) +
    `<ellipse cx="1080" cy="850" rx="260" ry="40" fill="none" stroke="${INK}" stroke-width="3"/>` +
    rect(980, 320, 200, 520) + rect(1020, 230, 120, 90) + rect(1005, 500, 150, 160) + line(1080, 180, 1080, 900, 2, '10 10') +
    callout(1180, 420, 1400, 420, 'A') + text(1435, 428, 26, 'Niacinamide 10%'),
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

// Portrait phone screens (390 × 844) for projects shown on a 3D phone
const PW = 780;
const PH = 1688;
const phone = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" width="${PW}" height="${PH}"><rect width="${PW}" height="${PH}" fill="${BG}"/>${inner}</svg>`;
const bubble = (x, y, w, h, mine) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${mine ? ACCENT : FILL}" stroke="${mine ? ACCENT : INK}" stroke-width="3"/>`;
const screens = {
  'clinic-booking':
    text(60, 150, 44, 'Book a consultation', 700) + line(60, 200, 720, 200, 2) +
    bubble(60, 260, 520, 120, false) + rules(95, 305, 2, 420, 34) +
    bubble(260, 430, 460, 90, true) +
    bubble(60, 570, 560, 300, false) + rules(95, 620, 3, 420, 34) +
    rect(95, 740, 220, 80) + rect(335, 740, 220, 80, `fill="${ACCENT}" stroke="${ACCENT}"`) + text(120, 792, 30, 'Tue 10:30') +
    `<text x="360" y="792" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="${BG}">Wed 9:00</text>` +
    bubble(60, 1460, 660, 110, false) + rules(100, 1515, 1, 400),
  'cafe-qr-ordering':
    text(60, 150, 48, 'Table 7 · Menu', 700) + line(60, 200, 720, 200, 2) +
    Array.from({ length: 6 }, (_, i) => rect(60, 250 + i * 190, 660, 160) + rect(85, 275 + i * 190, 110, 110) + line(225, 300 + i * 190, 520, 300 + i * 190, 3) + line(225, 345 + i * 190, 430, 345 + i * 190, 2) + rect(580, 300 + i * 190, 110, 60)).join('') +
    rect(60, 1440, 660, 120, `fill="${ACCENT}" stroke="${ACCENT}"`) + `<text x="390" y="1515" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="${BG}">Place order</text>`,
};
for (const [slug, inner] of Object.entries(screens)) writeFileSync(`public/media/${slug}/screen-phone.svg`, phone(inner));

for (const [slug, inner] of Object.entries(covers)) {
  mkdirSync(`public/media/${slug}`, { recursive: true });
  writeFileSync(`public/media/${slug}/cover.svg`, svg(inner));
}
console.log(`${Object.keys(covers).length} plates written`);
