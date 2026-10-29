import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const path of ['/projects/documind','/freelance/clinic-booking','/projects/nope']) {
  const p = await b.newPage(); const errs=[];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,160)); });
  const r = await p.goto('http://localhost:3000'+path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  console.log(path, r.status(), await p.locator('h1').first().textContent(), errs.length ? errs : 'clean');
  await p.close();
}
await b.close();
