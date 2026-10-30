import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const path of ['/', '/committees', '/about']) {
  await p.goto('https://mlritmun.vercel.app' + path, { waitUntil: 'networkidle' });
  console.log('=== ' + path + ' | ' + await p.title());
  console.log((await p.innerText('body')).replace(/\n+/g, ' | ').slice(0, 1500));
}
await b.close();
