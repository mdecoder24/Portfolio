import { chromium } from '@playwright/test';
const S = process.argv[2];
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [w,h,n,q,t] of [[1440,900,'d',''],[390,844,'m',''],[1440,900,'off','?3d=off'],[1024,768,'tab',''],[1440,900,'light','','light']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  if (t) await p.addInitScript((t) => localStorage.setItem('kr-theme', t), t);
  const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type()==='error' && errs.push(m.text().slice(0,140)));
  await p.goto('http://localhost:3100/' + q, { waitUntil: 'networkidle' }); await p.waitForTimeout(q ? 1500 : 7000);
  await p.screenshot({ path: `${S}/v7-${n}.png` });
  console.log(n, errs.join(' | ') || 'clean');
}
await b.close();
