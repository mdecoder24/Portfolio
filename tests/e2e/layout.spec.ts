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
  await expect(hero.getByRole('term')).toHaveText(['Based in', 'Degree', 'Working as', 'Freelance']);
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
    .evaluateAll((sections) => sections.map((s) => s.querySelector('[data-section-number]')?.textContent?.trim()));
  expect(numbers).toEqual(['01', '02', '03', '04', '05', '06', '07']);
});

test('case-study pages render with previous and next links', async ({ page }) => {
  await page.goto('/projects/mun-website?3d=off');
  await expect(page.getByRole('heading', { level: 1, name: 'MLRIT MUN 2025 website' })).toBeVisible();
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
  await expect(page.locator('#hero dd').last()).toHaveText(/(^|\D)4\+ projects shipped/);
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

test('choices saved under the retired keys are cleared, so the footer starts at Motion Auto and 3D Auto', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('kr-3d', 'off');
    localStorage.setItem('kr-motion', 'reduced');
  });
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('radio', { name: 'Auto' })).toHaveCount(2);
  for (const radio of await footer.getByRole('radio', { name: 'Auto' }).all()) await expect(radio).toBeChecked();
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'reduced');
  expect(await page.evaluate(() => [localStorage.getItem('kr-3d'), localStorage.getItem('kr-motion')])).toEqual([null, null]);
});

test('the hero links to GitHub, LinkedIn, LeetCode and email, each named for screen readers', async ({ page }) => {
  await page.goto('/?3d=off');
  const socials = page.locator('#hero').getByRole('list', { name: 'Social links' });
  await expect(socials.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/mdecoder24');
  await expect(socials.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', /linkedin\.com\/in\/kushwant-kr/);
  await expect(socials.getByRole('link', { name: 'LeetCode' })).toHaveAttribute('href', 'https://leetcode.com/u/Rudra0/');
  await expect(socials.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:kushwant.work@gmail.com');
  await expect(socials).toBeInViewport();
});

test('every role in experience starts closed, and a current role reads Current in place of present', async ({ page }) => {
  await page.goto('/?3d=off#experience');
  const roles = page.locator('#experience details');
  await expect(roles.first()).toBeVisible();
  for (const role of await roles.all()) await expect(role).not.toHaveAttribute('open');
  const summaries = page.locator('#experience summary');
  await expect(summaries.filter({ hasText: /– Current/ }).first()).toBeVisible();
  await expect(summaries.filter({ hasText: /present/ })).toHaveCount(0);
});

test('project cards link out to GitHub and the live site, and their titles open the case study', async ({ page }) => {
  await page.goto('/?3d=off#work');
  const card = page.locator('#work article').filter({ hasText: 'TEDx MLRIT website' });
  await expect(card.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/mdecoder24/TEDx-MLRIT');
  await expect(card.getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://tedxmlrit.vercel.app/');
  await expect(card.getByRole('link', { name: 'TEDx MLRIT website', exact: true })).toHaveAttribute('href', '/projects/tedx-mlrit');
  await expect(page.locator('#work').getByText('Read the case study')).toHaveCount(0);
  // The MUN site leads the list
  await expect(page.locator('#work article').first()).toContainText('MLRIT MUN 2025 website');
  await expect(page.locator('#work article')).toHaveCount(4);
  const sensai = page.locator('#work article').nth(3);
  await expect(sensai).toContainText('SENSAI, AI career coach');
  await expect(sensai.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/mdeocder24/sensai');
  await expect(sensai.getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://ai-career-coach-mu.vercel.app/');
});

test('a freelance section sits between the projects and education, and the nav links to it', async ({ page }) => {
  await page.goto('/?3d=off');
  const ids = await page.locator('main section[id]').evaluateAll((sections) => sections.map((s) => s.id));
  expect(ids.indexOf('freelance')).toBe(ids.indexOf('work') + 1);
  expect(ids.indexOf('education')).toBe(ids.indexOf('freelance') + 1);
  await expect(page.getByRole('heading', { level: 2, name: 'Freelance and client work' })).toBeAttached();
  await expect(page.locator('footer').getByRole('link', { name: 'Freelance' })).toHaveAttribute('href', /#freelance$/);
  // Only the bio shows, on its card; no client list
  await expect(page.locator('#freelance').getByRole('list', { name: 'Client work' })).toHaveCount(0);
  await expect(page.locator('#freelance').getByText(/4\+ freelance projects/)).toBeVisible();
});

test('certifications follow education, each linking to its certificate', async ({ page }) => {
  await page.goto('/?3d=off');
  const ids = await page.locator('main section[id]').evaluateAll((sections) => sections.map((s) => s.id));
  expect(ids.indexOf('certifications')).toBe(ids.indexOf('education') + 1);
  const links = page.locator('#certifications').getByRole('link');
  await expect(links).toHaveCount(4);
  await expect(links.first()).toHaveAccessibleName(/AWS Cloud Solutions Architect/);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/drive\.google\.com\/file\/d\//);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('each project card opens a short README from View details, and Escape closes it', async ({ page }) => {
  await page.goto('/?3d=off#work');
  const cards = page.locator('#work article');
  await expect(cards.getByRole('button', { name: /^View details/ })).toHaveCount(4);
  const open = cards.first().getByRole('button', { name: /^View details.*MLRIT MUN 2025 website/ });
  await open.click();
  const panel = page.getByRole('dialog', { name: 'MLRIT MUN 2025 website' });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Features' })).toBeVisible();
  await expect(panel.locator('pre')).toContainText('npm run dev');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await open.click();
  await panel.getByRole('button', { name: 'Close' }).click();
  await expect(panel).toBeHidden();
});

test('experience splits into professional and volunteer roles', async ({ page }) => {
  await page.goto('/?3d=off#experience');
  const section = page.locator('#experience');
  await expect(section.getByRole('heading', { level: 3 })).toHaveText([/^Professional experience/, /^Volunteer experience/]);
  const volunteer = section.locator('div:has(> h3:text-matches("^Volunteer experience"))');
  await expect(volunteer.locator('> ul > li')).toHaveCount(4);
  await expect(volunteer.locator('> ul > li').first()).toContainText('GDG Hyderabad');
  // Each row carries the organisation's logo, or its initials when there is none
  const logos = section.locator('img[src*="logos"]');
  expect(await logos.count()).toBeGreaterThan(0);
  for (const img of await logos.all()) expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});
