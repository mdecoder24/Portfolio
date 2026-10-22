import { expect, test } from '@playwright/test';

test('no horizontal scroll, and the hero headline is visible in the first viewport', async ({ page }) => {
  await page.goto('/?3d=off');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeVisible();
});

test('case-study pages render with previous and next links', async ({ page }) => {
  await page.goto('/projects/pulse?3d=off');
  await expect(page.getByRole('heading', { level: 1, name: 'Pulse' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'More case studies' }).getByRole('link')).toHaveCount(2);
});
