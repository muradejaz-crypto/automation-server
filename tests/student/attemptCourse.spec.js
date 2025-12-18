// attemptCourse.spec.js - Test for attempting a course on production
const { test, expect } = require('@playwright/test');

// Import Page Object Model classes
const LoginPage = require('../../pages/LoginPage');

test.describe('Attempt Course Flow (Production)', () => {
  test('Login and attempt course', async ({ page }) => {
    // Increase test timeout for course attempt flow
    test.setTimeout(120000); // 2 minutes

    // Initialize Page Object Models
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to production login page
    console.log('Step 1: Navigating to production login page...');
    await page.goto('https://fastlearner.ai/auth/sign-in');
    await page.waitForLoadState('networkidle');
    console.log('✓ Production login page loaded');

    // Step 2: Login with provided credentials
    console.log('Step 2: Logging in...');
    // Override the base URL for production
    const email = 'muradejaz@vinncorp.com';
    const password = 'Qwerty@123';

    // Fill email field
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(email);

    // Fill password field
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);

    // Submit form
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 15000 }),
      passwordInput.press('Enter')
    ]);
    console.log('✓ Login completed');

    // Step 3: Wait for redirect to dashboard
    console.log('Step 3: Waiting for redirect to dashboard...');
    await page.waitForLoadState('networkidle');
    console.log('✓ Redirected to dashboard');

    // Step 4: Navigate directly to course content page (will resolve/redirect if needed)
    console.log('Step 4: Navigating to course content page...');
    const courseContentUrl = 'https://fastlearner.ai/student/course-content/updated-2025-pspo-1-500plus-exam-questions-and-answers';
    
    // Navigate and wait for the URL to resolve/redirect
    await page.goto(courseContentUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for URL to match (handles redirects)
    await page.waitForURL(courseContentUrl, { timeout: 60000 }).catch(() => {
      console.log('⚠ URL did not fully resolve to course content within timeout; continuing with current page.');
    });
    await expect(page.url()).toContain('/student/course-content/');
    
    // Additional wait to ensure page is mostly settled
    try {
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    } catch {
      console.log('⚠ networkidle not reached, continuing...');
    }
    
    console.log('✓ Navigated to course content page and URL resolved');

    // Step 5: Click on Start Quiz button
    console.log('Step 5: Clicking on Start Quiz button...');
    const startQuizButton = page
      .locator("//button[@class = 'ant-btn start-quiz-btn ant-btn-primary']")
      .or(page.locator("//button[contains(., 'Start Quiz')]"))
      .first();
    await startQuizButton.waitFor({ state: 'attached', timeout: 30000 });
    await startQuizButton.waitFor({ state: 'visible', timeout: 30000 });
    await startQuizButton.scrollIntoViewIfNeeded();
    await expect(startQuizButton).toBeEnabled({ timeout: 10000 });

    // Retry click a few times in case of transient overlays
    let clicked = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await page.waitForTimeout(500);
        await startQuizButton.click({ timeout: 5000 });
        clicked = true;
        console.log(`✓ Clicked on Start Quiz button (attempt ${attempt})`);
        break;
      } catch (err) {
        console.log(`⚠ Start Quiz click attempt ${attempt} failed, retrying...`);
      }
    }

    if (!clicked) {
      throw new Error('Could not click Start Quiz button after multiple attempts');
    }

    // Step 6: Select option A and click Continue/Next
    console.log('Step 6: Selecting option A and clicking Continue...');
    const optionA = page
      .locator("//p[@class = 'question-text']//strong[text() = 'A.']")
      .or(page.locator("//p[contains(@class,'question-text')]//strong[contains(., 'A')]"))
      .first();
    await optionA.waitFor({ state: 'visible', timeout: 20000 });
    await optionA.scrollIntoViewIfNeeded();
    await optionA.click({ timeout: 5000 });

    const continueBtn = page
      .locator("//button[@class = 'ant-btn continue-btn ant-btn-primary']")
      .or(page.locator("//button[contains(., 'Next')]"))
      .first();
    await continueBtn.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtn.scrollIntoViewIfNeeded();
    await continueBtn.click({ timeout: 5000 });
    console.log('✓ Selected A and clicked Continue');

    // Step 7: Repeat selecting option A on next question and continue
    console.log('Step 7: Selecting option A on next question and clicking Continue...');
    await page.waitForTimeout(800); // brief pause for next question to load
    const optionANext = page
      .locator("//p[@class = 'question-text']//strong[text() = 'A.']")
      .or(page.locator("//p[contains(@class,'question-text')]//strong[contains(., 'A')]"))
      .first();
    await optionANext.waitFor({ state: 'visible', timeout: 20000 });
    await optionANext.scrollIntoViewIfNeeded();
    await optionANext.click({ timeout: 5000 });

    const continueBtnNext = page
      .locator("//button[@class = 'ant-btn continue-btn ant-btn-primary']")
      .or(page.locator("//button[contains(., 'Next')]"))
      .first();
    await continueBtnNext.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtnNext.scrollIntoViewIfNeeded();
    await continueBtnNext.click({ timeout: 5000 });
    console.log('✓ Selected A on next question and clicked Continue');

    // Step 8: Repeat selection for 97 more questions (A -> Continue)
    console.log('Step 8: Repeating selection for 97 more questions...');
    const optionLocators = [
      "//p[@class = 'question-text']//strong[text() = 'A.']",
      "//p[contains(@class,'question-text')]//strong[contains(., 'A')]",
      "(//label[contains(@class,'ant-radio-wrapper')])[1]",
      "(//div[contains(@class,'option')])[1]",
      "(//div[contains(@class,'choice')])[1]",
    ];

    for (let i = 1; i <= 97; i++) {
      console.log(`  • Question ${i + 2}: selecting A`);

      // Ensure a question is present
      await page.waitForSelector("//p[contains(@class,'question-text')]", { timeout: 20000 });

      let clickedOption = false;
      for (const loc of optionLocators) {
        const option = page.locator(loc).first();
        try {
          await option.waitFor({ state: 'visible', timeout: 8000 });
          await option.scrollIntoViewIfNeeded();
          await option.click({ timeout: 5000 });
          clickedOption = true;
          break;
        } catch {
          continue;
        }
      }

      if (!clickedOption) {
        throw new Error(`Could not select option A on question ${i + 2}`);
      }

      const navButton = page
        .locator("//button[@class = 'ant-btn continue-btn ant-btn-primary']")
        .or(page.locator("//button[contains(., 'Next')]"))
        .or(page.locator("//button[contains(., 'Continue')]"))
        .first();

      await navButton.waitFor({ state: 'visible', timeout: 20000 });
      await navButton.scrollIntoViewIfNeeded();
      await navButton.click({ timeout: 5000 });
      await page.waitForTimeout(500); // brief pause between questions
    }

    console.log('✓ Completed 97 additional questions');

    // Step 9: Final question (question 100) select A and Continue
    console.log('Step 9: Final question (100): selecting A and clicking Continue...');
    const optionALast = page
      .locator("//p[@class = 'question-text']//strong[text() = 'A.']")
      .or(page.locator("//p[contains(@class,'question-text')]//strong[contains(., 'A')]"))
      .first();
    await optionALast.waitFor({ state: 'visible', timeout: 20000 });
    await optionALast.scrollIntoViewIfNeeded();
    await optionALast.click({ timeout: 5000 });

    const continueBtnLast = page
      .locator("//button[@class = 'ant-btn continue-btn ant-btn-primary']")
      .or(page.locator("//button[contains(., 'Next')]"))
      .first();
    await continueBtnLast.waitFor({ state: 'visible', timeout: 20000 });
    await continueBtnLast.scrollIntoViewIfNeeded();
    await continueBtnLast.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('✓ Final question answered and continued');

    console.log('\n✅ Course attempt flow completed successfully!');
    
    // Keep browser open after test completes (for inspection)
    try {
      await page.evaluate(() => document.title);
      console.log('\n⏸ Browser will stay open for inspection. Press any key in terminal to close.');
      await page.pause();
    } catch (error) {
      console.log('\n⚠ Page is closed, but browser context will remain open for inspection.');
      await page.pause();
    }
  });
});
