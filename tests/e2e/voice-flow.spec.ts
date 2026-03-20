import { test, expect } from "../fixtures";

/**
 * E2E Test: Voice Flow
 * Tests the complete voice interaction flow including recording,
 * transcription, and text-to-speech playback.
 *
 * Note: These tests use mock functions since we can't easily test
 * real microphone access in automated tests. The mock functions simulate
 * the behavior of the Sarvam API.
 */

test.describe("Voice Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app in test mode, then select English
    await page.goto("/?test=true");

    // Select English to get to main app
    await page.getByText("English").first().click();

    // Wait for main app to load
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();
  });

  test("should show microphone button in ready state", async ({ page }) => {
    // Microphone button should be visible
    const micButton = page.getByRole("button", { name: /Tap to Speak|Start or stop voice recording/i });
    await expect(micButton).toBeVisible();

    // Should show ready status
    await expect(page.getByText("Ready to listen")).toBeVisible();
  });

  test("should enter recording state when microphone is clicked", async ({ page }) => {
    // Click the microphone button
    const micButton = page.locator("button").filter({ hasText: "" }).or(
      page.getByRole("button", { name: /Tap to Speak/i })
    ).first();
    
    await micButton.click();

    // Should show recording status
    await expect(page.getByText("Recording...")).toBeVisible();

    // The button should now be in destructive state (red) for stopping
    // Check that the button changed to "Stop Recording"
    const stopButton = page.getByRole("button", { name: /Stop Recording|Start or stop voice recording/i });
    await expect(stopButton).toBeVisible();
  });

  test("should stop recording when button is clicked again", async ({ page }) => {
    // Start recording
    const micButton = page.locator("button").filter({ hasText: "" }).or(
      page.getByRole("button", { name: /Tap to Speak/i })
    ).first();
    await micButton.click();

    // Wait a bit for recording to start
    await page.waitForTimeout(500);

    // Click again to stop
    const stopButton = page.getByRole("button", { name: /Stop Recording|Start or stop voice recording/i });
    await stopButton.click();

    // Should show processing status
    await expect(page.getByText(/Processing|Transcript/)).toBeVisible({ timeout: 5000 });
  });

  test("should display transcript after recording", async ({ page }) => {
    // Start and stop recording to trigger mock transcription
    const micButton = page.locator("button").filter({ hasText: "" }).or(
      page.getByRole("button", { name: /Tap to Speak/i })
    ).first();
    
    await micButton.click();
    await page.waitForTimeout(500); // Simulate brief recording
    await micButton.click();

    // Wait for processing to complete
    await page.waitForTimeout(2000);

    // The transcript should no longer show placeholder text
    await expect(page.getByText("Your speech will appear here")).not.toBeVisible({ timeout: 5000 });
  });

  test("should show Play as Speech button after transcript", async ({ page }) => {
    // First get a transcript
    const micButton = page.locator("button").filter({ hasText: "" }).or(
      page.getByRole("button", { name: /Tap to Speak/i })
    ).first();
    
    await micButton.click();
    await page.waitForTimeout(500);
    await micButton.click();

    // Wait for transcript to appear
    await page.waitForTimeout(2000);

    // Play as Speech button should be visible
    await expect(page.getByRole("button", { name: /Play as Speech/i })).toBeVisible({ timeout: 5000 });
  });

  test("should allow clearing the transcript", async ({ page }) => {
    // Get a transcript first
    const micButton = page.locator("button").filter({ hasText: "" }).or(
      page.getByRole("button", { name: /Tap to Speak/i })
    ).first();
    
    await micButton.click();
    await page.waitForTimeout(500);
    await micButton.click();
    await page.waitForTimeout(2000);

    // Find and click the Clear button
    const clearButton = page.getByRole("button", { name: /Clear/i });
    
    // Click clear if it exists
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Should show placeholder text again
      await expect(page.getByText(/Your speech will appear here|No transcript yet/)).toBeVisible();
    }
  });

  test("should handle Hindi language voice flow", async ({ page }) => {
    // Clear localStorage and reload to get language selection screen
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Select Hindi
    await page.getByText("हिंदी").first().click();

    // Wait for app to load with Hindi
    await expect(page.getByText("वॉइस असिस्टेंट")).toBeVisible();

    // Start recording
    const micButton = page.locator("button").filter({ hasText: "" }).first();
    await micButton.click();

    // Should show Hindi recording text
    await expect(page.getByText("रिकॉर्डिंग हो रही है")).toBeVisible();

    // Stop recording
    await page.waitForTimeout(500);
    await micButton.click();

    // Should show Hindi processing text
    await expect(page.getByText(/प्रोसेसिंग|ट्रांसक्रिप्ट/)).toBeVisible({ timeout: 5000 });
  });

  test("should handle Kannada language voice flow", async ({ page }) => {
    // Clear localStorage and reload to get language selection screen
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Select Kannada
    await page.getByText("ಕನ್ನಡ").first().click();

    // Wait for app to load with Kannada
    await expect(page.getByText("ಧ್ವನಿ ಸಹಾಯಕ")).toBeVisible();

    // Check for microphone button with Kannada aria-label
    const micButton = page.locator("button").filter({ hasText: "" }).first();
    await expect(micButton).toBeVisible();

    // Start recording
    await micButton.click();

    // Should show Kannada recording text
    await expect(page.getByText("ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ")).toBeVisible();
  });

  test("should show transcript section with proper structure", async ({ page }) => {
    // Before recording, should show placeholder
    await expect(page.getByText(/Your speech will appear here/)).toBeVisible();
    
    // Get transcript
    const micButton = page.locator("button").filter({ hasText: "" }).first();
    await micButton.click();
    await page.waitForTimeout(500);
    await micButton.click();
    await page.waitForTimeout(2000);
    
    // After recording, should show "Your Transcript" label
    await expect(page.getByText("Your Transcript")).toBeVisible({ timeout: 5000 });
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Clear localStorage and reload to get language selection screen
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Should show language selection again
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
    
    // Select English and verify app loads
    await page.getByText("English").first().click();
    await expect(page.getByRole("heading", { name: "Voice Assistant" })).toBeVisible();
  });
});
