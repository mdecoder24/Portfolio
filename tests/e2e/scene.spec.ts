import { expect, test } from '@playwright/test';

test('the canvas mounts at ?tier=low with a clean console', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?tier=low');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('data-scene', 'ready');
  // Decoration only: the canvas sits inside an aria-hidden layer
  expect(await page.locator('canvas').evaluate((c) => !!c.closest('[aria-hidden="true"]'))).toBe(true);
  expect(errors).toEqual([]);
});

test('?3d=off renders the poster and no canvas', async ({ page }) => {
  await page.goto('/?3d=off');
  await page.waitForTimeout(3000);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('#hero svg').first()).toBeAttached();
});

test('the footer 3D toggle removes the canvas', async ({ page }) => {
  await page.goto('/?tier=low');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15_000 });
  await page.getByText('Off', { exact: true }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('the headline is in the HTML before any script runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build web products that think and move.');
  await expect(page.getByRole('heading', { name: 'Freelance and client work' })).toBeVisible();
  await context.close();
});
