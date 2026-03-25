const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  // Using a single context to keep auth if needed, but for preview we can go direct
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  try {
    console.log('Starting capture...');
    
    // 1. Login Screen
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/preview-01-login.png' });
    console.log('Captured login screen');

    // 2. Signup Screen (Mobile step)
    await page.goto('http://localhost:5173/signup');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/preview-02-signup.png' });
    console.log('Captured signup screen');

    // To see the Home Screen we need to bypass Auth or use the mock login
    // Let's try the login flow again but with more waiting
    await page.fill('input[type="tel"]', '9876543210');
    await page.click('button:has-text("Send OTP")');
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder="123456"]', '123456');
    await page.click('button:has-text("Verify OTP")');
    await page.waitForTimeout(1000);
    
    // Confirm Store
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    
    // Policy Simulator
    await page.screenshot({ path: 'screenshots/preview-03-policy.png' });
    console.log('Captured policy simulator');
    
    // Select Plan
    await page.click('button:has-text("I Understand")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Select Plan")');
    await page.waitForTimeout(2000);
    
    // Worker Home
    await page.screenshot({ path: 'screenshots/preview-04-worker.png' });
    console.log('Captured worker dashboard');

    // Switch to Insurer
    await page.click('button:has-text("Switch to Insurer")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/preview-05-insurer.png' });
    console.log('Captured insurer dashboard');

    // Insurer Analytics
    await page.click('button:has-text("Analytics")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/preview-06-analytics.png' });
    console.log('Captured insurer analytics');

  } catch (err) {
    console.error('Error during capture:', err);
    // Take an error screenshot
    await page.screenshot({ path: 'screenshots/error-capture.png' });
  } finally {
    await browser.close();
  }
}

capture();
