// login.spec.js - Basic login verification
const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');

test.describe('Login Flow', () => {
  test('Login with default credentials', async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);

    console.log('Step 1: Navigate to login page');
    await loginPage.navigate();

    console.log('Step 2: Perform login');
    await loginPage.login();

    console.log('Step 3: Verify dashboard URL');
    await expect(page).toHaveURL('https://staging.fastlearner.ai/student/dashboard', {
      timeout: 15000,
    });

    console.log('✅ Login flow completed');
  });
});
