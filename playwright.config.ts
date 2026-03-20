import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // Run tests serially to avoid localStorage conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid state sharing
  reporter: "html",

  // Global setup to ensure clean state for all tests
  globalSetup: "./tests/e2e/global-setup.ts",

  // Global teardown to clean up after all tests
  globalTeardown: "./tests/e2e/global-teardown.ts",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Clear all storage state before each test
    // This ensures each test starts with a completely fresh browser context
    contextOptions: {
      // Don't load any existing storage state
      storageState: undefined,
      // Set strict test isolation mode
      strictSelectors: false,
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  // Start dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
