const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERROR:', msg.text());
    if (msg.type() === 'warning') console.log('WARN:', msg.text());
  });
  
  // Capture request errors
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 10000 });
  await page.screenshot({ path: 'screenshots/debug.png' });
  
  const content = await page.content();
  console.log('HTML length:', content.length);
  console.log('Has root div:', content.includes('root'));
  
  await browser.close();
})();
