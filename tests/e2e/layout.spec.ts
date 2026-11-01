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
  await expect(page.locator('#hero dd').last()).toHaveText(/(^|\D)14\+ projects shipped/);
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
    localStorage.setItem('kr-theme', 'light');
  });
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('radio', { name: 'Auto' })).toHaveCount(2);
  for (const radio of await footer.getByRole('radio', { name: 'Auto' }).all()) await expect(radio).toBeChecked();
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(
    await page.evaluate(() => [
      localStorage.getItem('kr-3d'),
      localStorage.getItem('kr-motion'),
      localStorage.getItem('kr-theme'),
    ]),
  ).toEqual([null, null, null]);
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
  const main = page.locator('#work article:not(#more-projects article)');
  const card = main.filter({ hasText: 'MLRIT MUN 2025 website' });
  await expect(card.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/mdecoder24/mun-website');
  await expect(card.getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://mlritmun.vercel.app/');
  await expect(card.getByRole('link', { name: 'MLRIT MUN 2025 website', exact: true })).toHaveAttribute('href', '/projects/mun-website');
  await expect(page.locator('#work').getByText('Read the case study')).toHaveCount(0);
  // The main grid holds the featured four, TEDx last; the rest wait in the more-projects panel
  await expect(main).toHaveCount(4);
  await expect(main.nth(3)).toContainText('TEDx MLRIT website');
  await expect(main.nth(3).getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/mdecoder24/TEDx-MLRIT');
  await expect(main.nth(3).getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://tedxmlrit.vercel.app/');
  await expect(main.first()).toContainText('Sign language recognition');
  await expect(main.nth(1)).toContainText('MLRIT MUN 2025 website');
  const sensai = main.nth(2);
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
  await expect(page.locator('#freelance').getByText(/shipped 14\+ projects/)).toBeVisible();
  // The numbers sit on their own cards, each named for screen readers by its label
  await expect(page.locator('#freelance').getByRole('listitem')).toHaveCount(3);
  // New builds are sent to the studio's site, in a new tab
  const cta = page.locator('#freelance').getByRole('link', { name: /^Start a project/ });
  await expect(cta).toHaveAttribute('href', 'https://krudex.in/');
  await expect(cta).toHaveAttribute('target', '_blank');
  await expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.locator('#freelance').getByRole('listitem').nth(2)).toContainText('India, USA, UAE, Spain and UK');
});

test('certifications follow education, each linking to its certificate, and View more certifications opens the rest', async ({
  page,
}) => {
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
  const open = page.locator('#certifications').getByRole('button', { name: /^View more certifications/ });
  await expect(open).toContainText('10');
  await open.click();
  const panel = page.getByRole('dialog', { name: 'More certifications' });
  await expect(panel).toBeVisible();
  const moreLinks = panel.getByRole('link');
  await expect(moreLinks).toHaveCount(10);
  for (const link of await moreLinks.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/drive\.google\.com\/file\/d\//);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await panel.getByRole('button', { name: 'Close' }).click();
  await expect(panel).toBeHidden();
});

test('each project card opens a short README from View details, and Escape closes it', async ({ page }) => {
  await page.goto('/?3d=off#work');
  const cards = page.locator('#work article:not(#more-projects article)');
  await expect(cards.getByRole('button', { name: /^View details/ })).toHaveCount(4);
  const open = cards.getByRole('button', { name: /^View details.*MLRIT MUN 2025 website/ });
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
  await expect(volunteer.locator('li[data-role]')).toHaveCount(4);
  await expect(volunteer.locator('li[data-role]').first()).toContainText('GDG Hyderabad');
  // Each row carries the organisation's logo, or its initials when there is none
  const logos = section.locator('img[src*="logos"]');
  expect(await logos.count()).toBeGreaterThan(0);
  for (const img of await logos.all()) expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test('experience cards stack as a deck on scroll, and an opened card stops sticking so all of it can be read', async ({
  page,
}) => {
  await page.goto('/?3d=off#experience');
  const card = page.locator('#experience li[data-role]').nth(1);
  await expect(card).toHaveCSS('position', 'sticky');
  await card.locator('summary').click();
  await expect(card).toHaveCSS('position', 'relative');
});

test('View more projects opens a panel of the other projects, with the same links and README', async ({ page }) => {
  await page.goto('/?3d=off#work');
  await expect(page.locator('#work').getByText('Want to see more projects I’ve worked on?')).toBeVisible();
  const open = page.locator('#work').getByRole('button', { name: /^View more projects/ });
  await expect(open).toHaveText('View more projects');
  await expect(page.locator('#work').getByRole('list', { name: 'Also in the panel' })).toHaveCount(0);
  await open.click();
  const panel = page.getByRole('dialog', { name: 'More things I’ve built' });
  await expect(panel).toBeVisible();
  // Kemplast leads the panel; its code is the client's, so GitHub opens a note instead of a repository
  const kemplast = panel.locator('article').first();
  await expect(kemplast).toContainText('Kemplast Process Solutions website');
  await expect(kemplast.getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://www.kemplast.in/');
  await expect(kemplast.getByRole('link', { name: /^GitHub/ })).toHaveCount(0);
  await kemplast.getByRole('button', { name: /^GitHub/ }).click();
  const note = page.getByRole('dialog', { name: 'Private repository' });
  await expect(note).toContainText("I can't share the GitHub link");
  await page.keyboard.press('Escape');
  await expect(note).toBeHidden();
  await expect(panel).toBeVisible();
  await expect(panel.locator('article').nth(1)).toContainText('Billfold, GST invoice maker');
  const card = panel.locator('article').filter({ hasText: 'Billfold, GST invoice maker' });
  await expect(card.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', 'https://github.com/mdecoder24/BillFold');
  await expect(card.getByRole('link', { name: /^Live site/ })).toHaveAttribute('href', 'https://billifold.netlify.app/');
  // The README opens on top of the panel, and Escape closes only the README
  await card.getByRole('button', { name: /^View details/ }).click();
  await expect(page.getByRole('dialog', { name: 'Billfold, GST invoice maker' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Billfold, GST invoice maker' })).toBeHidden();
  await expect(panel).toBeVisible();
  await panel.getByRole('button', { name: 'Close' }).first().click();
  await expect(panel).toBeHidden();
});

test('the more-projects invitation traces its border on reveal, and stays still under reduced motion', async ({ page }) => {
  const beam = (el: Element) => getComputedStyle(el, '::before').animationName;
  const card = page.locator('#work .invite');
  await page.goto('/?3d=off#work');
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.evaluate(beam)).toBe('beam-trace');
  await expect(card.getByRole('button', { name: 'View more projects' })).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?3d=off#work');
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByRole('button', { name: 'View more projects' })).toBeVisible();
  expect(await card.evaluate(beam)).toBe('none');
});

test('scroll animations play again on every return, without flickering while off screen', async ({ page }) => {
  const beam = (el: Element) => getComputedStyle(el, '::before').animationName;
  const card = page.locator('#work .invite');
  const reveal = card.locator('xpath=ancestor-or-self::*[contains(concat(" ", @class, " "), " reveal ")][1]');
  const count = page.locator('#education ol > li .tabular').first();
  const away = () => page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

  await page.goto('/?3d=off');
  for (let visit = 0; visit < 2; visit++) {
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => card.evaluate(beam)).toBe('beam-trace');
    await count.scrollIntoViewIfNeeded();
    await expect(count).toContainText('7.64');

    await away();
    await expect(reveal).not.toHaveAttribute('data-shown');
    await expect.poll(() => card.evaluate(beam)).toBe('none');
    await expect(count).not.toContainText('7.64');
  }

  // Coming back up, a ticket must print as soon as any of it is in view, not only once its clipped top edge is
  const slot = page.locator('#freelance .ticket-slot').first();
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(slot).not.toHaveAttribute('data-shown');
  await slot.evaluate((el) => window.scrollBy({ top: el.getBoundingClientRect().top + 40, behavior: 'instant' }));
  await expect(slot).toHaveAttribute('data-shown');

  // A hidden card sits lower than a shown one, so resetting at the viewport edge would loop between the two states
  await card.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveAttribute('data-shown');
  const changes = await reveal.evaluate(async (el) => {
    let seen = 0;
    const log = new MutationObserver((records) => (seen += records.length));
    log.observe(el, { attributes: true, attributeFilter: ['data-shown'] });
    // Just past the top of the viewport, where the 16px hidden offset could carry it back into view
    window.scrollBy({ top: el.getBoundingClientRect().bottom + 8, behavior: 'instant' });
    await new Promise((done) => setTimeout(done, 800));
    log.disconnect();
    return seen;
  });
  expect(changes).toBe(0);
});

test('project cards trace their border on each reveal, circle it on focus, and stay still under reduced motion', async ({ page }) => {
  const beam = (el: Element) => getComputedStyle(el, '::before').animationName;
  const card = page.locator('#work .project-card').first();
  await page.goto('/?3d=off');
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.evaluate(beam)).toBe('beam-trace');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => card.evaluate(beam)).toBe('none');
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.evaluate(beam)).toBe('beam-trace');
  await card.getByRole('link').first().focus();
  await page.keyboard.press('Tab');
  await expect.poll(() => card.evaluate(beam)).toBe('project-orbit');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?3d=off');
  await card.scrollIntoViewIfNeeded();
  expect(await card.evaluate(beam)).toBe('none');
});

test('education reads as a path, newest first, with each score written out beside its ring', async ({ page }) => {
  await page.goto('/?3d=off#education');
  const stages = page.locator('#education ol > li');
  await expect(stages).toHaveCount(3);
  await expect(stages.locator('h3')).toHaveText(['B.Tech, Computer Science (AI & ML)', 'High school, PCM', 'Secondary school, CBSE']);
  await expect(stages.nth(0)).toContainText('7.64');
  await expect(stages.nth(0)).toContainText('CGPA');
  await expect(stages.nth(1)).toContainText('87.5%');
  await expect(stages.nth(2)).toContainText('74.5%');
});
