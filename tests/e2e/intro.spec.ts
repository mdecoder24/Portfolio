import { expect, test } from '@playwright/test';

test('with 3D off, flat lightning and logo bubbles greet the visitor, then lift to show the site, on every load', async ({ page }) => {
  await page.goto('/?3d=off');
  const intro = page.locator('#intro');
  await expect(intro).toBeVisible();
  await expect(intro.getByText('Welcome, curious mind')).toBeVisible();
  await expect(intro.getByText(/Come in and look around/)).toBeVisible();
  await expect(intro.locator('.intro-bubble path')).toHaveCount(10);
  for (const logo of await intro.locator('.intro-bubble path').all()) await expect(logo).toHaveAttribute('d', /^M/);
  await expect(intro.locator('.intro-bolt')).toHaveCount(2);
  await expect(intro).toBeHidden({ timeout: 6000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  // A reload plays it again
  await page.reload();
  await expect(intro).toBeVisible();
});

test('with WebGL the storm draws on its own canvas in place of the flat layers, cleanly, and then lets go', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?tier=low');
  const intro = page.locator('#intro');
  await expect(intro.locator('canvas')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-intro-gl');
  await expect(intro.locator('.intro-bubble').first()).toBeHidden();
  await expect(intro.getByText('Welcome, curious mind')).toBeVisible();
  await expect(intro).toBeHidden({ timeout: 15_000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  expect(errors).toEqual([]);
});

test('any key skips the intro', async ({ page }) => {
  await page.goto('/?3d=off');
  await expect(page.locator('#intro')).toBeVisible();
  // Keys only skip once the intro has hydrated
  await expect(page.locator('#intro')).toHaveAttribute('data-ready');
  await page.keyboard.press('Shift');
  // The fade replaces the 3.2 s lift, so seeing it proves the skip; a busy machine can start it late, so no tight timer
  const intro = page.locator('#intro');
  await expect(intro).toHaveAttribute('data-skip');
  await expect.poll(() => intro.evaluate((el) => getComputedStyle(el).animationName)).toBe('intro-skip');
  await expect(intro).toBeHidden();
});

test('reduced motion never shows the intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?3d=off');
  await expect(page.locator('#intro')).toBeHidden();
});

// A fresh page each: going from /?3d=off to /?3d=off#work only changes the hash, so nothing would reload
test('links to a section never show the intro', async ({ page }) => {
  await page.goto('/?3d=off#work');
  await expect(page.locator('#intro')).toBeHidden();
});
