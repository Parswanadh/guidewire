import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
