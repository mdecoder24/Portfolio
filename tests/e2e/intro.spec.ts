import { expect, test } from '@playwright/test';

test('the sticky-note intro plays once, then lifts to show the site', async ({ page }) => {
  await page.goto('/?3d=off');
  const intro = page.locator('#intro');
  await expect(intro).toBeVisible();
  await expect(intro.getByText('Welcome')).toBeVisible();
  await expect(intro.getByText('Full-stack & AI engineer')).toBeVisible();
  await expect(intro).toBeHidden({ timeout: 6000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  // A reload in the same session goes straight to the page
  await page.reload();
  await expect(intro).toBeHidden();
});

test('any key skips the intro', async ({ page }) => {
  await page.goto('/?3d=off');
  await expect(page.locator('#intro')).toBeVisible();
  // Keys only skip once the intro has hydrated; it marks itself seen for the session at that point
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('kr-intro'))).toBe('1');
  await page.keyboard.press('Shift');
  await expect(page.locator('#intro')).toBeHidden({ timeout: 1000 });
});

test('reduced motion and links to a section never show the intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?3d=off');
  await expect(page.locator('#intro')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/?3d=off#work');
  await expect(page.locator('#intro')).toBeHidden();
});
