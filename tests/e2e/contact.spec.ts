import { expect, test } from './fixtures';

test('contact offers email and the studio, with no message form', async ({ page }) => {
  await page.goto('/?3d=off#contact');
  const contact = page.locator('#contact');
  await expect(contact.locator('form')).toHaveCount(0);
  await expect(contact.getByText('Or leave a message here')).toHaveCount(0);
  await expect(contact.getByRole('link', { name: 'Send an email' })).toHaveAttribute('href', /^mailto:/);
  await expect(contact.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', 'https://krudex.in/');
  const elsewhere = contact.locator('dd').last();
  await expect(elsewhere.getByRole('link')).toHaveText(['LinkedIn', 'GitHub', 'LeetCode', 'Email']);
  await expect(elsewhere.getByRole('link', { name: 'LeetCode' })).toHaveAttribute('href', 'https://leetcode.com/u/Rudra0/');
  await expect(elsewhere.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:kushwant.work@gmail.com');
});
