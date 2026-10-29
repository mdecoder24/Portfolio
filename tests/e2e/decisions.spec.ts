import { expect, test } from './fixtures';

test('the project switcher changes the pinned cover from the keyboard', async ({ page }) => {
  await page.goto('/?3d=off');
  const section = page.locator('#decisions');
  const radios = section.getByRole('radio');
  await radios.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeChecked();
  const panels = section.locator('.decision-panel');
  await expect(panels.nth(0)).toBeHidden();
  await expect(panels.nth(1)).toBeVisible();
});

test('focusing a pin highlights its decision', async ({ page }) => {
  await page.goto('/?3d=off');
  const panel = page.locator('#decisions .decision-panel').first();
  await panel.getByRole('link', { name: /^Decision 2:/ }).focus();
  await expect(panel.locator('li').nth(1)).toHaveAttribute('data-on', 'true');
  await expect(panel.locator('li').nth(0)).not.toHaveAttribute('data-on');
});

test('without JavaScript every decision is in the page and the switcher still works', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/?3d=off');
  const section = page.locator('#decisions');
  await expect(section.locator('li[id^="decision-"]')).toHaveCount(12);
  await section.locator('.decision-pick').nth(2).click();
  await expect(section.locator('.decision-panel').nth(2)).toBeVisible();
  await context.close();
});
