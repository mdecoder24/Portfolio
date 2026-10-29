import { expect, test } from './fixtures';

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

test('the hero centres a large portrait with the name and role in front of its lower half', async ({ page }) => {
  await page.goto('/?3d=off');
  // The words rise in one after another; measure their resting places, not a frame mid-rise
  await page
    .locator('#hero-title')
    .evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((anim) => anim.finished)));
  const width = page.viewportSize()?.width ?? 0;
  const [frame, title] = await Promise.all([
    page.locator('#hero-portrait').boundingBox(),
    page.locator('#hero-title').boundingBox(),
  ]);
  if (!frame || !title) throw new Error('hero lockup not rendered');
  // Portrait and heading share the page's centre line
  expect(Math.abs(frame.x + frame.width / 2 - width / 2)).toBeLessThan(2);
  expect(Math.abs(title.x + title.width / 2 - width / 2)).toBeLessThan(2);
  // The heading overlaps the portrait's lower half, and the portrait fills most of a phone's width
  expect(title.y).toBeGreaterThan(frame.y + frame.height / 2);
  expect(title.y).toBeLessThan(frame.y + frame.height);
  expect(frame.width).toBeGreaterThan(Math.min(width * 0.8, 280));
  // The name stays on one line
  const words = page.locator('#hero-title .w');
  const [a, b] = await Promise.all([words.first().boundingBox(), words.last().boundingBox()]);
  expect(a && b && Math.abs(a.y - b.y) < 4).toBe(true);
});

test('on wide screens the actions flank the name, with no captions', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, 'phones stack the actions under the name');
  await page.goto('/?3d=off');
  const hero = page.locator('#hero');
  const [work, touch, title] = await Promise.all([
    hero.getByRole('link', { name: 'View my work' }).boundingBox(),
    hero.getByRole('link', { name: 'Get in touch' }).boundingBox(),
    page.locator('#hero-title').boundingBox(),
  ]);
  if (!work || !touch || !title) throw new Error('hero actions not rendered');
  expect(work.x + work.width).toBeLessThan(title.x);
  expect(touch.x).toBeGreaterThan(title.x + title.width);
  await expect(hero.getByText(/\d{1,2}:\d{2} [AP]M in Hyderabad/)).toHaveCount(0);
  await expect(hero.getByText('Available for work')).toHaveCount(0);
});

test('section numbers run in reading order', async ({ page }) => {
  await page.goto('/?3d=off');
  const numbers = await page
    .locator('main section[id]:not(#hero)')
    .evaluateAll((sections) => sections.map((s) => s.querySelector('.type-code > .text-ink')?.textContent));
  expect(numbers).toEqual(['01', '02', '03', '04', '05']);
});

test('case-study pages render with previous and next links', async ({ page }) => {
  await page.goto('/projects/sensai?3d=off');
  await expect(page.getByRole('heading', { level: 1, name: 'SENSAI, AI career coach' })).toBeVisible();
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

test('the pixel robot patrols the fact strip, and stands still under reduced motion', async ({ page }) => {
  await page.goto('/?3d=off');
  const track = page.locator('#hero .patrol');
  await expect(track).toHaveAttribute('aria-hidden', 'true');
  const bot = track.locator('.patrol-run');
  const x = async () => (await bot.boundingBox())?.x ?? 0;
  const first = await x();
  await expect.poll(async () => Math.abs((await x()) - first), { timeout: 5000 }).toBeGreaterThan(10);
  const t = await track.boundingBox();
  const b = await bot.boundingBox();
  expect(t && b && b.x >= t.x - 1 && b.x + b.width <= t.x + t.width + 1).toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const still = await x();
  await page.waitForTimeout(1000);
  expect(await x()).toBeCloseTo(still, 0);
});

test('the nav links to Education, and marks it current once scrolled there', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 900, 'the inline nav links show from 900 px');
  await page.goto('/?3d=off');
  const link = page.getByRole('navigation').first().getByRole('link', { name: 'Education' });
  await expect(link).toHaveAttribute('href', /#education$/);
  await page.locator('#education').scrollIntoViewIfNeeded();
  await expect(link).toHaveAttribute('aria-current', 'location');
});
