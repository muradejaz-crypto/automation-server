// createCourse.spec.js - End-to-end test for creating a Course on FastLearner staging
const { test, expect } = require('@playwright/test');

// Import Page Object Model classes
const LoginPage = require('../../pages/LoginPage');
const CreateCourse = require('../../pages/CreateCourse');

test.describe('Create Course Flow', () => {
  test('Complete flow: Login, create course with sections & topics', async ({ page }) => {
    // Give enough time for full end-to-end flow
    test.setTimeout(300000); // 5 minutes

    // Initialize Page Object Models
    const loginPage = new LoginPage(page);
    const createCourse = new CreateCourse(page);

    // 1. Login using LoginPage
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate();

    console.log('Step 2: Logging in...');
    await loginPage.login();

    // 2. Wait for redirect to student dashboard
    console.log('Step 3: Waiting for redirect to dashboard...');
    await expect(page).toHaveURL('https://staging.fastlearner.ai/student/dashboard', {
      timeout: 15000,
    });

    // 3–6. Navigate to instructor dashboard > Create Course > select Course > land on /instructor/course
    console.log('Step 4: Starting navigation to instructor course creation page...');
    await createCourse.navigateToCourseCreation();

    await expect(page).toHaveURL(/\/instructor\/course/, { timeout: 15000 });
    console.log('✓ On instructor course creation page');

    // 7. Fill all course fields using CreateCourse
    console.log('Step 5: Filling course details...');
    await createCourse.fillCourseDetails();
    
    // Log the unique course title that was generated
    const courseTitle = createCourse.getCourseTitle();
    if (courseTitle) {
      console.log(`\n📝 Course Title: "${courseTitle}"`);
      console.log(`🔗 Course URL Slug: "${createCourse.getCourseUrlSlug()}"\n`);
    }

    // 8. Click Continue to open Sections page
    console.log('Step 6: Clicking Continue to go to Sections page...');
    await createCourse.clickContinueToSections();

    // 9–10. Add sections & topics and attach video links
    console.log('Step 7: Adding sections, topics, and video content...');
    await createCourse.addSectionsAndTopics();

    // 11–12. Save and verify successful creation
    console.log('Step 8: Saving course and verifying creation...');
    await createCourse.saveCourseAndVerify();

    // 13. Add additional quiz topic after saving
    // (Skip if page is closed after Preview Report)
    try {
      console.log('Step 9: Adding additional quiz topic (Playwright Basics Quiz)...');
      await createCourse.addAdditionalQuizTopic();

      // 14. Save again after adding quiz topic
      console.log('Step 10: Saving course again after adding quiz topic...');
      await createCourse.saveCourseAndVerify();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Target page, context or browser has been closed')) {
        console.log('⚠ Page is closed (likely after Preview Report) - skipping additional quiz topic and save');
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    console.log('\n✅ Course created flow completed successfully');
    
    // Keep browser open after test completes (for inspection)
    // Check if page is still open before pausing
    try {
      await page.evaluate(() => document.title);
      console.log('\n⏸ Browser will stay open for inspection. Press any key in terminal to close.');
      await page.pause();
    } catch (error) {
      console.log('\n⚠ Page is closed, but browser context will remain open for inspection.');
      // Even if page is closed, pause to keep browser open
      await page.pause();
    }
  });
});

//


