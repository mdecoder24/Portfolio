import { test } from './fixtures';

// Temporary: screenshots of the more-projects invitation for a visual check
test('shot', async ({ page }) => {
  await page.goto('/?3d=off#work');
  const btn = page.locator('#work').getByRole('button', { name: /^View more projects/ });
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const w = page.viewportSize()?.width ?? 0;
  await btn.locator('xpath=../..').screenshot({ path: `/tmp/more-${w}.png` });
});

