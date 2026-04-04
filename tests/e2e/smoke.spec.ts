import { expect, test } from './fixtures';

test.describe('ShieldRide Minimal UI Smoke', () => {
  test('language selection routes to rider login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*language/);

    await page.getByText('English', { exact: true }).first().click();
    await expect(page).toHaveURL(/.*login/);

    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in as Insurer' })).toBeVisible();
  });

  test('insurer login reaches home without 413 responses', async ({ page }) => {
    const payloadTooLargeHits: string[] = [];

    page.on('response', (response) => {
      if (response.status() === 413) {
        payloadTooLargeHits.push(response.url());
      }
    });

    await page.goto('/insurer-login');
    await page.locator('input[type="email"]').fill('insurer@shieldride.ai');
    await page.locator('input[type="password"]').fill('Insurer@123');
    await page.getByRole('button', { name: 'Sign In as Insurer' }).click();

    await expect(page).toHaveURL(/.*home/);
    await expect(page.getByText('Insurer Intelligence', { exact: true })).toBeVisible();
    expect(payloadTooLargeHits).toHaveLength(0);
  });
});
