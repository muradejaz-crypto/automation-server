// createTest.spec.js - Test for creating a test on FastLearner staging
const { test, expect } = require('@playwright/test');

// Import Page Object Model classes
const LoginPage = require('../../pages/LoginPage');
const CreateTestPage = require('../../pages/CreateTestPage');

test.describe('Create Test Flow', () => {
  test('Complete flow: Login and create a test', async ({ page }) => {
    // Increase test timeout for complex multi-step form with quiz questions
    test.setTimeout(300000); // 5 minutes
    
    // Initialize Page Object Models
    const loginPage = new LoginPage(page);
    const createTestPage = new CreateTestPage(page);

    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate();
    console.log('✓ Login page loaded');

    // Step 2: Login using LoginPage POM
    console.log('Step 2: Logging in...');
    await loginPage.login();
    console.log('✓ Login completed');

    // Step 3: Wait for redirect to student dashboard
    console.log('Step 3: Waiting for redirect to dashboard...');
    await expect(page).toHaveURL('https://staging.fastlearner.ai/student/dashboard', { timeout: 15000 });
    console.log('✓ Redirected to student dashboard');

    // Step 4: Navigate to Create Test page
    console.log('Step 4: Navigating to Create Test page...');
    await createTestPage.navigateToCreateTest();
    console.log('✓ Navigated to Create Test page');

    // Step 5: Fill all form fields in Step 1 (Test Information)
    console.log('Step 5: Filling test form (Step 1)...');
    await createTestPage.fillTestForm();
    console.log('✓ Test form filled successfully');

    // Step 6: Upload thumbnail
    console.log('Step 6: Uploading thumbnail...');
    await createTestPage.uploadThumbnail();
    console.log('✓ Thumbnail uploaded successfully');

    // Step 7: Handle thumbnail upload modal
    console.log('Step 7: Handling thumbnail upload modal...');
    await createTestPage.handleThumbnailModal();
    console.log('✓ Thumbnail modal handled');

    // Step 8: Click Continue button to go to Step 2
    console.log('Step 8: Clicking Continue button to advance to Step 2...');
    await createTestPage.clickContinue();
    console.log('✓ Continue button clicked');

    // Step 9: Verify Step 2 (Add Sections) is loaded
    console.log('Step 9: Verifying Step 2 (Add Sections) is loaded...');
    await createTestPage.verifyStep2Loaded();
    console.log('✓ Step 2 verified');

    // Step 10: Fill Add Sections form (Step 2)
    console.log('Step 10: Filling Add Sections form (Step 2)...');
    await createTestPage.fillAddSectionsForm();
    console.log('✓ Add Sections form filled successfully');

    // Step 11: Add quiz questions
    console.log('\nStep 11: Adding quiz questions...');
    
    // Define quiz questions data - 5 SQA Database questions with options and correct answers
    const quizQuestions = [
      {
        questionText: 'What does SQL stand for?',
        options: [
          'Structured Query Language',
          'Simple Query Language',
          'Systematic Question Logic',
          'Standard Question List'
        ],
        correctOptionIndex: 0
      },
      {
        questionText: 'Which SQL statement is used to retrieve data from a database?',
        options: [
          'GET',
          'SELECT',
          'FETCH',
          'OPEN'
        ],
        correctOptionIndex: 1
      },
      {
        questionText: 'Which of the following is a primary key constraint?',
        options: [
          'Ensures values in a column are unique and not NULL',
          'Allows duplicate values',
          'Automatically indexes foreign keys',
          'Deletes rows from a table'
        ],
        correctOptionIndex: 0
      },
      {
        questionText: 'Which SQL command is used to remove all rows from a table without removing the table itself?',
        options: [
          'DELETE',
          'DROP',
          'TRUNCATE',
          'REMOVE'
        ],
        correctOptionIndex: 2
      },
      {
        questionText: 'In database testing, what does CRUD stand for?',
        options: [
          'Create, Read, Update, Delete',
          'Check, Review, Update, Delete',
          'Create, Run, Undo, Delete',
          'Copy, Read, Update, Destroy'
        ],
        correctOptionIndex: 0
      }
    ];
    
    // Add all quiz questions
    await createTestPage.addMultipleQuestions(quizQuestions);
    console.log('✓ All quiz questions added successfully');

    // Step 12: Generate AI-Based Assessment Report and Preview
    console.log('Step 12: Configuring AI-Based Assessment Report and previewing...');
    await createTestPage.generateAIReport();
    console.log('✓ AI-Based Assessment Report configured and preview completed');

    // Step 13: Click Save button to save questions and sections
    console.log('Step 13: Clicking Save button to save questions and sections...');
    await createTestPage.clickSaveButton();
    console.log('✓ Questions and sections saved');

    // Step 14: Click Continue button to go to Step 3
    console.log('Step 14: Clicking Continue button to advance to Step 3...');
    await createTestPage.clickContinueStep2();
    console.log('✓ Continue button clicked on Step 2');

    // Step 15: Verify Step 3 (Preview) is loaded
    console.log('Step 15: Verifying Step 3 (Preview) is loaded...');
    await createTestPage.verifyStep3Loaded();
    console.log('✓ Step 3 verified');

    // Step 16: Click Publish button to publish the test
    console.log('Step 16: Clicking Publish button to publish the test...');
    await createTestPage.clickPublish();
    console.log('✓ Test published successfully');

    console.log('\n✅ All steps completed successfully!');
    console.log('✅ Test created and published with all quiz questions added!');
  });
});
