import { expect, test } from './fixtures';

test('invalid fields show their errors and focus the first one', async ({ page }) => {
  await page.goto('/?3d=off#contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter your name.')).toBeVisible();
  await expect(page.getByText('Enter an email address like name@example.com.')).toBeVisible();
  await expect(page.getByLabel('Name')).toBeFocused();
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
});

test('choosing Freelance project reveals budget and timeline', async ({ page }) => {
  await page.goto('/?3d=off#contact');
  await expect(page.getByLabel('Budget (optional)')).toBeHidden();
  await page.getByLabel("What's this about?").selectOption('freelance');
  await expect(page.getByLabel('Budget (optional)')).toBeVisible();
});

test('Start a project preselects Freelance project', async ({ page }) => {
  await page.goto('/?3d=off');
  // The Contact section's own button; Freelance has one with the same label that leaves for krudex.in
  await page.locator('#contact').getByRole('link', { name: 'Start a project' }).click();
  await expect(page.getByLabel("What's this about?")).toHaveValue('freelance');
});
