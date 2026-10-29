import { chromium } from '@playwright/test';
const out = process.argv[2];
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
for (const [name, w, h, q] of [['d1440',1440,900,'?tier=high'],['m360',360,780,'?tier=low'],['off',1440,900,'?tier=off']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('console', m => { if (m.type()==='error' || m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,200)); });
  p.on('pageerror', e => errs.push('pageerror: '+e.message));
  await p.goto('http://localhost:3000/'+q, { waitUntil: 'networkidle' });
  await p.waitForTimeout(5000);
  await p.mouse.wheel(0, h*1.3); await p.waitForTimeout(2500);
  const n = await p.evaluate(() => document.querySelectorAll('canvas').length);
  const fixed = await p.evaluate(() => !!document.querySelector('.z-canvas canvas'));
  await p.screenshot({ path: `${out}/${name}.png` });
  console.log(name, 'canvases', n, 'backdrop', fixed, errs.length ? errs : 'no errors');
  await p.close();
}
await b.close();
