import { expect, test } from './fixtures';

test('the nav résumé link opens the preview, which offers the PDF as a download', async ({ page }) => {
  await page.goto('/privacy?3d=off');
  await page.getByRole('link', { name: 'Résumé' }).first().click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Résumé' })).toBeVisible();

  const preview = page.getByRole('img', { name: /Preview of Kushwant/ });
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'Download résumé' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('Kushwant-KR-Resume.pdf');
});
