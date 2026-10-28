import { expect, test } from '@playwright/test';

test('no horizontal scroll, and the hero headline is visible in the first viewport', async ({ page }) => {
  await page.goto('/?3d=off');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeVisible();
});

test('the hero leads with the name, role, availability and key facts', async ({ page }) => {
  await page.goto('/?3d=off');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveAccessibleName(/^Kushwant KR\s*,\s*Full-stack & AI engineer$/);
  const hero = page.locator('#hero');
  await expect(hero.getByText(/^Freelance: /)).toBeInViewport();
  await expect(hero.getByRole('term')).toHaveText(['Based in', 'Degree', 'Day job', 'Freelance']);
});

test('on wide screens the name and portrait centre as one group', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the name wraps under the portrait on phones');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?3d=off');
  const { left, right, width } = await page.locator('#hero-title > span').first().evaluate((row) => {
    const parts = [...row.children].filter((c) => !c.classList.contains('sr-only')).map((c) => c.getBoundingClientRect());
    return { left: Math.min(...parts.map((r) => r.left)), right: Math.max(...parts.map((r) => r.right)), width: innerWidth };
  });
  expect(Math.abs(left - (width - right))).toBeLessThan(4);
});

test('section numbers run in reading order', async ({ page }) => {
  await page.goto('/?3d=off');
  const numbers = await page.locator('main section[id]:not(#hero)').evaluateAll((sections) =>
    sections.map((s) => s.querySelector('.type-code > .text-ink')?.textContent),
  );
  expect(numbers).toEqual(['01', '02', '03', '04', '05', '06']);
});

test('case-study pages render with previous and next links', async ({ page }) => {
  await page.goto('/projects/pulse?3d=off');
  await expect(page.getByRole('heading', { level: 1, name: 'Pulse' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'More case studies' }).getByRole('link')).toHaveCount(2);
});
