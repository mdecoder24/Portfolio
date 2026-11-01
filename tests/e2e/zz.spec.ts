import { test } from './fixtures';
for (const width of [360, 1440]) for (const q of ['', '?3d=off']) test('s' + width + q, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/' + q + '#contact');
  const dd = page.locator('#contact dd').last();
  await dd.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/private/tmp/claude-501/-Users-kush24-Projects-Portfolio/fe690e07-53f7-46aa-a632-01b7f9e1ef4c/scratchpad/else-' + width + (q ? '-off' : '-on') + '.png' });
  console.log('OVERFLOW', width, q, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
});
