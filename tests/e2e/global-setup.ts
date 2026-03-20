import { FullConfig } from "@playwright/test";

/**
 * Global setup for Playwright tests
 * Runs once before all tests to ensure a clean testing environment
 */
async function globalSetup(config: FullConfig) {
  // No action needed here - we handle cleanup in beforeEach hooks
  // This file exists as a placeholder if we need global setup later
}

export default globalSetup;
