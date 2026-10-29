import { expect, test } from './fixtures';

test('the canvas mounts at ?tier=low with a clean console', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?tier=low');
  await expect(page.locator('#hero canvas')).toHaveCount(1, { timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'ready');
  // Decoration only: the canvas sits inside an aria-hidden layer
  expect(await page.locator('#hero canvas').evaluate((c) => !!c.closest('[aria-hidden="true"]'))).toBe(true);
  expect(errors).toEqual([]);
});

test('?3d=off renders the poster and no canvas', async ({ page }) => {
  await page.goto('/?3d=off');
  await page.waitForTimeout(3000);
  await expect(page.locator('#hero canvas')).toHaveCount(0);
  // The flat portrait stays visible in its frame
  await expect(page.locator('#hero-portrait img')).toBeVisible();
  await expect(page.locator('#hero-portrait')).not.toHaveAttribute('data-mosaic', 'on');
});

test('the portrait assembles as a pixel mosaic, rests as the sharp photo, and pixelates under the cursor', async ({
  page,
}) => {
  await page.goto('/?tier=low');
  const frame = page.locator('#hero-portrait');
  const flat = frame.locator('img');
  // Once the cells settle, the sharp photo fades back in over them
  await expect(frame).toHaveAttribute('data-mosaic', 'clear', { timeout: 15_000 });
  await expect(flat).toHaveCSS('opacity', '1');
  // Hovering hands back to the pixels so they can part around the cursor
  await frame.hover();
  await expect(frame).toHaveAttribute('data-mosaic', 'pixel');
  await expect(flat).toHaveCSS('opacity', '0');
  // Moving away (still inside the hero, where the scene tracks the pointer) lets it settle sharp again; the timeout
  // covers one idle breath out and back
  await page.locator('#hero-title').hover();
  await expect(frame).toHaveAttribute('data-mosaic', 'clear', { timeout: 10_000 });
});

test('the footer 3D toggle removes the canvas', async ({ page }) => {
  await page.goto('/?tier=low');
  await expect(page.locator('#hero canvas')).toHaveCount(1, { timeout: 15_000 });
  await page.getByText('Off', { exact: true }).click();
  await expect(page.locator('#hero canvas')).toHaveCount(0);
});

test('the headline is in the HTML before any script runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Full-stack & AI engineer');
  await expect(page.getByRole('heading', { name: /can build/i })).toBeVisible();
  await context.close();
});
