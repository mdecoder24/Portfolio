import { test as base, expect } from '@playwright/test';

/**
 * Every spec starts with the home intro already seen this session, so the greeting never sits over the page while
 * a test clicks; intro.spec.ts uses the plain Playwright test to cover the intro itself.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => sessionStorage.setItem('kr-e2e-skip-intro', '1'));
    await provide(page);
  },
});

export { expect };
