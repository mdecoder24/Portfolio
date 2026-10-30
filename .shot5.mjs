import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const errs = [];
for (const [w, q] of [[1440, '?tier=high'], [360, '?3d=off']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:3000/' + q + '#work'); await p.waitForTimeout(3500);
  await p.locator('#work header').screenshot({ path: '/private/tmp/claude-501/-Users-kush24-Projects-Portfolio/a172d588-bce6-47e9-8c7d-5c9dfb2e7f5d/scratchpad/wh-' + w + '.png' });
  const c = p.locator('#work article').nth(3); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
  await c.screenshot({ path: '/private/tmp/claude-501/-Users-kush24-Projects-Portfolio/a172d588-bce6-47e9-8c7d-5c9dfb2e7f5d/scratchpad/sen-' + w + '.png' });
}
console.log('errors:', errs); await b.close();
