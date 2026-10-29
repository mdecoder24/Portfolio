import { expect, test } from '@playwright/test';

test('no horizontal scroll, and the hero headline is visible in the first viewport', async ({ page }) => {
  await page.goto('/?3d=off');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Résumé' }).first()).toBeVisible();
});

test('the hero leads with the name, role and key facts', async ({ page }) => {
  await page.goto('/?3d=off');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveAccessibleName(/^Kushwant Kumar Reddy\s*,\s*Full-stack & AI engineer$/);
  const hero = page.locator('#hero');
  await expect(hero.getByRole('term')).toHaveText(['Based in', 'Degree', 'Day job', 'Freelance']);
});

test('on wide screens the hero uses a split layout with the name on the left and a large portrait on the right', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the hero stacks on phones');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?3d=off');
  // The words rise in one after another; measure their resting places, not a frame mid-rise
  await page
    .locator('#hero-title')
    .evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((anim) => anim.finished)));
  const words = page.locator('#hero-title .w');
  const [a, b] = await Promise.all([words.first().boundingBox(), words.last().boundingBox()]);
  const frame = await page.locator('#hero-portrait').boundingBox();
  if (!a || !b || !frame) throw new Error('hero lockup not rendered');
  // One line: both halves share a baseline row on the left side
  expect(Math.abs(a.y - b.y)).toBeLessThan(4);
  // The large portrait sits to the right of the heading without overlapping it
  expect(frame.width).toBeGreaterThan(340);
  expect(frame.x).toBeGreaterThan(b.x + b.width);
});

test('section numbers run in reading order', async ({ page }) => {
  await page.goto('/?3d=off');
  const numbers = await page
    .locator('main section[id]:not(#hero)')
    .evaluateAll((sections) => sections.map((s) => s.querySelector('.type-code > .text-ink')?.textContent));
  expect(numbers).toEqual(['01', '02', '03', '04', '05', '06', '07']);
});

test('case-study pages render with previous and next links', async ({ page }) => {
  await page.goto('/projects/pulse?3d=off');
  await expect(page.getByRole('heading', { level: 1, name: 'Pulse' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'More case studies' }).getByRole('link')).toHaveCount(2);
});

test('the nav underline slides to the section in view, and counts land on their real value', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 900, 'the inline nav links show from 900 px');
  await page.goto('/?3d=off');
  await page.locator('#work').scrollIntoViewIfNeeded();
  const current = page.locator('nav a[aria-current="location"]');
  await expect(current).toHaveText('Work');
  const marker = page.locator('nav ul > span[aria-hidden="true"]');
  await expect(marker).toHaveCSS('opacity', '1');
  await expect
    .poll(async () => {
      const [m, l] = await Promise.all([marker.boundingBox(), current.boundingBox()]);
      return m && l ? Math.round(Math.abs(m.x - l.x) + Math.abs(m.width - l.width)) : -1;
    })
    .toBeLessThanOrEqual(1);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator('#hero dd').last()).toHaveText(/14\+ projects shipped/);
});
