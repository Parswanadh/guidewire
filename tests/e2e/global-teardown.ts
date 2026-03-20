import { FullConfig } from "@playwright/test";

/**
 * Global teardown for Playwright tests
 * Runs once after all tests complete
 */
async function globalTeardown(config: FullConfig) {
  // No action needed here - this file exists as a placeholder
  // if we need global teardown later
}

export default globalTeardown;
