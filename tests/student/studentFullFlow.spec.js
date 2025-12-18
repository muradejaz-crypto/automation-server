// studentFullFlow.spec.js - Full student flow test using Page Object Model
const { test, expect } = require('@playwright/test');

// Import all Page Object Model classes
const LoginPage = require('../../pages/LoginPage');
const CreateTestPage = require('../../pages/CreateTestPage');

test.describe('Student Full Flow Test', () => {
  test('Complete student journey from login to video playback', async ({ page }) => {
    // Increase test timeout for complex multi-step form
    test.setTimeout(120000); // 2 minutes
    
    // Initialize all Page Object Models
    const loginPage = new LoginPage(page);
    const createTestPage = new CreateTestPage(page);

    // Step 1: Navigate to login page
    await loginPage.navigate();
    console.log('Step 1: Navigated to login page');

    // Step 2: Call loginPage.login() - fills email and password automatically
    await loginPage.login();
    console.log('Step 2: Completed login with credentials');

    // Step 3: Verify dashboard URL = "https://fastlearner.ai/student/dashboard"
    await expect(page).toHaveURL('https://fastlearner.ai/student/dashboard');
    console.log('Step 3: Verified dashboard URL');

    // Step 4: Navigate to Create Test page
    console.log('Step 4: Navigating to Create Test page...');
    await createTestPage.navigateToCreateTest();
    console.log('✓ Navigated to Create Test page');

    // Step 5: Fill test form (Step 1)
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

    // Step 8: Click Continue button to advance to Step 2
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
    
    // Define quiz questions data
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

    // Step 12: Generate AI-Based Assessment Report
    console.log('Step 12: Configuring AI-Based Assessment Report...');
    await createTestPage.generateAIReport();
    console.log('✓ AI-Based Assessment Report configured and preview initiated');

    // Step 13: Click Continue button to advance to Step 3
    console.log('Step 13: Clicking Continue button to advance to Step 3...');
    await createTestPage.clickContinueStep2();
    console.log('✓ Continue button clicked on step 2');

    // Step 14: Verify Step 3 (Preview) is loaded
    console.log('Step 14: Verifying Step 3 (Preview) is loaded...');
    await createTestPage.verifyStep3Loaded();
    console.log('✓ Step 3 verified');

    console.log('\n✅ All steps completed successfully!');
    console.log('✅ Test created with all quiz questions added!');
  });
});

