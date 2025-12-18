// LoginPage.js - Page Object Model for Login Page
const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Selectors for login page elements
    this.selectors = {
      emailInput: 'input[type="email"], input[name="email"], input[id*="email"]',
      passwordInput: 'input[type="password"], input[name="password"], input[id*="password"]',
      loginButton: 'button:has-text("Sign In"), button[type="submit"]'
    };
  }

  // Navigate to the login page
  async navigate() {
    await this.page.goto('https://staging.fastlearner.ai/auth/sign-in');
    // Wait for the page to load
    await this.page.waitForLoadState('networkidle');
  }

  // Login with provided default credentials
  async login() {
    const email = 'muradejaz@vinncorp.com';
    const password = 'Qwerty@123';

    // Fill email field
    const emailInput = this.page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(email);

    // Fill password field
    const passwordInput = this.page.locator('input[type="password"]').first();
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);

    // Submit form by pressing Enter (most reliable way to submit forms)
    // This triggers form submission without needing to find the exact button
    await Promise.all([
      this.page.waitForURL('https://staging.fastlearner.ai/student/dashboard', { timeout: 15000 }),
      passwordInput.press('Enter')
    ]);
  }
}

module.exports = LoginPage;

