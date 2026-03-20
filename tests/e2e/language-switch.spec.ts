import { test, expect } from "../fixtures";

/**
 * E2E Test: Language Switching
 * Tests the language selector functionality and verifies that UI text changes
 * when the user switches between languages.
 */

test.describe("Language Switching", () => {
  test.beforeEach(async ({ page }) => {
    // Use test mode query param to force language selection screen
    await page.goto("/?test=true");
  });

  test("should show language selection on first load", async ({ page }) => {
    // Should show the full language selector
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
    await expect(page.getByText("Select your preferred language")).toBeVisible();

    // Should show all three languages - use .first() to avoid strict mode violations
    await expect(page.getByText("🇬🇧")).toBeVisible();
    await expect(page.getByText("English").first()).toBeVisible();
    await expect(page.getByText("🇮🇳")).toBeVisible();
    await expect(page.getByText("हिंदी").first()).toBeVisible();
    await expect(page.getByText("ಕನ್ನಡ").first()).toBeVisible();
  });

  test("should allow selecting Kannada as language", async ({ page }) => {
    // Click on the Kannada card - use nth(0) to get the first match
    // The cards have role="option" and contain the native label
    const kannadaCard = page.getByRole("option", { name: /ಕನ್ನಡ/ }).first();
    await kannadaCard.click();

    // Should navigate to main app
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();

    // Check that Kannada text is displayed
    await expect(page.getByText("ಧ್ವನಿ ಸಹಾಯಕ")).toBeVisible();
    await expect(page.getByText("ಮಾತನಾಡಿ, ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ")).toBeVisible();
  });

  test("should allow selecting Hindi as language", async ({ page }) => {
    // Click on the Hindi card
    const hindiCard = page.getByRole("option", { name: /हिंदी/ }).first();
    await hindiCard.click();

    // Should navigate to main app
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();

    // Check that Hindi text is displayed
    await expect(page.getByText("वॉइस असिस्टेंट")).toBeVisible();
    await expect(page.getByText("बोलिए, मैं समझूंगा")).toBeVisible();
  });

  test("should allow selecting English as language", async ({ page }) => {
    // Click on the English card
    const englishCard = page.getByRole("option", { name: /English/ }).first();
    await englishCard.click();

    // Should navigate to main app
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();

    // Check that English text is displayed
    await expect(page.getByText("Speak naturally, I'll understand you")).toBeVisible();
    await expect(page.getByText("Tap to Speak")).toBeVisible();
  });

  test("should allow changing language from header", async ({ page }) => {
    // First select a language to get past the selection screen
    const englishCard = page.locator('[role="option"]').filter({ hasText: "English" });
    await englishCard.click();
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();

    // Click language selector in header (mobile menu button)
    const headerButton = page.locator("header button").first();

    await headerButton.click();

    // Select Hindi from dropdown (use a button/option with Hindi text)
    const hindiOption = page.locator('[role="option"]').filter({ hasText: "हिंदी" });
    await hindiOption.click();

    // Verify Hindi text is now displayed
    await expect(page.getByText("वॉइस असिस्टेंट")).toBeVisible();
    await expect(page.getByText("बोलिए, मैं समझूंगा")).toBeVisible();
  });

  test("should persist language selection on reload", async ({ page }) => {
    // Select Kannada (test starts fresh due to beforeEach)
    const kannadaCard = page.locator('[role="option"]').filter({ hasText: "ಕನ್ನಡ" });
    await kannadaCard.click();
    await expect(page.getByText("ಧ್ವನಿ ಸಹಾಯಕ")).toBeVisible();

    // Reload the page
    await page.reload();

    // Should still show Kannada (skips language selection)
    await expect(page.getByText("ಧ್ವನಿ ಸಹಾಯಕ")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome" })).not.toBeVisible();
  });

  test("should show correct language labels in selector", async ({ page }) => {
    // Check native labels are displayed - use .first() to avoid strict mode violations
    await expect(page.getByText("English").first()).toBeVisible();
    await expect(page.getByText("हिंदी").first()).toBeVisible();
    await expect(page.getByText("ಕನ್ನಡ").first()).toBeVisible();

    // Check that flag emojis are present
    await expect(page.locator("text=🇬🇧")).toBeVisible();
    await expect(page.locator("text=🇮🇳")).toBeVisible();
  });
});
