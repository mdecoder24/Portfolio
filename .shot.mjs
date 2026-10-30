import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [q, w] of [['3d=off', 1440], ['tier=high', 1440], ['tier=low', 1440], ['3d=off', 360]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 140)));
  await p.goto('http://localhost:3000/?' + q + '#work', { waitUntil: 'networkidle' });
  const card = p.locator('#work article').filter({ hasText: 'TEDx MLRIT website' });
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(7000);
  await card.locator('div').first().screenshot({ path: '/private/tmp/claude-501/-Users-kush24-Projects-Portfolio/a172d588-bce6-47e9-8c7d-5c9dfb2e7f5d/scratchpad/pair-' + q.replace('=', '-') + '-' + w + '.png' });
  console.log(q, w, 'canvas:', await card.locator('canvas').count(), 'errors', errs);
}
await b.close();
