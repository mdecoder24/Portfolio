import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

// Scan the settled page: with reduced motion nothing is mid-fade, so contrast is measured on final colours
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kr-motion-v2', 'reduced'));
});

for (const path of ['/?3d=off', '/projects/mun-website?3d=off', '/privacy', '/no-such-page']) {
  test(`no axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}

test('the first Tab reaches the skip link, which moves focus to the content', async ({ page }) => {
  await page.goto('/?3d=off');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('the mobile menu traps focus and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?3d=off');
  const open = page.getByRole('button', { name: 'Open menu' });
  await open.click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  await expect(open).toBeFocused();
});
