import { test as base, Page } from "@playwright/test";

// Define the test fixtures type
type TestFixtures = {
  page: Page;
  // Auto-cleared page: clears storage before navigating
  autoClearedPage: Page;
};

// Extend base test with custom fixtures for localStorage management
export const test = base.extend<TestFixtures>({
  // Override the default page fixture to add initScript for clearing storage
  // This runs before each page navigation
  page: async ({ page }, use) => {
    // Add initScript to clear localStorage before page scripts run
    // This is injected before any page JavaScript executes
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await use(page);
  },

  // A dedicated fixture that ensures fresh storage before navigation
  autoClearedPage: async ({ browser }, use) => {
    // Create a new browser context with NO storage state
    const context = await browser.newContext({
      storageState: undefined,
    });

    // Clear any cookies in the context
    await context.clearCookies();

    // Create a new page from this clean context
    const page = await context.newPage();

    await use(page);

    // Clean up
    await context.close();
  },
});

export { expect } from "@playwright/test";
