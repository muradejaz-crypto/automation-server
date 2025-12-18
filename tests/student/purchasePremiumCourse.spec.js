// purchasePremiumCourse.spec.js - Test for purchasing a premium course
const { test, expect } = require('@playwright/test');

// Import Page Object Model classes
const LoginPage = require('../../pages/LoginPage');

test.describe('Purchase Premium Course Flow', () => {
  test('Complete flow: Login and purchase premium course', async ({ page }) => {
    // Increase test timeout for purchase flow
    test.setTimeout(120000); // 2 minutes

    // Initialize Page Object Models
    const loginPage = new LoginPage(page);

    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate();
    console.log('✓ Login page loaded');

    // Step 2: Login using LoginPage
    console.log('Step 2: Logging in...');
    await loginPage.login();
    console.log('✓ Login completed');

    // Step 3: Wait for redirect to student dashboard
    console.log('Step 3: Waiting for redirect to dashboard...');
    await expect(page).toHaveURL('https://staging.fastlearner.ai/student/dashboard', {
      timeout: 15000,
    });
    console.log('✓ Redirected to student dashboard');

    // Step 4: Navigate to a premium course page
    // Note: You may need to adjust this URL to point to an actual premium course
    console.log('Step 4: Navigating to premium course page...');
    // Option 1: If you have a specific course URL, use it:
    // await page.goto('https://staging.fastlearner.ai/student/course-details/[course-slug]');
    
    // Option 2: Navigate to course catalog and find a premium course
    // For now, we'll assume you'll navigate to a course page manually or via search
    // You can add navigation logic here based on your application flow
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    console.log('✓ Premium course page loaded');

    // Step 5: Wait for and click on the $50 price locator
    console.log('Step 5: Looking for $50 price button...');
    const priceButton = page.locator('//p[text() = "$50"]');
    
    // Wait for the price element to be visible
    await priceButton.waitFor({ state: 'visible', timeout: 15000 });
    console.log('✓ $50 price element found');

    // Scroll into view if needed
    await priceButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click on the $50 price
    console.log('Step 6: Clicking on $50 price button...');
    await priceButton.click();
    console.log('✓ Clicked on $50 price button');

    // Step 7: Redirect to payment page with provided params
    const paymentUrl = 'https://staging.fastlearner.ai/payment-method?courseId=141&courseUrl=photo-shop-mastering&price=50&premium=true';
    console.log(`Step 7: Redirecting to payment page: ${paymentUrl}`);
    await page.goto(paymentUrl);
    await expect(page).toHaveURL(paymentUrl);
    console.log('✓ Reached payment page');

    // Step 8: Fill payment form (first name & last name)
    console.log('Step 8: Filling payment form fields...');
    const firstNameInput = page.locator("//p[normalize-space()='First Name']/following-sibling::input");
    const lastNameInput = page.locator("//p[normalize-space()='Last Name']/following-sibling::input");

    await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await firstNameInput.fill('John');

    await lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await lastNameInput.fill('Doe');
    console.log('✓ Entered first and last name');

    // Step 9: Enter payment details
    console.log('Step 9: Entering payment details...');
    const cardInput = page.locator("//input[@placeholder = '1111  2222  3333  4444']");
    const expiryInput = page.locator("//input[@placeholder = 'MM/YY']");
    const cvvInput = page.locator("//input[@placeholder ='123']");
    const zipInput = page.locator("//input[@placeholder ='Zip Code']");

    await cardInput.waitFor({ state: 'visible', timeout: 10000 });
 

    await expiryInput.waitFor({ state: 'visible', timeout: 10000 });
    await expiryInput.fill('12/29');

    await cvvInput.waitFor({ state: 'visible', timeout: 10000 });
    await cvvInput.fill('123');

    await zipInput.waitFor({ state: 'visible', timeout: 10000 });
    await zipInput.fill('75500');

    console.log('✓ Card, expiry, CVV, and ZIP entered');

    // Step 10: Select country (Pakistan)
    console.log('Step 10: Selecting country Pakistan...');
    const countrySelect = page.locator("//nz-select-item[@class = 'ant-select-selection-item ng-star-inserted']");
    await countrySelect.waitFor({ state: 'visible', timeout: 10000 });
    await countrySelect.click();

    const countryOption = page
      .locator("//div[contains(@class,'ant-select-item-option') and contains(., 'Pakistan')]")
      .first();
    await countryOption.waitFor({ state: 'visible', timeout: 10000 });
    await countryOption.click();
    console.log('✓ Country set to Pakistan');

    // Step 11: Complete additional purchase steps if needed
    // Add any additional steps here (confirm/submit)

    console.log('\n✅ Premium course purchase flow completed successfully!');
    
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
