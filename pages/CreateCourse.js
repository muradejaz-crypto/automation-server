// CreateCourse.js - Page Object Model for full Create Course flow
const { expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

class CreateCourse {
  constructor(page) {
    this.page = page;

    // Thumbnail image path - use img.jpg from project root
    this.THUMBNAIL_PATH = path.resolve(__dirname, '../img.jpg');
    
    // Verify image file exists
    if (!fs.existsSync(this.THUMBNAIL_PATH)) {
      throw new Error(`Image file not found at: ${this.THUMBNAIL_PATH}`);
    }

    // Store unique course title (generated when filling course details)
    this.courseTitle = null;
    this.courseUrlSlug = null;
  }

  /**
   * Navigate to instructor dashboard
   */
  async navigateToInstructorDashboard() {
    console.log('Step 1: Navigating to instructor dashboard...');
    
    await this.page.goto('https://staging.fastlearner.ai/instructor/instructor-dashboard');
    
    // Wait for page to load
    await this.page.waitForLoadState('load');
    
    // Verify we're on the instructor dashboard
    await expect(this.page).toHaveURL(/\/instructor\/instructor-dashboard/, { timeout: 15000 });
    
    console.log('✓ Successfully navigated to instructor dashboard');
  }

  /**
   * Click the "Create Course" button
   */
  async clickCreateCourseButton() {
    console.log('Step 2: Clicking "Create Course" button...');
    
    // Find the "Create Course" button using multiple strategies
    const createCourseButton = this.page.getByRole('button', { name: 'Create Course', exact: false })
      .or(this.page.locator('button:has-text("Create Course")'))
      .or(this.page.locator('button:has-text("create course")'))
      .or(this.page.locator('a:has-text("Create Course")'))
      .first();
    
    // Wait for button to be visible
    await createCourseButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Scroll button into view if needed
    await createCourseButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Check if button is enabled
    const isEnabled = await createCourseButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      await expect(createCourseButton).toBeEnabled({ timeout: 10000 });
    }
    
    // Click the button
    await createCourseButton.click();
    console.log('✓ Clicked "Create Course" button');
    
    // Wait for navigation to content type selection page
    await this.page.waitForURL(/\/instructor\/content-type/, { timeout: 15000 });
    console.log('✓ Navigated to content type selection page');
  }

  /**
   * Wait for content type selection page to load
   */
  async verifyContentTypePageLoaded() {
    console.log('Step 3: Verifying content type selection page loaded...');
    
    // Verify URL
    await expect(this.page).toHaveURL(/\/instructor\/content-type/, { timeout: 15000 });
    
    // Wait for page to load
    await this.page.waitForLoadState('load');
    
    // Optionally verify some element on the content type page is visible
    // This can be adjusted based on the actual page structure
    await this.page.waitForTimeout(1000);
    
    console.log('✓ Content type selection page loaded successfully');
  }

  /**
   * Select "Course" content type
   */
  async selectCourseContentType() {
    console.log('Step 4: Selecting "Course" content type...');
    
    // Find the "Course" element - it's an <h4> with text 'Course'
    const courseHeading = this.page.locator('h4', { hasText: 'Course' });
    
    // Wait for the h4 element to be visible
    await courseHeading.waitFor({ state: 'visible', timeout: 15000 });
    
    // Scroll into view if needed
    await courseHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Try clicking the h4 element first
    try {
      await courseHeading.click({ timeout: 5000 });
      console.log('✓ Clicked "Course" h4 element');
    } catch (clickError) {
      // If clicking h4 doesn't work, try clicking its parent element
      console.log('⚠ Clicking h4 directly failed, trying parent element...');
      const parentElement = courseHeading.locator('xpath=ancestor::*[1]');
      await parentElement.waitFor({ state: 'visible', timeout: 5000 });
      await parentElement.scrollIntoViewIfNeeded();
      await parentElement.click();
      console.log('✓ Clicked parent element of "Course" h4');
    }
    
    console.log('✓ Selected "Course" content type');
    
    // Wait for navigation to course creation page
    await this.page.waitForURL(/\/instructor\/course/, { timeout: 15000 });
    console.log('✓ Navigated to course creation page');
  }

  /**
   * Wait for course creation page to load
   */
  async verifyCourseCreationPageLoaded() {
    console.log('Step 5: Verifying course creation page loaded...');
    
    // Verify URL
    await expect(this.page).toHaveURL(/\/instructor\/course/, { timeout: 15000 });
    
    // Wait for page to load
    await this.page.waitForLoadState('load');
    
    // Wait a bit for any dynamic content to render
    await this.page.waitForTimeout(2000);
    
    console.log('✓ Course creation page loaded successfully');
    console.log('✅ All steps completed - ready to create course');
  }

  /**
   * Complete flow: Navigate to instructor dashboard, click Create Course, select Course type
   */
  async navigateToCourseCreation() {
    console.log('\n🚀 Starting course creation flow...\n');
    
    try {
      // Step 1: Navigate to instructor dashboard
      await this.navigateToInstructorDashboard();
      
      // Step 2: Click Create Course button
      await this.clickCreateCourseButton();
      
      // Step 3: Verify content type page loaded
      await this.verifyContentTypePageLoaded();
      
      // Step 4: Select Course content type
      await this.selectCourseContentType();
      
      // Step 5: Verify course creation page loaded
      await this.verifyCourseCreationPageLoaded();
      
      console.log('\n✅ Course creation flow completed successfully!\n');
      
    } catch (error) {
      console.error('\n❌ Error during course creation flow:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  // ===========================================================================
  // COURSE DETAILS PAGE (on /instructor/course)
  // ===========================================================================

  /**
   * Fill all course detail fields on `/instructor/course`
   */
  async fillCourseDetails() {
    console.log('➡ Filling course details on /instructor/course ...');

    // Verify we are on the course page
    await expect(this.page).toHaveURL(/\/instructor\/course/);

    // Type: Standard
    console.log('  - Selecting Type: Standard');
    // Wait for "Type *" label to be visible
    await expect(this.page.getByText('Type *')).toBeVisible();
    const typeDropdownTrigger = this.page.locator('.ant-select-selector').first();
    await typeDropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await typeDropdownTrigger.click();
    
    // Select "Standard" option using the same pattern as CreateTestPage.js
    // Using >> descendant combinator with .first() to avoid strict mode violation
    const standardOption = this.page.locator('.cdk-overlay-pane >> text=Standard').first();
    await standardOption.waitFor({ state: 'visible', timeout: 10000 });
    await standardOption.click();
    await expect(typeDropdownTrigger).not.toBeEmpty();
    console.log('  ✓ Type set to Standard');

    // Title - Generate unique title with timestamp to prevent duplicates (max 20 chars)
    console.log('  - Filling Title');
    const timestamp = Date.now();
    // Use last 8 digits of timestamp for uniqueness, keep total under 20 chars
    const uniqueId = timestamp.toString().slice(-8);
    const baseTitle = 'AutoFW';
    this.courseTitle = `${baseTitle}${uniqueId}`.substring(0, 20); // Ensure max 20 chars
    
    const titleInput = this.page
      .getByPlaceholder('Insert your title')
      .or(this.page.locator('input[placeholder*="title" i]'))
      .first();
    await titleInput.fill(this.courseTitle);
    console.log(`  ✓ Title set to: "${this.courseTitle}" (${this.courseTitle.length} chars)`);

    // Level: Intermediate
    console.log('  - Selecting Level: Intermediate');
    const levelDropdown = this.page.locator('.ant-select-selector').nth(1);
    await levelDropdown.click();
    const levelOption = this.page.locator('.cdk-overlay-pane').getByText('Intermediate', { exact: true });
    await levelOption.click();

    // URL - Only append the slug to the default URL (using unique slug, max 20 chars)
    console.log('  - Filling URL');
    // Generate URL slug from title (lowercase, URL-safe, max 20 chars)
    this.courseUrlSlug = this.courseTitle.toLowerCase().substring(0, 20);
    
    const urlInput = this.page
      .locator('input[placeholder*="URL" i], input[placeholder*="link" i]')
      .first();
    // Get the current value (default URL) and append only the slug
    const currentUrl = await urlInput.inputValue().catch(() => 'https://staging.fastlearner.ai/student/course-details/');
    const baseUrl = currentUrl.endsWith('/') ? currentUrl : currentUrl + '/';
    await urlInput.fill(baseUrl + this.courseUrlSlug);
    console.log(`  ✓ URL slug set to: "${this.courseUrlSlug}" (${this.courseUrlSlug.length} chars)`);

    // Headline
    console.log('  - Filling Headline');
    const headlineInput = this.page
      .getByPlaceholder('About the course')
      .or(this.page.locator('textarea[placeholder*="About" i]'))
      .first();
    await headlineInput.fill('Learn Playwright Automation');

    // Category
    console.log('  - Selecting Category: Development');
    await expect(this.page.getByText('Category *')).toBeVisible();
    const categoryDropdownTrigger = this.page.locator('.ant-select-selector').nth(2);
    await categoryDropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await categoryDropdownTrigger.click();
    
    // Select "Development" option using the same pattern as Type dropdown
    const developmentOption = this.page.locator('.cdk-overlay-pane >> text=Development').first();
    await developmentOption.waitFor({ state: 'visible', timeout: 10000 });
    await developmentOption.click();
    await expect(categoryDropdownTrigger).not.toBeEmpty();

    // Description
    console.log('  - Filling Description');
    const descriptionEditor = this.page.locator('.angular-editor-textarea[contenteditable="true"]').first();
    await descriptionEditor.click();
    await descriptionEditor.fill(
      'This comprehensive Playwright course teaches you how to automate modern web applications.\n\n' +
        'You will learn selectors, assertions, debugging, POM, API testing and CI/CD.'
    );

    // Hashtags - Add each hashtag individually, one by one
    console.log('  - Adding Hashtags (one by one)');
    await this.page.getByText('Hashtags', { exact: false }).waitFor({ state: 'visible' });
    
    // Array of individual hashtags (without # symbol, that gets added automatically)
    const hashtags = ['Playwright', 'AutomationTesting', 'QA', 'WebTesting', 'JavaScriptTesting'];
    
    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];
      console.log(`    - Adding hashtag ${i + 1}/${hashtags.length}: ${hashtag}`);
      
      // Click "New Tag" button for each hashtag
      const newTagTrigger = this.page
        .getByText('New Tag', { exact: false })
        .or(this.page.locator('button:has-text("New Tag")'))
        .first();
      await newTagTrigger.waitFor({ state: 'visible', timeout: 10000 });
      await newTagTrigger.click();
      
      // Wait for the input to appear after clicking
      await this.page.waitForTimeout(500);
      
      // Find the hashtag input - use fallback if placeholder doesn't match
      let hashtagInput = this.page.locator('input[placeholder="New Tag"]');
      const inputCount = await hashtagInput.count();
      
      if (inputCount === 0) {
        // Fallback: Find input that follows "Hashtags *" label
        hashtagInput = this.page.getByText('Hashtags', { exact: false }).locator('xpath=following::input[1]');
      }
      
      // Wait for the input to be visible and fill it with the current hashtag
      await hashtagInput.waitFor({ state: 'visible', timeout: 10000 });
      await hashtagInput.fill(hashtag);
      
      // Press Enter to add the hashtag (or wait for it to be auto-added)
      await hashtagInput.press('Enter');
      await this.page.waitForTimeout(300); // Wait for tag to be added
    }
    
    console.log(`  ✓ Added ${hashtags.length} hashtags successfully`);

    // Prerequisite
    console.log('  - Filling Prerequisite');
    const prerequisiteInput = this.page
      .getByPlaceholder('Eg. You must have a basic knowledge of programming')
      .or(this.page.locator('textarea[placeholder*="Prerequisite" i]'))
      .first();
    await prerequisiteInput.fill('Basic knowledge of JavaScript');

    // What will students learn
    console.log('  - Filling What will students learn');
    const learnInput = this.page
      .getByPlaceholder('What will students learn in your course?')
      .or(this.page.locator('textarea[placeholder*="What will students learn" i]'))
      .first();
    await learnInput.fill('How to automate web testing using Playwright');

    // Preview Video
    console.log('  - Filling Preview Video');
    const previewVideoInput = this.page
      .getByPlaceholder(/(Preview|Promotional).*(video|link|url)/i)
      .or(
        this.page
          .getByText('Preview Video', { exact: false })
          .locator('xpath=following::input[1]')
      )
      .first();
    await previewVideoInput.fill('https://www.youtube.com/watch?v=F_77M3ZZ1z8');
    
    // Click "Add" button to add the video URL
    console.log('  - Clicking Add button for Preview Video');
    const addVideoButton = this.page
      .getByRole('button', { name: /^Add$/i })
      .or(this.page.locator('button:has-text("Add")').filter({ hasNot: this.page.locator('text=Add more') }))
      .first();
    await addVideoButton.waitFor({ state: 'visible', timeout: 10000 });
    await addVideoButton.click();
    await this.page.waitForTimeout(500); // Wait for video to be added

    // Thumbnail upload (MUST be done before clicking Continue)
    console.log('  - Uploading Thumbnail');
    await this.uploadThumbnail();

    // Handle thumbnail upload modal (if it appears)
    console.log('  - Handling thumbnail upload modal...');
    await this.handleThumbnailModal();

    console.log('✅ Course details form filled successfully (including thumbnail)');
  }

  /**
   * Upload course thumbnail image using file input near "Thumbnail"
   * Similar to CreateTestPage - multiple strategies to ensure upload succeeds
   */
  async uploadThumbnail() {
    // Helper to check if page is open
    const isPageOpen = async () => {
      try {
        await this.page.evaluate(() => document.title);
        return true;
      } catch {
        return false;
      }
    };

    let uploaded = false;

    // Approach 0: Click "Upload File" button first, then find input (like CreateTestPage)
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('  - Attempting thumbnail upload: Clicking Upload File button...');
        const thumbnailLabel = this.page.getByText('Thumbnail', { exact: false });
        await thumbnailLabel.waitFor({ state: 'visible' });

        // Find the "Upload File" button near "Thumbnail" text
        const uploadFileButton = thumbnailLabel
          .locator('xpath=following::button[contains(., "Upload File")][1]')
          .or(this.page.locator('button:has-text("Upload File")').last());

        const buttonCount = await uploadFileButton.count().catch(() => 0);
        if (buttonCount > 0) {
          const buttonVisible = await uploadFileButton.isVisible({ timeout: 3000 }).catch(() => false);
          if (buttonVisible) {
            await uploadFileButton.scrollIntoViewIfNeeded();
            await uploadFileButton.click();
            await this.page.waitForTimeout(500); // Wait for file input to appear

            // Now find and upload to the file input
            const fileInput = this.page.locator('input[type="file"]').last();
            const fileInputAttached = await fileInput.isAttached().catch(() => false);
            if (fileInputAttached) {
              await fileInput.setInputFiles(this.THUMBNAIL_PATH);
              await this.page.waitForTimeout(500);
              const files = await fileInput.evaluate(el => el.files?.length ?? 0);
              if (files === 1) {
                uploaded = true;
                console.log('  ✓ Thumbnail uploaded successfully using Upload File button approach');
              }
            }
          }
        }
      } catch (e) {
        console.log('  - Upload File button approach failed:', e instanceof Error ? e.message : e);
      }
    }

    // Approach 1: Find file input directly after Thumbnail label
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('  - Attempting thumbnail upload: Finding input after Thumbnail label...');
        const thumbnailLabel = this.page.getByText('Thumbnail', { exact: false });
        await thumbnailLabel.waitFor({ state: 'visible' });

        const fileInputAfterThumbnail = thumbnailLabel.locator('xpath=following::input[@type="file"][1]');
        const count = await fileInputAfterThumbnail.count().catch(() => 0);
        if (count > 0) {
          await fileInputAfterThumbnail.setInputFiles(this.THUMBNAIL_PATH);
          await this.page.waitForTimeout(500);
          const files = await fileInputAfterThumbnail.evaluate(el => el.files?.length ?? 0);
          if (files === 1) {
            uploaded = true;
            console.log('  ✓ Thumbnail uploaded successfully using file input after label');
          }
        }
      } catch (e) {
        console.log('  - File input after label approach failed:', e instanceof Error ? e.message : e);
      }
    }

    // Approach 2: Try last file input (thumbnail is typically last)
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('  - Attempting thumbnail upload: Trying last file input...');
        const fileInputs = this.page.locator('input[type="file"]');
        const count = await fileInputs.count().catch(() => 0);
        if (count > 0) {
          const lastInput = fileInputs.nth(count - 1);
          await lastInput.setInputFiles(this.THUMBNAIL_PATH);
          await this.page.waitForTimeout(500);
          const files = await lastInput.evaluate(el => el.files?.length ?? 0);
          if (files === 1) {
            uploaded = true;
            console.log('  ✓ Thumbnail uploaded successfully using last file input');
          }
        }
      } catch (e) {
        console.log('  - Last file input approach failed:', e instanceof Error ? e.message : e);
      }
    }

    // Assert that thumbnail was uploaded successfully
    if (!uploaded) {
      throw new Error('Failed to upload thumbnail: img.jpg not set on any file input');
    }

    console.log('  ✓ Thumbnail upload verified successfully');
    
    // Wait for UI to process the file upload
    await this.page.waitForTimeout(2000);
  }

  /**
   * Handle thumbnail upload modal dialog (similar to CreateTestPage)
   * This modal appears after uploading thumbnail and needs to be handled before clicking Continue
   */
  async handleThumbnailModal() {
    // Helper to check if page is open
    const isPageOpen = async () => {
      try {
        await this.page.evaluate(() => document.title);
        return true;
      } catch {
        return false;
      }
    };
    
    try {
      console.log('  - Checking for thumbnail upload modal dialog...');
      
      // Wait a bit for modal to appear after upload
      await this.page.waitForTimeout(2000);
      
      // Check for modal using multiple selectors
      const uploadPhotoHeading = this.page.getByRole('heading', { name: 'Upload Photo', exact: true })
        .or(this.page.locator('text=/Upload Photo/i').first());
      const saveButton = this.page.getByRole('button', { name: 'Save', exact: true })
        .or(this.page.locator('button:has-text("Save")').first());
      
      // Also check for modal by overlay presence
      const modalOverlay = this.page.locator('.ant-modal-wrap, .ant-modal-mask, .cdk-overlay-container, [class*="modal"]').first();
      const overlayVisible = await modalOverlay.isVisible({ timeout: 3000 }).catch(() => false);
      
      const headingVisible = await uploadPhotoHeading.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (headingVisible || overlayVisible) {
        if (headingVisible) {
          console.log('  - Upload Photo modal detected (heading found)');
        } else if (overlayVisible) {
          console.log('  - Modal overlay detected, checking if it requires interaction...');
        }
        
        await saveButton.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        
        // Directly set file to the modal's file input WITHOUT clicking Browse button
        // This prevents file explorer from opening
        try {
          console.log('  - Setting file directly to modal file input (without clicking Browse)...');
          
          // Find and upload file directly to the modal's file input
          const modalFileInputs = this.page.locator('input[type="file"]');
          const modalInputCount = await modalFileInputs.count().catch(() => 0);
          
          if (modalInputCount > 0) {
            // Try the last file input (most likely the one in the modal)
            const modalFileInput = modalFileInputs.nth(modalInputCount - 1);
            
            // Check if input is attached and visible/hidden (file inputs are typically hidden)
            const isAttached = await modalFileInput.isAttached().catch(() => false);
            if (isAttached) {
              // Directly set the file without clicking Browse
              await modalFileInput.setInputFiles(this.THUMBNAIL_PATH);
              await this.page.waitForTimeout(1000); // Wait for image to process
              
              console.log('  - ✓ Image set directly in modal file input (file explorer not opened)');
              
              // Wait a bit more for Save button to become enabled
              await this.page.waitForTimeout(2000);
            } else {
              console.log('  - ⚠ Modal file input not attached, skipping direct file set');
            }
          } else {
            console.log('  - ⚠ No file inputs found in modal, skipping direct file set');
          }
        } catch (fileInputError) {
          console.log('  - Could not set file directly to modal input:', fileInputError instanceof Error ? fileInputError.message : fileInputError);
        }
        
        // Wait for Save button to be enabled (it starts disabled until image is loaded)
        try {
          const saveBtnVisible = await saveButton.first().isVisible({ timeout: 5000 }).catch(() => false);
          if (saveBtnVisible) {
            await expect(saveButton.first()).toBeEnabled({ timeout: 15000 });
            
            // Button is enabled, click it to save and close modal
            await saveButton.first().click();
            console.log('  - ✓ Save button clicked in thumbnail upload modal - modal will close');
            
            // Wait for modal to close
            await this.page.waitForTimeout(2000);
          }
        } catch (enableError) {
          console.log('  - Save button did not become enabled or not found, trying to close modal manually...');
          // Try to click Cancel or Close button instead
          try {
            const cancelButton = this.page.getByRole('button', { name: 'Cancel', exact: true })
              .or(this.page.locator('button:has-text("Cancel")')).first();
            const closeButton = this.page.getByRole('button', { name: 'Close', exact: true })
              .or(this.page.locator('button:has-text("Close")')).first();
            
            const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
            const closeVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
            
            if (cancelVisible) {
              await cancelButton.click();
              console.log('  - ✓ Clicked Cancel button');
            } else if (closeVisible) {
              await closeButton.click();
              console.log('  - ✓ Clicked Close button');
            } else {
              // Press Escape key to close modal
              await this.page.keyboard.press('Escape');
              console.log('  - ✓ Pressed Escape to close modal');
            }
          } catch (closeError) {
            console.log('  - Could not close modal, will try to remove overlays...');
          }
        }
        
        // Wait for modal to disappear
        await uploadPhotoHeading.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        console.log('  - Waiting for modal overlays to disappear...');
        
        // Remove modal overlays (check if page is open first)
        if (await isPageOpen()) {
          await this.page.evaluate(() => {
            const overlays = document.querySelectorAll('.ant-modal-wrap, .ant-modal-mask, .cdk-overlay-container .ant-modal-wrap, [class*="modal-wrap"]');
            overlays.forEach((overlay) => {
              overlay.style.display = 'none';
              overlay.remove();
            });
          });
        }
        
        await this.page.waitForTimeout(3000);
        console.log('  - ✓ Modal closed, proceeding...');
      } else {
        console.log('  - No Upload Photo modal found, proceeding...');
        await this.page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('  - Modal handling error:', e instanceof Error ? e.message : e);
      
      // Force remove overlays anyway (only if page is still open)
      if (await isPageOpen()) {
        try {
          await this.page.evaluate(() => {
            const overlays = document.querySelectorAll('.ant-modal-wrap, .ant-modal-mask, .cdk-overlay-container .ant-modal-wrap');
            overlays.forEach((overlay) => {
              overlay.style.display = 'none';
              overlay.remove();
            });
          });
          await this.page.waitForTimeout(2000);
        } catch (evalError) {
          console.log('  - Could not remove overlays - page may be closed');
        }
      }
    }
  }

  /**
   * Click the Continue button to go from course details → Sections page
   */
  async clickContinueToSections() {
    console.log('➡ Clicking Continue to open Sections page');

    const continueButton = this.page
      .getByRole('button', { name: /Continue/i })
      .or(this.page.getByText('Continue', { exact: false }))
      .first();

    await continueButton.click();

    // Wait for the page to transition - wait for Step 1 fields to disappear and sections UI to appear
    // First, wait for "Add Section" button to appear
    const addSectionButton = this.page
      .getByRole('button', { name: /Add Section/i })
      .or(this.page.getByText('Add Section', { exact: false }))
      .first();
    await addSectionButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Additional wait to ensure the sections page UI is fully rendered
    await this.page.waitForTimeout(1000);
    
    // Verify we're on the sections page by checking that section-related elements are present
    // This ensures the UI has fully transitioned
    const sectionInput = this.page.locator('input[placeholder*="Section" i]').first();
    const sectionInputVisible = await sectionInput.isVisible({ timeout: 5000 }).catch(() => false);
    
    // If section input is not visible yet, wait a bit more for the page to fully load
    if (!sectionInputVisible) {
      await this.page.waitForTimeout(1000);
    }

    console.log('✅ Sections page loaded');
  }

  // ===========================================================================
  // SECTIONS & TOPICS
  // ===========================================================================

  getSectionsData() {
    // Quiz questions data - 5 SQA Database questions
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

    return [
      {
        name: 'Introduction to Playwright',
        topics: [
          { type: 'video', title: 'What is Playwright?', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
          { type: 'video', title: 'Installation', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
          { type: 'video', title: 'First Test', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
          { type: 'quiz', title: 'SQA Database Quiz', questions: quizQuestions },
        ],
      },
      {
        name: 'Playwright Advanced',
        topics: [
          { type: 'video', title: 'Locators', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
          { type: 'video', title: 'Assertions', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
          { type: 'video', title: 'Handling Forms', videoUrl: 'https://www.youtube.com/watch?v=F_77M3ZZ1z8' },
        ],
      },
    ];
  }

  async addSectionsAndTopics() {
    console.log('➡ Adding sections and topics ...');

    const sections = this.getSectionsData();

    for (const [index, section] of sections.entries()) {
      console.log(`  - Creating Section ${index + 1}: ${section.name}`);
      
      // Check if the last topic in this section is a Quiz
      const lastTopic = section.topics[section.topics.length - 1];
      const isLastTopicQuiz = lastTopic && lastTopic.type === 'quiz';
      const isLastSection = index === sections.length - 1;
      
      // If last topic is Quiz, we need to handle it specially
      if (isLastTopicQuiz) {
        console.log(`  ⚠ Last topic in section is Quiz - will handle Preview Report and stop`);
      }
      
      try {
        await this.addSection(section);
      } catch (error) {
        // If Add Section button doesn't exist (after Quiz), handle Preview Report and stop
        if (error instanceof Error && error.message === 'PREVIEW_REPORT_CLICKED_STOP_TOPICS') {
          console.log('  ⚠ Add Section button not found - handling Preview Report and stopping');
          await this.handlePreviewReportAfterQuiz();
          console.log('✅ Stopped after Quiz - no more sections/topics will be added');
          return; // Skip remaining sections
        }
        // Otherwise, re-throw the error
        throw error;
      }
      
      // After adding section, check if Quiz was the last content
      // If so, handle Preview Report and stop (no more sections/topics)
      if (isLastTopicQuiz) {
        console.log('  ⚠ Quiz was the last content - handling Preview Report and stopping section/topic creation');
        await this.handlePreviewReportAfterQuiz();
        console.log('✅ Stopped after Quiz - no more sections/topics will be added');
        return; // Skip remaining sections
      }
      
      // Before adding next section, check if "Add Section" button exists
      // (It won't exist after Quiz)
      if (index < sections.length - 1) {
        const nextSectionButton = this.page
          .getByRole('button', { name: /Add Section/i })
          .or(this.page.getByText('Add Section', { exact: false }))
          .first();
        
        const buttonExists = await nextSectionButton.isVisible({ timeout: 3000 }).catch(() => false);
        if (!buttonExists) {
          console.log('  ⚠ Add Section button not found - Quiz was likely the last content. Stopping.');
          return; // Stop if button doesn't exist
        }
      }
    }

    console.log('✅ All sections and topics added');
  }

  /**
   * Add an additional quiz topic after all sections are saved
   * This is called after saving the course to add a new quiz topic
   */
  async addAdditionalQuizTopic() {
    console.log('➡ Adding additional quiz topic: Playwright Basics Quiz...');

    // Playwright quiz questions (2 questions with 2 options each)
    const playwrightQuizQuestions = [
      {
        questionText: 'What is Playwright primarily used for?',
        options: [
          'Web automation testing',
          'Graphic design'
        ],
        correctOptionIndex: 0
      },
      {
        questionText: 'Which languages can you write Playwright tests in?',
        options: [
          'JavaScript / TypeScript',
          'PHP'
        ],
        correctOptionIndex: 0
      }
    ];

    // Check if page is still open (might be closed after Preview Report)
    try {
      await this.page.evaluate(() => document.title);
    } catch (error) {
      console.log('  ⚠ Page is closed (likely after Preview Report) - skipping additional quiz topic');
      return; // Skip if page is closed
    }

    // Find the first section container to add the topic to (or create a new section)
    // For simplicity, we'll try to find an existing section or click "Add Topic" if available
    await this.page.waitForTimeout(1000);

    // Click "Add Topic" button (should be visible after sections are added)
    const addTopicButton = this.page
      .getByRole('button', { name: /Add Topic/i })
      .or(this.page.getByText('Add Topic', { exact: false }))
      .first();

    const addTopicButtonVisible = await addTopicButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!addTopicButtonVisible) {
      // If "Add Topic" is not visible, try to find any section and add topic to it
      // Or click "Add Section" first
      const addSectionButton = this.page
        .getByRole('button', { name: /Add Section/i })
        .or(this.page.getByText('Add Section', { exact: false }))
        .first();
      
      const sectionButtonVisible = await addSectionButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (sectionButtonVisible) {
        console.log('  - Clicking "Add Section" to create a new section for the quiz...');
        await addSectionButton.click();
        await this.page.waitForTimeout(1500);
        
        // Fill section name (use existing section name from first section or create new)
        const sectionNameInput = this.page.locator('input[placeholder*="Section" i]').last();
        await sectionNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await sectionNameInput.fill('Quiz Section');
        await this.page.waitForTimeout(500);
        console.log('  ✓ Created new section: Quiz Section');
      }
    }

    // Now click "Add Topic"
    await addTopicButton.waitFor({ state: 'visible', timeout: 15000 });
    await addTopicButton.waitFor({ state: 'attached', timeout: 10000 });
    
    // Check if button is enabled
    const isAddTopicEnabled = await addTopicButton.isEnabled().catch(() => false);
    if (!isAddTopicEnabled) {
      console.log('  ⚠ Add Topic button is disabled, waiting for it to be enabled...');
      await this.page.waitForTimeout(2000);
    }
    
    await addTopicButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Try to click with multiple strategies
    try {
      await addTopicButton.click({ timeout: 10000 });
      console.log('  ✓ Clicked "Add Topic" button');
    } catch (clickError) {
      // If normal click fails, try force click
      console.log('  ⚠ Normal click failed, trying force click...');
      await addTopicButton.click({ force: true, timeout: 10000 });
      console.log('  ✓ Force clicked "Add Topic" button');
    }
    
    await this.page.waitForTimeout(1000);

    // Find the section container (for scoping)
    const sectionContainer = this.page.locator('*').filter({ hasText: /Section/i }).first();

    // Add the quiz topic with full details
    await this.addTopicWithQuizDetails(
      sectionContainer,
      'playwright t',
      playwrightQuizQuestions,
      {
        quizTitle: 'Playwright Basics Quiz',
        duration: 15,
        passingCriteria: 20,
        enableAIReport: true
      }
    );

    console.log('✅ Additional quiz topic added successfully');
  }

  async addSection(sectionData) {
    // Check if "Add Section" button exists before trying to click it
    // (It won't exist after Quiz content)
    const addSectionButton = this.page
      .getByRole('button', { name: /Add Section/i })
      .or(this.page.getByText('Add Section', { exact: false }))
      .first();
    
    const buttonExists = await addSectionButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (!buttonExists) {
      console.log('  ⚠ Add Section button not found - Quiz was likely the last content. Skipping section creation.');
      throw new Error('PREVIEW_REPORT_CLICKED_STOP_TOPICS'); // Use same error to signal stop
    }
    
    await addSectionButton.waitFor({ state: 'visible', timeout: 10000 });
    await addSectionButton.scrollIntoViewIfNeeded();
    await addSectionButton.click();

    // Wait for the section input to appear after clicking "Add Section"
    // The input might appear immediately or after a delay
    await this.page.waitForTimeout(1500); // Increased wait time
    
    // Try multiple selector strategies for the section input
    // Try different placeholder variations
    let sectionNameInput;
    let inputFound = false;
    
    // Strategy 1: Try placeholder containing "Section" (last one - most recent)
    try {
      sectionNameInput = this.page.locator('input[placeholder*="Section" i]').last();
      await sectionNameInput.waitFor({ state: 'visible', timeout: 5000 });
      inputFound = true;
      console.log('  ✓ Found section input using placeholder "Section" (last)');
    } catch (e) {
      // Strategy 2: Try placeholder containing "Section" (first one)
      try {
        sectionNameInput = this.page.locator('input[placeholder*="Section" i]').first();
        await sectionNameInput.waitFor({ state: 'visible', timeout: 5000 });
        inputFound = true;
        console.log('  ✓ Found section input using placeholder "Section" (first)');
      } catch (e2) {
        // Strategy 3: Try finding any empty input near "Add Section" button or in the sections area
        try {
          // Look for input that appears after clicking Add Section - might not have specific placeholder
          const allInputs = this.page.locator('input[type="text"]');
          const inputCount = await allInputs.count();
          if (inputCount > 0) {
            // Get the last text input (most recently added)
            sectionNameInput = allInputs.last();
            await sectionNameInput.waitFor({ state: 'visible', timeout: 5000 });
            inputFound = true;
            console.log('  ✓ Found section input using generic text input (last)');
          }
        } catch (e3) {
          console.log('  ⚠ Could not find section input with any strategy');
        }
      }
    }
    
    if (!inputFound) {
      throw new Error('Section input field not found after clicking "Add Section" button');
    }
    
    await sectionNameInput.waitFor({ state: 'attached', timeout: 5000 });
    await sectionNameInput.fill(sectionData.name);
    
    // Wait a moment after filling section name for UI to update
    await this.page.waitForTimeout(500);
    
    console.log(`  ✓ Section name filled: ${sectionData.name}`);

    // Find the section container
    const sectionContainer = sectionNameInput
      .locator('xpath=ancestor::*[contains(@class,"section") or contains(.,"Section")][1]');
    
    // Click "Add Topic" button after filling section name (before adding topics)
    console.log('  - Clicking "Add Topic" button...');
    const addTopicButton = sectionContainer
      .getByRole('button', { name: /Add Topic/i })
      .or(sectionContainer.getByText('Add Topic', { exact: false }))
      .or(this.page.getByRole('button', { name: /Add Topic/i }).first())
      .first();
    
    await addTopicButton.waitFor({ state: 'visible', timeout: 10000 });
    await addTopicButton.scrollIntoViewIfNeeded();
    await addTopicButton.click();
    await this.page.waitForTimeout(1000); // Wait longer for topic form to appear
    console.log('  ✓ Clicked "Add Topic" button');

    // Now loop through and add topics
    for (const [topicIndex, topic] of sectionData.topics.entries()) {
      console.log(`    - Adding Topic ${topicIndex + 1}: ${topic.title}`);
      
      // Check if this is a Quiz topic - if so, handle it specially
      const isQuiz = topic.type === 'quiz';
      const isLastTopic = topicIndex === sectionData.topics.length - 1;
      
      // If this is not the first topic, click "Add Topic" again to create a new topic slot
      // BUT: Skip this if the previous content was a Quiz (no Add Topic button exists after Quiz)
      if (topicIndex > 0) {
        // Check if previous topic was a quiz - if so, don't try to add more topics
        const previousTopic = sectionData.topics[topicIndex - 1];
        if (previousTopic.type === 'quiz') {
          console.log('    ⚠ Previous topic was Quiz - skipping further topic addition');
          break; // Stop adding more topics after Quiz
        }
        
        console.log(`    - Clicking "Add Topic" for topic ${topicIndex + 1}...`);
        const nextAddTopicButton = sectionContainer
          .getByRole('button', { name: /Add Topic/i })
          .or(sectionContainer.getByText('Add Topic', { exact: false }))
          .first();
        
        // Check if Add Topic button exists (it won't exist after Quiz)
        const buttonExists = await nextAddTopicButton.isVisible({ timeout: 3000 }).catch(() => false);
        if (!buttonExists) {
          console.log('    ⚠ Add Topic button not found - Quiz was likely the last content. Stopping.');
          break; // Stop if button doesn't exist
        }
        
        await nextAddTopicButton.waitFor({ state: 'visible', timeout: 5000 });
        await nextAddTopicButton.scrollIntoViewIfNeeded();
        await nextAddTopicButton.click();
        await this.page.waitForTimeout(500); // Wait for new topic form to appear
        console.log(`    ✓ Clicked "Add Topic" for topic ${topicIndex + 1}`);
      }
      
      // Check topic type and call appropriate method
      try {
        if (isQuiz) {
          await this.addTopicWithQuiz(sectionContainer, topic.title, topic.questions);
          
          // If Quiz is the last topic, handle Preview Report and stop
          if (isLastTopic) {
            console.log('    ⚠ Quiz is the last topic - handling Preview Report and stopping');
            await this.handlePreviewReportAfterQuiz();
            break; // Stop after Quiz
          }
        } else {
          await this.addTopicWithVideo(sectionContainer, topic.title, topic.videoUrl);
          
          // Pehli baar report close hone ke baad automatically quiz topic add nahi hota
          // (User ne request ki thi ke pehli baar report close hone ke baad koi bhi aur sections/topics/questions add na hon)
        }
      } catch (error) {
        // Agar Preview Report close ho chuki hai, to topics add karna band karein
        if (error instanceof Error && error.message === 'PREVIEW_REPORT_CLICKED_STOP_TOPICS') {
          console.log('    ⚠ Preview Report close ho chuki hai - topics add karna band kar rahe hain');
          break; // Topic loop se bahar nikalein
        }
        // Warna error ko re-throw karein
        throw error;
      }
    }
    
    // Agar preview report close ho chuki hai, to section add karna band karein
    // Check karein ke kya "Add Section" button abhi bhi available hai
    const addSectionButtonAfterTopics = this.page
      .getByRole('button', { name: /Add Section/i })
      .or(this.page.getByText('Add Section', { exact: false }))
      .first();
    
    const buttonStillExists = await addSectionButtonAfterTopics.isVisible({ timeout: 2000 }).catch(() => false);
    if (!buttonStillExists) {
      console.log('  ⚠ Add Section button nahi mila - Preview Report close ho chuki hai. Section add karna band kar rahe hain.');
      throw new Error('PREVIEW_REPORT_CLICKED_STOP_TOPICS'); // Signal to stop adding more sections
    }
  }
  
  /**
   * AI Report Preview Modal ko close karein
   * Ye method "Preview Report" button par click karne ke baad open hone wale modal ko close karta hai
   */
  async closeAIReportPreviewModal() {
    console.log('      - AI Report Preview Modal ko close kar rahe hain...');
    
    try {
      // Modal ke fully render hone ka wait karein
      await this.page.waitForTimeout(2000);
      
      // Strategy 1: Multiple selectors use karke close button find karke click karein
      const closeButtonSelectors = [
        '//span[@class = "anticon ant-modal-close-icon anticon-close ng-star-inserted"]',
        '//button[contains(@class, "ant-modal-close")]',
        '//span[contains(@class, "anticon-close")]',
        '.ant-modal-close',
        'button[aria-label="Close"]',
        '[class*="modal-close"]',
        'button:has-text("Close")',
        '.anticon-close',
        '[aria-label="Close"]',
        'button.ant-modal-close'
      ];
      
      let modalClosed = false;
      
      for (const selector of closeButtonSelectors) {
        try {
          const closeButton = this.page.locator(selector).first();
          const isVisible = await closeButton.isVisible({ timeout: 5000 }).catch(() => false);
          
          if (isVisible) {
            await closeButton.waitFor({ state: 'visible', timeout: 10000 });
            await closeButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(1000);
            try {
              // Pehle hover karein, phir click karein
              await closeButton.hover();
              await this.page.waitForTimeout(300);
              await closeButton.click();
              console.log(`      ✓ AI Report Preview Modal close ho gaya selector use karke: ${selector}`);
              modalClosed = true;
              await this.page.waitForTimeout(2000);
              break;
            } catch (clickError) {
              console.log(`      ⚠ Close button par click nahi kar paye: ${clickError instanceof Error ? clickError.message : clickError}`);
              // Force click try karein
              try {
                await closeButton.click({ force: true });
                console.log(`      ✓ Force click se modal close ho gaya`);
                modalClosed = true;
                await this.page.waitForTimeout(2000);
                break;
              } catch (forceError) {
                // Continue to next selector
                continue;
              }
            }
          }
        } catch (e) {
          // Agle selector par jao
          continue;
        }
      }
      
      // Strategy 2: Agar close button nahi mila, to Escape key press karein
      if (!modalClosed) {
        console.log('      - Escape key press kar rahe hain...');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(2000);
        // Check karein ke modal close hua ya nahi
        const reportText = this.page.getByText('Assessment Report', { exact: false });
        const stillVisible = await reportText.isVisible({ timeout: 2000 }).catch(() => false);
        if (!stillVisible) {
          console.log('      ✓ AI Report Preview Modal Escape key se close ho gaya');
          modalClosed = true;
        } else {
          console.log('      ⚠ Escape key se modal close nahi hua');
        }
      }
      
      // Strategy 3: Agar abhi bhi close nahi hua, to modal ke bahar (overlay/mask) par click karein
      if (!modalClosed) {
        try {
          console.log('      - Modal overlay par click kar rahe hain...');
          const modalOverlay = this.page.locator('.ant-modal-mask, .ant-modal-wrap, [class*="modal-mask"]').first();
          const overlayVisible = await modalOverlay.isVisible({ timeout: 5000 }).catch(() => false);
          
          if (overlayVisible) {
            // Overlay par (modal content ke bahar) click karke close karein
            await modalOverlay.click({ position: { x: 10, y: 10 } });
            await this.page.waitForTimeout(2000);
            // Verify karein
            const reportText = this.page.getByText('Assessment Report', { exact: false });
            const stillVisible = await reportText.isVisible({ timeout: 2000 }).catch(() => false);
            if (!stillVisible) {
              console.log('      ✓ AI Report Preview Modal overlay par click karke close ho gaya');
              modalClosed = true;
            }
          }
        } catch (e) {
          console.log('      ⚠ Overlay par click karke modal close nahi kar paye');
        }
      }
      
      // Strategy 4: JavaScript use karke modal ko force remove karein (last resort)
      if (!modalClosed) {
        try {
          console.log('      - JavaScript se modal force remove kar rahe hain...');
          await this.page.evaluate(() => {
            // Modal overlays ko remove karein
            const overlays = document.querySelectorAll('.ant-modal-wrap, .ant-modal-mask, .cdk-overlay-container .ant-modal-wrap, [class*="modal-wrap"], [class*="ant-modal"]');
            overlays.forEach((overlay) => {
              overlay.style.display = 'none';
              overlay.remove();
            });
            
            // Modal backdrop ko remove karein
            const backdrops = document.querySelectorAll('.ant-modal-mask, [class*="modal-mask"], [class*="ant-modal-mask"]');
            backdrops.forEach((backdrop) => {
              backdrop.style.display = 'none';
              backdrop.remove();
            });
            
            // Modal body ko bhi hide karein
            const modalBodies = document.querySelectorAll('.ant-modal-body, [class*="modal-body"]');
            modalBodies.forEach((body) => {
              body.style.display = 'none';
            });
          });
          await this.page.waitForTimeout(2000);
          console.log('      ✓ AI Report Preview Modal JavaScript se force remove ho gaya');
          modalClosed = true;
        } catch (e) {
          console.log('      ⚠ JavaScript se modal force close nahi kar paye');
        }
      }
      
      // Modal close ho gaya hai ya nahi verify karein - "Assessment Report" text hidden hai ya nahi check karein
      try {
        const reportText = this.page.getByText('Assessment Report', { exact: false });
        await reportText.waitFor({ state: 'hidden' }, { timeout: 5000 }).catch(() => {});
        console.log('      ✓ AI Report Preview Modal close ho gaya verify ho gaya');
      } catch (e) {
        console.log('      ⚠ Modal closure verify nahi kar paye, lekin continue kar rahe hain...');
      }
      
      // Report close hone ke baad section button par click karein
      try {
        console.log('      - Report close hone ke baad section button par click kar rahe hain...');
        const sectionButton = this.page.locator('//button[@class = "ant-btn addSectionBtn ant-btn-primary ant-btn-background-ghost"]');
        await sectionButton.waitFor({ state: 'visible', timeout: 10000 });
        await sectionButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await sectionButton.click();
        console.log('      ✓ Section button par click kar diya');
        await this.page.waitForTimeout(1000);
      } catch (e) {
        console.log(`      ⚠ Section button par click nahi kar paye: ${e instanceof Error ? e.message : e}`);
      }
      
      return true;
    } catch (error) {
      console.log(`      ⚠ AI Report Preview Modal close karne mein error: ${error instanceof Error ? error.message : error}`);
      // Fallback ke taur par force close try karein
      try {
        await this.page.evaluate(() => {
          const overlays = document.querySelectorAll('.ant-modal-wrap, .ant-modal-mask, [class*="modal-wrap"]');
          overlays.forEach((overlay) => {
            overlay.style.display = 'none';
            overlay.remove();
          });
        });
        await this.page.waitForTimeout(1000);
        console.log('      ✓ Fallback ke taur par modal force close ho gaya');
      } catch (e) {
        console.log('      ⚠ Fallback se bhi modal force close nahi kar paye');
      }
      return false;
    }
  }

  /**
   * Handle Preview Report after Quiz topic is added (when Quiz is the last content)
   */
  async handlePreviewReportAfterQuiz() {
    console.log('      - Handling Preview Report for Quiz...');
    
    try {
      // Click Preview Report button
      const previewReportButton = this.page.getByRole('button', { name: 'Preview Report', exact: false })
        .or(this.page.locator('button:has-text("Preview Report")'))
        .or(this.page.locator('button:has-text("preview report")'))
        .first();
      
      const previewButtonVisible = await previewReportButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (previewButtonVisible) {
        // Wait for button to be visible, attached, and enabled
        await previewReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await previewReportButton.waitFor({ state: 'attached', timeout: 10000 });
        
        // Check if button is enabled
        const isEnabled = await previewReportButton.isEnabled().catch(() => false);
        if (!isEnabled) {
          console.log('      ⚠ Preview Report button is disabled, waiting for it to be enabled...');
          await this.page.waitForTimeout(2000);
        }
        
        await previewReportButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        
        // Try to click the button with multiple strategies
        try {
          // First try normal click
          await previewReportButton.click({ timeout: 10000 });
          console.log('      ✓ Clicked "Preview Report" button and waiting for page to load...');
        } catch (clickError) {
          // If normal click fails, try force click
          console.log('      ⚠ Normal click failed, trying force click...');
          await previewReportButton.click({ force: true, timeout: 10000 });
          console.log('      ✓ Force clicked "Preview Report" button and waiting for page to load...');
        }
        
        // Wait for the report to fully load and display (use 'load' instead of 'networkidle' for better reliability)
        await this.page.waitForLoadState('load', { timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        
        // Report content ka wait karein
        await this.page.getByText('Assessment Report', { exact: false }).waitFor({ state: 'visible', timeout: 15000 });
        console.log('      ✓ Preview Report load ho gaya aur display ho gaya');
        
        // Dedicated method use karke preview report ko close karein
        await this.closeAIReportPreviewModal();
      } else {
        console.log('      ⚠ Preview Report button not found');
      }
    } catch (error) {
      console.log(`      ⚠ Error handling Preview Report: ${error instanceof Error ? error.message : error}`);
    }
  }

  async addTopicWithVideo(sectionContainer, topicTitle, videoUrl) {
    // Note: "Add Topic" button is clicked before this method is called
    // Step 1: Write the topic name
    console.log(`      - Writing topic name: ${topicTitle}`);
    
    // Try multiple strategies to find the topic name input
    // The placeholder might be "Enter topic 1", "Enter topic", "Topic name", etc.
    let topicNameInput;
    let inputFound = false;
    
    // Strategy 1: Look for "Enter topic" placeholder (most specific)
    try {
      topicNameInput = this.page.locator('input[placeholder*="Enter topic" i]').last();
      await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
      inputFound = true;
      console.log('      ✓ Found topic input using "Enter topic" placeholder');
    } catch (e) {
      // Strategy 2: Look for any input with "Topic" in placeholder within section
      try {
        topicNameInput = sectionContainer
          .locator('input[placeholder*="Topic" i]')
          .last();
        await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
        inputFound = true;
        console.log('      ✓ Found topic input using "Topic" placeholder in section');
      } catch (e2) {
        // Strategy 3: Look for any input with "Topic" on the page
        try {
          topicNameInput = this.page.locator('input[placeholder*="Topic" i]').last();
          await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
          inputFound = true;
          console.log('      ✓ Found topic input using "Topic" placeholder on page');
        } catch (e3) {
          // Strategy 4: Look for textbox in section (fallback)
          try {
            topicNameInput = sectionContainer.locator('textbox').last();
            await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
            inputFound = true;
            console.log('      ✓ Found topic input using textbox locator');
          } catch (e4) {
            console.log('      ⚠ Could not find topic input with any strategy');
          }
        }
      }
    }
    
    if (!inputFound) {
      throw new Error('Topic name input field not found after clicking "Add Topic" button');
    }
    
    await topicNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await topicNameInput.scrollIntoViewIfNeeded();
    await topicNameInput.fill(topicTitle);
    await this.page.waitForTimeout(500); // Wait for UI to update after filling name
    console.log(`      ✓ Topic name written: ${topicTitle}`);

    // Step 2: Find topic container for scoping
    // The topic container might be the button that contains the topic name input
    // Try multiple strategies to find the container
    let topicContainer;
    try {
      // Strategy 1: Find ancestor button that contains the topic name
      topicContainer = topicNameInput.locator('xpath=ancestor::button[1]');
      const containerCount = await topicContainer.count().catch(() => 0);
      if (containerCount === 0) {
        throw new Error('No button ancestor found');
      }
    } catch (e) {
      // Strategy 2: Find ancestor with topic in class or text
      topicContainer = topicNameInput.locator('xpath=ancestor::*[contains(@class,"topic") or contains(.,"Topic")][1]');
    }

    // Step 3: Click "Add Content" button
    console.log('      - Clicking "Add Content" button...');
    
    // Try multiple strategies to find the "Add Content" button
    let addContentButton;
    let buttonFound = false;
    
    // Strategy 1: Look for "Add content" button using span with ng-star-inserted class
    try {
      // The button contains a span with "Add content" text
      addContentButton = topicContainer
        .locator('button:has(span.ng-star-inserted:has-text("Add content"))')
        .or(topicContainer.locator('button:has-text("Add content")'))
        .first();
      const buttonCount = await addContentButton.count().catch(() => 0);
      if (buttonCount > 0) {
        const isVisible = await addContentButton.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          buttonFound = true;
          console.log('      ✓ Found "Add content" button in topic container');
        }
      }
    } catch (e) {
      // Continue to next strategy
    }
    
    // Strategy 2: Look for "Add content" button near the topic input using XPath (case-insensitive)
    if (!buttonFound) {
      try {
        addContentButton = topicNameInput
          .locator('xpath=following::button[contains(., "Add content") or contains(., "Add Content")][1]')
          .or(this.page.getByRole('button', { name: /Add content/i }).first());
        const buttonCount = await addContentButton.count().catch(() => 0);
        if (buttonCount > 0) {
          const isVisible = await addContentButton.isVisible({ timeout: 3000 }).catch(() => false);
          if (isVisible) {
            buttonFound = true;
            console.log('      ✓ Found "Add content" button near topic input');
          }
        }
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    // Strategy 3: Look for button containing span with "Add content" text on the page
    if (!buttonFound) {
      try {
        addContentButton = this.page
          .locator('button:has(span.ng-star-inserted:has-text("Add content"))')
          .or(this.page.locator('button:has-text("Add content")'))
          .first();
        const buttonCount = await addContentButton.count().catch(() => 0);
        if (buttonCount > 0) {
          buttonFound = true;
          console.log('      ✓ Found "Add content" button on page using span selector');
        }
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    // Strategy 4: Look for any "Add content" button on the page (fallback - case-insensitive)
    if (!buttonFound) {
      addContentButton = this.page
        .getByRole('button', { name: /Add content/i })
        .or(this.page.getByText('Add content', { exact: false }))
        .first();
      const buttonCount = await addContentButton.count().catch(() => 0);
      if (buttonCount > 0) {
        buttonFound = true;
        console.log('      ✓ Found "Add content" button on page (fallback)');
      }
    }
    
    if (!buttonFound) {
      throw new Error('"Add Content" button not found after filling topic name');
    }
    
    await addContentButton.waitFor({ state: 'visible', timeout: 10000 });
    await addContentButton.scrollIntoViewIfNeeded();
    await addContentButton.click();
    await this.page.waitForTimeout(500); // Wait for content options to appear
    console.log('      ✓ Clicked "Add Content" button');

    // Step 4: Choose "Video" option
    console.log('      - Choosing Video option...');
    const videoOption = this.page
      .getByText('Video', { exact: false })
      .or(this.page.getByRole('button', { name: /Video/i }))
      .first();
    
    await videoOption.waitFor({ state: 'visible', timeout: 10000 });
    await videoOption.scrollIntoViewIfNeeded();
    await videoOption.click();
    await this.page.waitForTimeout(500); // Wait for video input to appear
    console.log('      ✓ Video option selected');

    // Step 5: Fill video URL
    console.log(`      - Filling video URL: ${videoUrl}`);
    const videoUrlInput = this.page
      .locator('input[placeholder*="URL" i], input[placeholder*="link" i]')
      .first();
    
    await videoUrlInput.waitFor({ state: 'visible', timeout: 10000 });
    await videoUrlInput.scrollIntoViewIfNeeded();
    await videoUrlInput.fill(videoUrl);
    await this.page.waitForTimeout(300);
    console.log(`      ✓ Video URL filled`);

    // Step 6: Click "Add" button to add the video
    console.log('      - Clicking "Add" button to add video...');
    const addButton = this.page
      .getByRole('button', { name: /^Add$/i })
      .or(this.page.getByText(/^Add$/i))
      .first();
    
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();
    await this.page.waitForTimeout(500); // Wait for video to be added
    console.log('      ✓ Video added successfully');

    // Wait for UI to update after adding video (input may remain visible, which is fine)
    // Give time for video to process and thumbnail section to appear
    await this.page.waitForTimeout(2000);
    
    // Add thumbnail for the video (similar to CreateTestPage)
    console.log(`      - Uploading thumbnail for video: ${topicTitle}`);
    await this.uploadVideoThumbnail(topicContainer);
    
    // Click "Save" button after adding video and thumbnail
    console.log(`      - Clicking Save button for topic: ${topicTitle}`);
    const saveButton = topicContainer
      .locator('button:has-text("Save")')
      .or(this.page.locator('button:has-text("Save"):not(:has-text("Save as"))'))
      .first();
    const saveButtonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (saveButtonVisible) {
      await saveButton.scrollIntoViewIfNeeded();
      await saveButton.click();
      await this.page.waitForTimeout(500); // Wait for save to complete
      console.log(`      ✓ Saved topic: ${topicTitle}`);
      
      // Wait a few seconds after saving video (as requested by user)
      console.log(`      - Waiting after saving video (no file explorer will open)...`);
      await this.page.waitForTimeout(3000); // Wait 3 seconds
      
      // Pehli baar report close hone ke baad automatically quiz topic add nahi karein
      // (User ne request ki thi ke pehli baar report close hone ke baad koi bhi aur sections/topics/questions add na hon)
    } else {
      console.log(`      ⚠ Save button not found for topic: ${topicTitle}, continuing...`);
    }
  }

  /**
   * Add quiz topic automatically after saving a video topic
   */
  async addQuizTopicAfterVideo(sectionContainer) {
    console.log('      ➡ Automatically adding quiz topic after video save...');
    
    // Playwright quiz questions (2 questions with 2 options each)
    const playwrightQuizQuestions = [
      {
        questionText: 'What is Playwright primarily used for?',
        options: [
          'Web automation testing',
          'Graphic design'
        ],
        correctOptionIndex: 0
      },
      {
        questionText: 'Which languages can you write Playwright tests in?',
        options: [
          'JavaScript / TypeScript',
          'PHP'
        ],
        correctOptionIndex: 0
      }
    ];

    try {
      // Click "Add Topic" button (should be visible after saving video)
      console.log('      - Clicking "Add Topic" button for quiz...');
      const addTopicButton = sectionContainer
        .getByRole('button', { name: /Add Topic/i })
        .or(sectionContainer.getByText('Add Topic', { exact: false }))
        .or(this.page.getByRole('button', { name: /Add Topic/i }))
        .first();
      
      await addTopicButton.waitFor({ state: 'visible', timeout: 10000 });
      await addTopicButton.scrollIntoViewIfNeeded();
      await addTopicButton.click();
      await this.page.waitForTimeout(1000); // Wait for topic form to appear
      console.log('      ✓ Clicked "Add Topic" button');

      // Add the quiz topic with full details
      await this.addTopicWithQuizDetails(
        sectionContainer,
        'playwright t',
        playwrightQuizQuestions,
        {
          quizTitle: 'Playwright Basics Quiz',
          duration: 15,
          passingCriteria: 20,
          enableAIReport: true
        }
      );

      console.log('      ✅ Quiz topic added successfully after video save');
    } catch (error) {
      // If Preview Report was clicked, re-throw to stop adding more topics
      if (error instanceof Error && error.message === 'PREVIEW_REPORT_CLICKED_STOP_TOPICS') {
        throw error; // Re-throw to signal that we should stop adding topics
      }
      console.log(`      ⚠ Could not add quiz topic after video: ${error instanceof Error ? error.message : error}`);
      // Don't throw - continue even if quiz topic addition fails (unless it's the Preview Report signal)
    }
  }
  
  /**
   * Add a topic with quiz content (simplified version - no quiz details)
   */
  async addTopicWithQuiz(sectionContainer, topicTitle, questions) {
    await this.addTopicWithQuizDetails(sectionContainer, topicTitle, questions, null);
  }

  /**
   * Add a topic with quiz content and full quiz details (duration, passing criteria, quiz title, AI report)
   */
  async addTopicWithQuizDetails(sectionContainer, topicTitle, questions, quizDetails) {
    // Note: "Add Topic" button is clicked before this method is called
    // Step 1: Write the topic name
    console.log(`      - Writing topic name: ${topicTitle}`);
    
    // Try multiple strategies to find the topic name input (same as video topics)
    let topicNameInput;
    let inputFound = false;
    
    try {
      topicNameInput = this.page.locator('input[placeholder*="Enter topic" i]').last();
      await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
      inputFound = true;
    } catch (e) {
      try {
        topicNameInput = sectionContainer.locator('input[placeholder*="Topic" i]').last();
        await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
        inputFound = true;
      } catch (e2) {
        try {
          topicNameInput = this.page.locator('input[placeholder*="Topic" i]').last();
          await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
          inputFound = true;
        } catch (e3) {
          try {
            topicNameInput = sectionContainer.locator('textbox').last();
            await topicNameInput.waitFor({ state: 'visible', timeout: 5000 });
            inputFound = true;
          } catch (e4) {
            console.log('      ⚠ Could not find topic input with any strategy');
          }
        }
      }
    }
    
    if (!inputFound) {
      throw new Error('Topic name input field not found after clicking "Add Topic" button');
    }
    
    await topicNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await topicNameInput.scrollIntoViewIfNeeded();
    await topicNameInput.fill(topicTitle);
    await this.page.waitForTimeout(500);
    console.log(`      ✓ Topic name written: ${topicTitle}`);

    // Step 2: Find topic container for scoping
    let topicContainer;
    try {
      topicContainer = topicNameInput.locator('xpath=ancestor::button[1]');
      const containerCount = await topicContainer.count().catch(() => 0);
      if (containerCount === 0) {
        throw new Error('No button ancestor found');
      }
    } catch (e) {
      topicContainer = topicNameInput.locator('xpath=ancestor::*[contains(@class,"topic") or contains(.,"Topic")][1]');
    }

    // Step 3: Click "Add Content" button
    console.log('      - Clicking "Add Content" button...');
    
    let addContentButton;
    let buttonFound = false;
    
    try {
      addContentButton = topicContainer
        .locator('button:has(span.ng-star-inserted:has-text("Add content"))')
        .or(topicContainer.locator('button:has-text("Add content")'))
        .first();
      const buttonCount = await addContentButton.count().catch(() => 0);
      if (buttonCount > 0) {
        const isVisible = await addContentButton.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          buttonFound = true;
        }
      }
    } catch (e) {
      // Continue to next strategy
    }
    
    if (!buttonFound) {
      try {
        addContentButton = topicNameInput
          .locator('xpath=following::button[contains(., "Add content") or contains(., "Add Content")][1]')
          .or(this.page.getByRole('button', { name: /Add content/i }).first());
        const buttonCount = await addContentButton.count().catch(() => 0);
        if (buttonCount > 0) {
          const isVisible = await addContentButton.isVisible({ timeout: 3000 }).catch(() => false);
          if (isVisible) {
            buttonFound = true;
          }
        }
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    if (!buttonFound) {
      try {
        addContentButton = this.page
          .locator('button:has(span.ng-star-inserted:has-text("Add content"))')
          .or(this.page.locator('button:has-text("Add content")'))
          .first();
        const buttonCount = await addContentButton.count().catch(() => 0);
        if (buttonCount > 0) {
          buttonFound = true;
        }
      } catch (e) {
        // Continue to next strategy
      }
    }
    
    if (!buttonFound) {
      addContentButton = this.page
        .getByRole('button', { name: /Add content/i })
        .or(this.page.getByText('Add content', { exact: false }))
        .first();
      const buttonCount = await addContentButton.count().catch(() => 0);
      if (buttonCount > 0) {
        buttonFound = true;
      }
    }
    
    if (!buttonFound) {
      throw new Error('"Add Content" button not found after filling topic name');
    }
    
    await addContentButton.waitFor({ state: 'visible', timeout: 10000 });
    await addContentButton.scrollIntoViewIfNeeded();
    await addContentButton.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked "Add Content" button');

    // Step 4: Choose "Quiz" option instead of "Video"
    console.log('      - Choosing Quiz option...');
    const quizOption = this.page
      .getByText('Quiz', { exact: false })
      .or(this.page.getByRole('button', { name: /Quiz/i }))
      .first();
    
    await quizOption.waitFor({ state: 'visible', timeout: 10000 });
    await quizOption.scrollIntoViewIfNeeded();
    await quizOption.click();
    await this.page.waitForTimeout(1000); // Wait for quiz form to appear
    console.log('      ✓ Quiz option selected');

    // Step 4.5: Fill quiz details if provided (quiz title, duration, passing criteria)
    if (quizDetails) {
      console.log('      - Filling quiz details...');
      
      // Fill Quiz Title
      if (quizDetails.quizTitle) {
        console.log(`      - Setting Quiz Title: ${quizDetails.quizTitle}`);
        const quizTitleInput = this.page
          .getByPlaceholder(/Quiz title/i)
          .or(this.page.locator('input[placeholder*="Quiz Title" i]'))
          .or(this.page.locator('input[placeholder*="Title" i]').first());
        
        const quizTitleVisible = await quizTitleInput.isVisible({ timeout: 5000 }).catch(() => false);
        if (quizTitleVisible) {
          await quizTitleInput.waitFor({ state: 'visible', timeout: 10000 });
          await quizTitleInput.scrollIntoViewIfNeeded();
          await quizTitleInput.clear();
          await quizTitleInput.fill(quizDetails.quizTitle);
          await this.page.waitForTimeout(300);
          console.log(`      ✓ Quiz Title set: ${quizDetails.quizTitle}`);
        } else {
          console.log('      ⚠ Quiz Title input not found, skipping...');
        }
      }

      // Fill Quiz Duration
      if (quizDetails.duration !== undefined) {
        console.log(`      - Setting Quiz Duration: ${quizDetails.duration} minutes`);
        const quizDurationLabel = this.page.locator('text=/Quiz duration/i').first();
        const durationVisible = await quizDurationLabel.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (durationVisible) {
          await quizDurationLabel.waitFor({ state: 'visible', timeout: 10000 });
          await quizDurationLabel.scrollIntoViewIfNeeded();
          
          const quizDurationInput = quizDurationLabel.locator('xpath=following::input[@type="number"][1]').or(
            quizDurationLabel.locator('xpath=following::*[@role="spinbutton"][1]').locator('input').first()
          );
          
          await quizDurationInput.waitFor({ state: 'visible', timeout: 10000 });
          await quizDurationInput.scrollIntoViewIfNeeded();
          await quizDurationInput.clear();
          await quizDurationInput.fill(quizDetails.duration.toString());
          await this.page.waitForTimeout(500);
          console.log(`      ✓ Quiz Duration set to: ${quizDetails.duration} minutes`);
        } else {
          console.log('      ⚠ Quiz Duration field not found, skipping...');
        }
      }

      // Fill Passing Criteria
      if (quizDetails.passingCriteria !== undefined) {
        console.log(`      - Setting Passing Criteria: ${quizDetails.passingCriteria}%`);
        const passingCriteriaLabel = this.page.locator('text=/Passing criteria/i').first();
        const criteriaVisible = await passingCriteriaLabel.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (criteriaVisible) {
          await passingCriteriaLabel.waitFor({ state: 'visible', timeout: 10000 });
          await passingCriteriaLabel.scrollIntoViewIfNeeded();
          
          const passingCriteriaInput = passingCriteriaLabel.locator('xpath=following::input[@type="number"][1]').or(
            passingCriteriaLabel.locator('xpath=following::*[@role="spinbutton"][1]').locator('input').first()
          );
          
          await passingCriteriaInput.waitFor({ state: 'visible', timeout: 10000 });
          await passingCriteriaInput.scrollIntoViewIfNeeded();
          await passingCriteriaInput.clear();
          await passingCriteriaInput.fill(quizDetails.passingCriteria.toString());
          await this.page.waitForTimeout(500);
          console.log(`      ✓ Passing Criteria set to: ${quizDetails.passingCriteria}%`);
        } else {
          console.log('      ⚠ Passing Criteria field not found, skipping...');
        }
      }

      await this.page.waitForTimeout(500);
    }

    // Step 5: Add quiz questions
    console.log(`      - Adding ${questions.length} quiz questions...`);
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`      - Adding Question ${i + 1}/${questions.length}: "${question.questionText.substring(0, 50)}..."`);
      await this.addQuizQuestion(question, i === 0);
      await this.page.waitForTimeout(500); // Small delay between questions
    }
    console.log(`      ✓ Added all ${questions.length} quiz questions`);

    // Step 5.5: Scroll to section button and click it after questions are added
    console.log('      - Scrolling to section button and clicking it...');
    const sectionButton = this.page.locator('//button[@class = "ant-btn addSectionBtn ant-btn-primary ant-btn-background-ghost"]');
    await sectionButton.waitFor({ state: 'visible', timeout: 10000 });
    await sectionButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await sectionButton.click();
    console.log('      ✓ Clicked section button after adding questions');
    await this.page.waitForTimeout(1000);

    // Step 5.5.1: Click button in nz-switch after clicking section button
    console.log('      - Clicking button in nz-switch...');
    const switchButton = this.page.locator('//p[contains(text(),\'Section 2\')]/following::nz-switch[1]//button');
    await switchButton.waitFor({ state: 'visible', timeout: 10000 });
    await switchButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await switchButton.click();
    console.log('      ✓ Clicked button in nz-switch');
    await this.page.waitForTimeout(500);

    // Step 5.6: Enter input in section field after clicking section button
    console.log('      - Entering input in section field...');
    const sectionInput = this.page.locator('input[placeholder*="Section" i]').last();
    await sectionInput.waitFor({ state: 'visible', timeout: 10000 });
    await sectionInput.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await sectionInput.fill('New Section');
    console.log('      ✓ Entered input in section field');
    await this.page.waitForTimeout(500);

    // Step 5.7: Click Add topic button after entering section field
    console.log('      - Clicking Add topic button...');
    const addTopicButton = this.page.locator('//p[contains(text(),\'Section 2\')]//ancestor::div[contains(@class,\'content-center\')] //following::span[contains(text(),\'Add topic\')][1]');
    await addTopicButton.waitFor({ state: 'visible', timeout: 10000 });
    await addTopicButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await addTopicButton.click();
    console.log('      ✓ Clicked Add topic button');
    await this.page.waitForTimeout(1000);

    // Step 5.8: Slightly scroll down the page
    console.log('      - Slightly scrolling down the page...');
    await this.page.evaluate(() => {
      window.scrollBy(0, 200); // Scroll down by 200 pixels
    });
    await this.page.waitForTimeout(500);
    console.log('      ✓ Scrolled down the page');
    await this.page.waitForTimeout(500);

    // Step 5.9: Enter topic in topic field
    console.log('      - Entering topic in topic field...');
    const topicInput = this.page.locator('//input[@class=\'ant-input prompt-input topic-input font-color-blue ng-untouched ng-pristine ng-valid ng-star-inserted\']');
    await this.page.waitForTimeout(1000); // Wait for input to appear
    await topicInput.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await topicInput.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await topicInput.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await topicInput.fill('New Topic');
    await this.page.waitForTimeout(500);
    console.log('      ✓ Entered topic in topic field');
    await this.page.waitForTimeout(500);

    // Step 5.10: Click Add content button
    console.log('      - Clicking Add content button...');
    const addContentBtn = this.page.locator('//button[@class=\'ant-btn add-content-btn ant-btn-primary ant-btn-background-ghost ng-star-inserted\']');
    await this.page.waitForTimeout(1000); // Wait for button to appear
    await addContentBtn.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await addContentBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await addContentBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await addContentBtn.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked Add content button');
    await this.page.waitForTimeout(500);

    // Step 5.11: Slightly scroll down the page
    console.log('      - Slightly scrolling down the page...');
    await this.page.evaluate(() => {
      window.scrollBy(0, 200); // Scroll down by 200 pixels
    });
    await this.page.waitForTimeout(500);
    console.log('      ✓ Scrolled down the page');
    await this.page.waitForTimeout(500);

    // Step 5.12: Click on Article option
    console.log('      - Clicking on Article option...');
    const articleOption = this.page.locator('//p[text() = \' Article \']');
    await this.page.waitForTimeout(1000); // Wait for option to appear
    await articleOption.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await articleOption.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await articleOption.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await articleOption.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked on Article option');
    await this.page.waitForTimeout(500);

    // Step 5.13: Click on Add own article button
    console.log('      - Clicking on Add own article button...');
    const addOwnArticleBtn = this.page.locator('//button[@class=\'ant-btn own-article-btn font-color-blue ant-btn-primary ant-btn-background-ghost\']');
    await this.page.waitForTimeout(1000); // Wait for button to appear
    await addOwnArticleBtn.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await addOwnArticleBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await addOwnArticleBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await addOwnArticleBtn.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked on Add own article button');
    await this.page.waitForTimeout(500);

    // Step 5.14: Slightly scroll down the page
    console.log('      - Slightly scrolling down the page...');
    await this.page.evaluate(() => {
      window.scrollBy(0, 200); // Scroll down by 200 pixels
    });
    await this.page.waitForTimeout(500);
    console.log('      ✓ Scrolled down the page');
    await this.page.waitForTimeout(500);

    // Step 5.15: Enter 2-line article
    console.log('      - Entering 2-line article...');
    const placeholder = this.page.locator('//span[@class=\'angular-editor-placeholder\']');
    await this.page.waitForTimeout(1000); // Wait for editor to appear
    await placeholder.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await placeholder.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    
    // Find the actual editor element (contenteditable div or textarea) near the placeholder
    const articleEditor = placeholder.locator('xpath=following::div[@contenteditable="true"][1]')
      .or(placeholder.locator('xpath=preceding::div[@contenteditable="true"][1]'))
      .or(this.page.locator('.angular-editor-textarea[contenteditable="true"]').last())
      .or(this.page.locator('div[contenteditable="true"]').last())
      .first();
    
    await articleEditor.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await articleEditor.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await articleEditor.click();
    await this.page.waitForTimeout(300);
    
    // Enter 2-line article
    const articleText = 'This is the first line of the article.\nThis is the second line of the article.';
    await articleEditor.fill(articleText);
    await this.page.waitForTimeout(500);
    console.log('      ✓ Entered 2-line article');
    await this.page.waitForTimeout(500);

    // Step 5.16: Slightly scroll down the page
    console.log('      - Slightly scrolling down the page...');
    await this.page.evaluate(() => {
      window.scrollBy(0, 200); // Scroll down by 200 pixels
    });
    await this.page.waitForTimeout(500);
    console.log('      ✓ Scrolled down the page');
    await this.page.waitForTimeout(500);

    // Step 5.17: Click on Continue button
    console.log('      - Clicking on Continue button...');
    const continueButton = this.page.locator('//span[text() = \' Continue \']');
    await this.page.waitForTimeout(1000); // Wait for button to appear
    await continueButton.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await continueButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await continueButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await continueButton.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked on Continue button');
    await this.page.waitForTimeout(500);

    // Step 5.18: Wait for preview page to load
    console.log('      - Waiting for preview page to load...');
    await this.page.waitForLoadState('load', { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.page.waitForTimeout(2000); // Additional wait for page to fully render
    console.log('      ✓ Preview page loaded');

    // Step 5.19: Scroll down to bottom of page
    console.log('      - Scrolling down to bottom of page...');
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(1000);
    console.log('      ✓ Scrolled to bottom of page');
    await this.page.waitForTimeout(500);

    // Step 5.20: Click on Publish button
    console.log('      - Clicking on Publish button...');
    const publishButton = this.page.locator('//button[@class=\'ant-btn continueBtn ant-btn-primary ant-btn-background-ghost\']');
    await publishButton.waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    await publishButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await publishButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await publishButton.click();
    await this.page.waitForTimeout(500);
    console.log('      ✓ Clicked on Publish button');
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a single quiz question (similar to CreateTestPage.addQuestion)
   */
  async addQuizQuestion(question, isFirstQuestion) {
    // Step 1: Click "Add a question" button if not the first question
    if (!isFirstQuestion) {
      const addQuestionButton = this.page.getByText('Add a question', { exact: false })
        .or(this.page.locator('button:has-text("Add a question")'))
        .last();
      
      await addQuestionButton.waitFor({ state: 'visible', timeout: 10000 });
      await addQuestionButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await addQuestionButton.click();
      await this.page.waitForTimeout(1000);
      console.log('        ✓ Clicked "Add a question" button');
    }

    // Step 2: Find and fill the question text input
    const questionInput = this.page.getByPlaceholder('Let\'s ask a question').last();
    await questionInput.waitFor({ state: 'visible', timeout: 10000 });
    await questionInput.scrollIntoViewIfNeeded();
    await questionInput.fill(question.questionText);
    await this.page.waitForTimeout(500);
    console.log(`        ✓ Filled question text`);

    // Step 3: Find question section for scoping
    const questionSection = questionInput.locator('xpath=ancestor::*[contains(., "Question") or contains(@class, "question")][1]').or(
      questionInput.locator('xpath=ancestor::*[position()<=10]').last()
    );

    // Step 4: Add options
    const optionInputsInSection = questionSection.locator('input[placeholder*="Option" i]');
    let existingOptionCount = await optionInputsInSection.count().catch(() => 0);
    
    for (let i = 0; i < question.options.length; i++) {
      const optionText = question.options[i];
      
      let optionInput;
      const currentOptionCount = await optionInputsInSection.count().catch(() => 0);
      
      if (i < currentOptionCount) {
        optionInput = optionInputsInSection.nth(i);
      } else {
        const addOptionButton = questionSection.getByText('Add an option', { exact: false })
          .or(questionSection.locator('button:has-text("Add an option")'))
          .first();
        
        await addOptionButton.waitFor({ state: 'visible', timeout: 10000 });
        await addOptionButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await addOptionButton.click();
        await this.page.waitForTimeout(500);
        
        const updatedOptionInputs = questionSection.locator('input[placeholder*="Option" i]');
        const newCount = await updatedOptionInputs.count().catch(() => 0);
        optionInput = updatedOptionInputs.nth(newCount - 1);
      }
      
      await optionInput.waitFor({ state: 'visible', timeout: 10000 });
      await optionInput.scrollIntoViewIfNeeded();
      await optionInput.clear();
      await optionInput.fill(optionText);
      await this.page.waitForTimeout(300);
    }
    console.log(`        ✓ Added ${question.options.length} options`);

    // Step 5: Wait for answer buttons to appear
    await this.page.waitForTimeout(1000);

    // Step 6: Select the correct answer
    const answerLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const answerLetter = answerLetters[question.correctOptionIndex];
    
    const correctAnswerLabel = questionSection.getByText('Correct answer', { exact: false }).first();
    await correctAnswerLabel.waitFor({ state: 'visible', timeout: 10000 });
    
    const answerContainer = correctAnswerLabel.locator('xpath=following::*[1]');
    const answerSelector = answerContainer.getByText(answerLetter, { exact: true }).first();
    
    await answerSelector.waitFor({ state: 'visible', timeout: 15000 });
    await answerSelector.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await answerSelector.click();
    console.log(`        ✓ Selected correct answer: ${answerLetter}`);
    
    await this.page.waitForTimeout(500);
  }

  /**
   * Upload thumbnail for a video within a topic
   */
  async uploadVideoThumbnail(topicContainer) {
    try {
      // Wait a bit more for the thumbnail section to appear after video is added
      await this.page.waitForTimeout(500);
      
      // IMPORTANT: Do NOT click "Upload File" button as it opens file explorer
      // Instead, directly find and set the file input
      
      // Strategy 1: Look for file input within topic container (directly, no button click)
      console.log('      - Looking for thumbnail file input (without clicking buttons to avoid file explorer)...');
      const thumbnailInput = topicContainer.locator('input[type="file"]').first();
      const inputCount = await thumbnailInput.count().catch(() => 0);
      
      if (inputCount > 0) {
        const isAttached = await thumbnailInput.isAttached().catch(() => false);
        if (isAttached) {
          await thumbnailInput.scrollIntoViewIfNeeded();
          await thumbnailInput.setInputFiles(this.THUMBNAIL_PATH);
          await this.page.waitForTimeout(500);
          console.log('      ✓ Thumbnail uploaded for video (found in container)');
          return;
        }
      }
      
      // Strategy 3: Look for "Thumbnail" label/text near the video and find file input after it
      let thumbnailLabel = topicContainer.locator('text=/Thumbnail/i').first();
      let labelCount = await thumbnailLabel.count().catch(() => 0);
      
      if (labelCount === 0) {
        // Try all "Thumbnail" text on the page
        thumbnailLabel = this.page.locator('text=/Thumbnail/i').last();
      }
      
      const labelVisible = await thumbnailLabel.isVisible({ timeout: 2000 }).catch(() => false);
      if (labelVisible) {
        const fileInputAfterLabel = thumbnailLabel.locator('xpath=following::input[@type="file"][1]');
        const fileInputCount = await fileInputAfterLabel.count().catch(() => 0);
        if (fileInputCount > 0) {
          await fileInputAfterLabel.setInputFiles(this.THUMBNAIL_PATH);
          await this.page.waitForTimeout(500);
          console.log('      ✓ Thumbnail uploaded for video (found after label)');
          return;
        }
      }
      
      // Strategy 4: Try the last file input on the entire page (fallback)
      const allFileInputs = this.page.locator('input[type="file"]');
      const allInputCount = await allFileInputs.count().catch(() => 0);
      if (allInputCount > 0) {
        const lastFileInput = allFileInputs.last();
        const lastInputAttached = await lastFileInput.isAttached().catch(() => false);
        if (lastInputAttached) {
          await lastFileInput.scrollIntoViewIfNeeded();
          await lastFileInput.setInputFiles(this.THUMBNAIL_PATH);
          await this.page.waitForTimeout(500);
          console.log('      ✓ Thumbnail uploaded for video (using page fallback)');
          return;
        }
      }
      
      console.log('      ⚠ Thumbnail upload option not found for this video, skipping...');
    } catch (error) {
      console.log(`      ⚠ Could not upload thumbnail for video: ${error instanceof Error ? error.message : error}`);
      // Continue even if thumbnail upload fails
    }
  }

  // ===========================================================================
  // SAVE & VERIFY
  // ===========================================================================

  async saveCourseAndVerify() {
    console.log('➡ Saving course ...');

    // Check if page is still open (might be closed after Preview Report)
    try {
      await this.page.evaluate(() => document.title);
    } catch (error) {
      console.log('⚠ Page is closed (likely after Preview Report) - skipping Save');
      return; // Skip save if page is closed
    }

    const saveButton = this.page
      .getByRole('button', { name: /Save/i })
      .or(this.page.getByText('Save', { exact: false }))
      .first();
    
    // Check if Save button exists before clicking
    const saveButtonExists = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (!saveButtonExists) {
      console.log('⚠ Save button not found - page might be in Preview Report view. Skipping Save.');
      return; // Skip save if button doesn't exist
    }
  }

  /**
   * Get the stored course title (generated during fillCourseDetails)
   * @returns {string|null} The course title or null if not yet generated
   */
  getCourseTitle() {
    return this.courseTitle;
  }

  /**
   * Get the stored course URL slug (generated during fillCourseDetails)
   * @returns {string|null} The course URL slug or null if not yet generated
   */
  getCourseUrlSlug() {
    return this.courseUrlSlug;
  }
}

module.exports = CreateCourse;
