import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
for (const path of ['/', '/?tier=low', '/projects/documind', '/freelance/clinic-booking', '/privacy', '/nope']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('console', m => { const t = m.text(); if ((m.type()==='error'||m.type()==='warning') && !t.includes('GL Driver')) errs.push(m.type()+': '+t.slice(0,300)); });
  p.on('pageerror', e => errs.push('pageerror: '+e.message.slice(0,300)));
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status()+' '+r.url()); });
  await p.goto('http://localhost:3100'+path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(4000);
  await p.mouse.wheel(0, 3000); await p.waitForTimeout(1500);
  console.log(path, errs.length ? JSON.stringify(errs, null, 1) : 'clean');
  await p.close();
}
await b.close();
