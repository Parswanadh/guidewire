import { test, expect } from '@playwright/test';

test.describe('ShieldRide App', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test
    await page.goto('http://localhost:3000/');
  });

  test('should display language selection screen', async ({ page }) => {
    // Should redirect to language selection
    await expect(page).toHaveURL(/.*language/);
    
    // Should show language options - use more specific selectors
    await expect(page.locator('h2:has-text("Select your language")')).toBeVisible();
    await expect(page.locator('h3:has-text("English")')).toBeVisible();
    await expect(page.locator('h3:has-text("हिन्दी")')).toBeVisible();
    await expect(page.locator('h3:has-text("ಕನ್ನಡ")')).toBeVisible();
  });

  test('should complete signup flow', async ({ page }) => {
    // 1. Language Selection
    await page.click('h3:has-text("English")');
    
    // 2. Signup - Mobile Step
    await page.waitForURL(/.*signup/);
    await page.fill('input[type="tel"]', '9876543210');
    await page.click('button:has-text("Send OTP")');
    
    // 3. Signup - OTP Step
    await page.fill('input[placeholder="123456"]', '123456');
    await page.click('button:has-text("Verify OTP")');
    
    // 4. Signup - Store Step
    await expect(page.locator('text=Assigned Dark Store')).toBeVisible();
    await page.click('button:has-text("Confirm")');
    
    // 5. Signup - Coverage Step
    await expect(page.locator('text=Choose Your Protection')).toBeVisible();
    await page.click('h3:has-text("Standard")');
    await page.click('button:has-text("Select Plan")');
    
    // 6. Redirect to Home
    await page.waitForURL(/.*home/);
    await expect(page.locator('text=Ravi Kumar')).toBeVisible();
  });

  test('should switch between worker and insurer dashboards', async ({ page }) => {
    // Quick login to bypass flow if possible, or just do the flow
    await page.click('h3:has-text("English")');
    await page.fill('input[type="tel"]', '9876543210');
    await page.click('button:has-text("Send OTP")');
    await page.fill('input[placeholder="123456"]', '123456');
    await page.click('button:has-text("Verify OTP")');
    await page.click('button:has-text("Confirm")');
    await page.click('button:has-text("Select Plan")');
    
    // Worker Dashboard
    await expect(page.locator('text=Ravi Kumar')).toBeVisible();
    await expect(page.locator('text=Your Shield')).toBeVisible();
    
    // Switch to Insurer
    await page.click('button:has-text("Switch to Insurer")');
    await expect(page.locator('text=Insurer Intelligence')).toBeVisible();
    await expect(page.locator('text=Loss Ratio')).toBeVisible();
    
    // Switch back to Worker
    await page.click('button:has-text("Switch to Worker")');
    await expect(page.locator('text=Ravi Kumar')).toBeVisible();
  });
});
