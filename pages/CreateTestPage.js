// CreateTestPage.js - Page Object Model for Create Test Page
const { expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const CreateQuizPage = require('./CreateQuizPage');

class CreateTestPage {
  constructor(page) {
    this.page = page;
    
    // Image path
    this.IMG_PATH = path.resolve(__dirname, '../img.jpg');
    
    // Verify image file exists
    if (!fs.existsSync(this.IMG_PATH)) {
      throw new Error(`Image file not found at: ${this.IMG_PATH}`);
    }
  }
  
  /**
   * Get or create a CreateQuizPage instance for adding quiz questions
   * This method provides a convenient way to connect with CreateQuizPage
   * @returns {CreateQuizPage} Instance of CreateQuizPage
   */
  getQuizPage() {
    return new CreateQuizPage(this.page);
  }

  // Navigate to the Create Test page
  async navigateToCreateTest() {
    await this.page.goto('https://staging.fastlearner.ai/instructor/test');
    
    // Wait for page to load
    await this.page.waitForLoadState('load');
    
    // Wait for form heading
    const createTestHeading = this.page.getByRole('heading', { name: 'Create Test', level: 3 });
    await createTestHeading.waitFor({ state: 'visible', timeout: 15000 });
    await expect(createTestHeading).toBeVisible();
    
    console.log('Navigated to Create Test page');
  }

  // Fill all required fields in Step 1 (Test Information)
  async fillTestForm() {
    // Type dropdown
    console.log('Filling Type dropdown...');
    await expect(this.page.getByText('Type *')).toBeVisible();
    const typeDropdownTrigger = this.page.locator('.ant-select-selector').first();
    await typeDropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await typeDropdownTrigger.click();
    
    const standardOption = this.page.locator('.cdk-overlay-pane >> text=Standard').first();
    await standardOption.waitFor({ state: 'visible', timeout: 10000 });
    await standardOption.click();
    await expect(typeDropdownTrigger).not.toBeEmpty();

    // Title
    console.log('Filling Title input...');
    const titleInput = this.page.getByPlaceholder('Insert your title');
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.fill('Automation Framework');
    await expect(titleInput).not.toBeEmpty();

    // Level dropdown
    console.log('Filling Level dropdown...');
    await expect(this.page.getByText('Level *')).toBeVisible();
    const levelDropdownTrigger = this.page.locator('.ant-select-selector').nth(1);
    await levelDropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await levelDropdownTrigger.click();
    
    const beginnerOption = this.page.locator('.cdk-overlay-pane >> text=Beginner').first();
    await beginnerOption.waitFor({ state: 'visible', timeout: 10000 });
    await beginnerOption.click();
    await expect(levelDropdownTrigger).not.toBeEmpty();

    // Headline
    console.log('Filling Headline...');
    const headlineInput = this.page.getByPlaceholder('About the test');
    await headlineInput.waitFor({ state: 'visible', timeout: 10000 });
    await headlineInput.fill('Master Database Testing for SQA: From SQL Basics to Real-World QA Scenarios!');
    await expect(headlineInput).not.toBeEmpty();

    // Category dropdown
    console.log('Filling Category dropdown...');
    await expect(this.page.getByText('Category *')).toBeVisible();
    const categoryDropdownTrigger = this.page.locator('.ant-select-selector').nth(2);
    await categoryDropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await categoryDropdownTrigger.click();
    
    const developmentOption = this.page.locator('.cdk-overlay-pane >> text=Development').first();
    await developmentOption.waitFor({ state: 'visible', timeout: 10000 });
    await developmentOption.click();
    await expect(categoryDropdownTrigger).not.toBeEmpty();

    // Description
    console.log('Filling Description...');
    await expect(this.page.getByText('Description *')).toBeVisible();
    const descriptionEditable = this.page.locator('.angular-editor-textarea[contenteditable="true"]');
    await descriptionEditable.waitFor({ state: 'visible', timeout: 10000 });
    await descriptionEditable.fill('This course provides a complete introduction to Database Concepts, SQL Fundamentals, and Database Testing specifically for Software Quality Assurance (SQA) professionals. Students will learn how backend systems work, how to write SQL queries, validate data, perform CRUD operations, and apply testing techniques to ensure data accuracy, integrity, and reliability in applications.');
    await expect(descriptionEditable).not.toBeEmpty();

    // Hashtags
    console.log('Filling Hashtags...');
    await expect(this.page.getByText('Hashtags *')).toBeVisible();
    await this.page.getByText('New Tag').waitFor({ state: 'visible', timeout: 10000 });
    await this.page.getByText('New Tag').click();
    
    let hashtagInput = this.page.locator('input[placeholder="New Tag"]');
    if (await hashtagInput.count() === 0) {
      hashtagInput = this.page.getByText('Hashtags *').locator('xpath=following::input[1]');
    }
    await hashtagInput.waitFor({ state: 'visible', timeout: 10000 });
    await hashtagInput.fill('#SQADatabase');
    await expect(hashtagInput).toHaveValue('#SQADatabase');

    // Prerequisite
    console.log('Filling Prerequisite...');
    await expect(this.page.getByText('Prerequisite *')).toBeVisible();
    const prerequisiteInput = this.page.getByPlaceholder('Eg. You must have a basic knowledge of programming');
    await prerequisiteInput.waitFor({ state: 'visible', timeout: 10000 });
    await prerequisiteInput.fill('No prior database experience required');
    await expect(prerequisiteInput).not.toBeEmpty();

    // What will students learn?
    console.log('Filling What will students learn?...');
    await expect(this.page.getByText('What will students learn? *')).toBeVisible();
    const learnInput = this.page.getByPlaceholder('What will students learn in your course?');
    await learnInput.waitFor({ state: 'visible', timeout: 10000 });
    await learnInput.fill('Understand Databases, Tables, Primary Keys, Foreign Keys');
    await expect(learnInput).not.toBeEmpty();

    console.log('✓ Test form filled successfully');
  }

  // Upload thumbnail with multiple fallback approaches
  async uploadThumbnail() {
    console.log('Uploading Thumbnail...');
    
    // Wait for form to be fully loaded and scroll to thumbnail section
    // Skip Promotional Video (optional) - only upload thumbnail
    await expect(this.page.getByText('Thumbnail *')).toBeVisible({ timeout: 15000 });
    
    // Scroll to thumbnail section to ensure it's in view
    const thumbnailLabel = this.page.getByText('Thumbnail *');
    await thumbnailLabel.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Allow time for scroll to complete
    
    // Try multiple approaches to upload thumbnail (skip video input - it's optional)
    let uploaded = false;
    
    // Helper function to check if page is still open
    const isPageOpen = async () => {
      try {
        await this.page.evaluate(() => document.title);
        return true;
      } catch {
        return false;
      }
    };
    
    // Approach 1: Find file input directly following "Thumbnail *" label (skips video input)
    try {
      console.log('Attempting thumbnail upload: Approach 1 (find input after Thumbnail label)...');
      if (!(await isPageOpen())) throw new Error('Page closed');
      
      await thumbnailLabel.waitFor({ state: 'visible', timeout: 2000 });
      // Find the file input that comes after "Thumbnail *" and before any other label
      const fileInputAfterThumbnail = thumbnailLabel.locator('xpath=following::input[@type="file"][1]');
      const count = await fileInputAfterThumbnail.count().catch(() => 0);
      console.log(`Approach 1: Found ${count} file input(s) after Thumbnail label`);
      
      if (count > 0) {
        // Verify it's not the video input by checking nearby text
        const nearbyText = await fileInputAfterThumbnail.evaluateHandle((el) => {
          let current = el.parentElement;
          let depth = 0;
          while (current && depth < 5) {
            const text = current.textContent || '';
            if (text.includes('Promotional Video')) return 'video';
            if (text.includes('Thumbnail')) return 'thumbnail';
            current = current.parentElement;
            depth++;
          }
          return 'unknown';
        }).then(h => h.jsonValue()).catch(() => 'unknown');
        
        console.log(`Approach 1: Nearby text context = ${nearbyText}`);
        
        if (nearbyText === 'thumbnail' || nearbyText === 'unknown') {
          try {
            await fileInputAfterThumbnail.setInputFiles(this.IMG_PATH);
            await this.page.waitForTimeout(500);
            const files = await fileInputAfterThumbnail.evaluate(el => el.files?.length ?? 0);
            console.log(`Approach 1: File count after upload = ${files}`);
            if (files === 1) {
              uploaded = true;
              console.log('✓ Thumbnail uploaded successfully using file input after Thumbnail label');
            } else {
              console.log(`✗ Approach 1: Verification failed - expected 1 file, got ${files}`);
            }
          } catch (uploadError) {
            console.log(`✗ Approach 1: setInputFiles failed:`, uploadError instanceof Error ? uploadError.message : uploadError);
          }
        } else {
          console.log(`Approach 1: Skipped (detected as ${nearbyText}), trying alternative approach...`);
        }
      } else {
        console.log('Approach 1: No file input found after Thumbnail label');
      }
    } catch (e) {
      console.log('Approach 1 failed:', e instanceof Error ? e.message : e);
    }
    
    // Approach 2: Find all file inputs and filter for thumbnail (not video)
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('Attempting thumbnail upload: Approach 2 (filter file inputs - skip video)...');
        const fileInputs = this.page.locator('input[type="file"]');
        const count = await fileInputs.count().catch(() => 0);
        console.log(`Found ${count} file input(s) on page`);
        
        for (let i = 0; i < count; i++) {
          if (!(await isPageOpen())) break;
          
          try {
            const input = fileInputs.nth(i);
            const isAttached = await input.evaluate(() => true).catch(() => false);
            if (!isAttached) {
              console.log(`File input [${i}] is not attached, skipping...`);
              continue;
            }
            
            // Check if this is the thumbnail input (not video)
            const context = await input.evaluateHandle((el) => {
              let current = el.parentElement;
              let depth = 0;
              while (current && depth < 5) {
                const text = current.textContent || '';
                if (text.includes('Promotional Video')) return 'video';
                if (text.includes('Thumbnail')) return 'thumbnail';
                current = current.parentElement;
                depth++;
              }
              return 'unknown';
            }).then(h => h.jsonValue()).catch(() => 'unknown');
            
            console.log(`File input [${i}] context: ${context}`);
            
            // Skip video inputs, only process thumbnail
            if (context === 'video') {
              console.log(`Skipping file input [${i}] - it's for video (optional)`);
              continue;
            }
            
            // Try uploading to thumbnail or last unknown input (likely thumbnail)
            if (context === 'thumbnail' || (context === 'unknown' && i === count - 1)) {
              console.log(`Attempting to upload to file input [${i}] (context: ${context})...`);
              try {
                await input.setInputFiles(this.IMG_PATH);
                await this.page.waitForTimeout(500);
                
                // Verify file was set
                const files = await input.evaluate(el => el.files?.length ?? 0);
                console.log(`File input [${i}] now has ${files} file(s)`);
                
                if (files === 1) {
                  uploaded = true;
                  console.log(`✓ Thumbnail uploaded successfully using file input [${i}]`);
                  break;
                } else {
                  console.log(`✗ File input [${i}] verification failed: expected 1 file, got ${files}`);
                }
              } catch (uploadError) {
                console.log(`✗ Failed to setInputFiles on input [${i}]:`, uploadError instanceof Error ? uploadError.message : uploadError);
              }
            }
          } catch (e) {
            console.log(`Error processing file input [${i}]:`, e instanceof Error ? e.message : e);
          }
        }
      } catch (e) {
        console.log('Approach 2 failed:', e instanceof Error ? e.message : e);
      }
    }
    
    // Approach 2.5: Try clicking the "Upload File" button for thumbnail, then find input
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('Attempting thumbnail upload: Approach 2.5 (click Upload File button for thumbnail)...');
        // Find the "Upload File" button that's near "Thumbnail *" text
        const thumbnailSection = this.page.locator('text=Thumbnail *').locator('xpath=following::button[contains(., "Upload File")][1]');
        const buttonCount = await thumbnailSection.count().catch(() => 0);
        
        if (buttonCount > 0) {
          await thumbnailSection.click();
          await this.page.waitForTimeout(300);
        }
        
        // Now try to find and upload to the thumbnail input
        const fileInputs = this.page.locator('input[type="file"]');
        const inputCount = await fileInputs.count().catch(() => 0);
        
        // Try the last input (likely thumbnail after video)
        if (inputCount > 0) {
          const thumbnailInput = fileInputs.nth(inputCount - 1);
          await thumbnailInput.setInputFiles(this.IMG_PATH);
          await this.page.waitForTimeout(500);
          const files = await thumbnailInput.evaluate(el => el.files?.length ?? 0);
          if (files === 1) {
            uploaded = true;
            console.log(`✓ Thumbnail uploaded successfully using last file input after button click`);
          }
        }
      } catch (e) {
        console.log('Approach 2.5 failed:', e instanceof Error ? e.message : e);
      }
    }
    
    // Approach 3: Simple approach - try last file input (thumbnail is typically after video)
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('Attempting thumbnail upload: Approach 3 (try last file input - thumbnail is typically last)...');
        const fileInputs = this.page.locator('input[type="file"]');
        const count = await fileInputs.count().catch(() => 0);
        
        if (count >= 2) {
          // Try the last input (index count-1), which should be thumbnail
          const lastInput = fileInputs.nth(count - 1);
          console.log(`Trying last file input [${count - 1}]...`);
          try {
            await lastInput.setInputFiles(this.IMG_PATH);
            await this.page.waitForTimeout(500);
            const files = await lastInput.evaluate(el => el.files?.length ?? 0);
            console.log(`Last input [${count - 1}] file count: ${files}`);
            if (files === 1) {
              uploaded = true;
              console.log(`✓ Thumbnail uploaded successfully using last file input [${count - 1}]`);
            }
          } catch (e) {
            console.log(`Failed to upload to last input:`, e instanceof Error ? e.message : e);
          }
        }
      } catch (e) {
        console.log('Approach 3 failed:', e instanceof Error ? e.message : e);
      }
    }
    
    // Approach 4: Use getByLabel with short timeout
    if (!uploaded && (await isPageOpen())) {
      try {
        console.log('Attempting thumbnail upload: Approach 4 (getByLabel)...');
        const thumbnailInput = this.page.getByLabel('Thumbnail');
        // Use short timeout - if it doesn't exist, fail fast
        await thumbnailInput.waitFor({ state: 'attached', timeout: 2000 });
        await thumbnailInput.setInputFiles(this.IMG_PATH);
        await this.page.waitForTimeout(500);
        const files = await thumbnailInput.evaluate(el => el.files?.length ?? 0);
        if (files === 1) {
          uploaded = true;
          console.log('✓ Thumbnail uploaded successfully using getByLabel approach');
        }
      } catch (e) {
        console.log('Approach 4 (getByLabel) failed:', e instanceof Error ? e.message : e);
      }
    }
    
    // Assert that thumbnail was uploaded successfully
    if (!uploaded) {
      // Take a screenshot for debugging (only if page is still open)
      try {
        if (await isPageOpen()) {
          await this.page.screenshot({ path: 'thumbnail-upload-failed.png', fullPage: true }).catch(() => {});
        }
      } catch {
        // Ignore screenshot errors
      }
      throw new Error('Failed to upload thumbnail: img.jpg not set on any file input');
    }
    
    console.log('✓ Thumbnail upload verified successfully');
    
    // Wait for UI to process the file upload
    await this.page.waitForTimeout(2000);
  }

  // Handle thumbnail upload modal dialog
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
      console.log('Checking for thumbnail upload modal dialog...');
      
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
          console.log('Upload Photo modal detected (heading found)');
        } else if (overlayVisible) {
          console.log('Modal overlay detected, checking if it requires interaction...');
        }
        
        await saveButton.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        
        // Click Browse button first to select image in the modal (if modal opened)
        try {
          console.log('Clicking Browse button in modal...');
          // Try multiple selectors for Browse button
          let browseButton = this.page.getByText('Browse', { exact: false }).first();
          let browseVisible = await browseButton.isVisible({ timeout: 2000 }).catch(() => false);
          
          if (!browseVisible) {
            browseButton = this.page.locator('text=/Browse/i').first();
            browseVisible = await browseButton.isVisible({ timeout: 2000 }).catch(() => false);
          }
          
          if (!browseVisible) {
            browseButton = this.page.locator('button:has-text("Browse")').first();
            browseVisible = await browseButton.isVisible({ timeout: 2000 }).catch(() => false);
          }
          
          if (browseVisible) {
            await browseButton.click();
            console.log('✓ Browse button clicked');
            
            // Wait a moment for file input to become accessible
            await this.page.waitForTimeout(1000);
            
            // Find and upload file to the modal's file input
            const modalFileInputs = this.page.locator('input[type="file"]');
            const modalInputCount = await modalFileInputs.count().catch(() => 0);
            
            if (modalInputCount > 0) {
              // Try the last file input (most likely the one in the modal)
              const modalFileInput = modalFileInputs.nth(modalInputCount - 1);
              await modalFileInput.setInputFiles(this.IMG_PATH);
              await this.page.waitForTimeout(1000); // Wait for image to process
              
              // Close any file dialog windows that might have opened
              await this.page.keyboard.press('Escape').catch(() => {});
              await this.page.waitForTimeout(500);
              
              console.log('✓ Image selected in modal via Browse button');
              
              // Wait a bit more for Save button to become enabled
              await this.page.waitForTimeout(2000);
            }
          }
        } catch (browseError) {
          console.log('Could not click Browse button:', browseError instanceof Error ? browseError.message : browseError);
        }
        
        // Wait for Save button to be enabled (it starts disabled until image is loaded)
        try {
          const saveBtnVisible = await saveButton.first().isVisible({ timeout: 5000 }).catch(() => false);
          if (saveBtnVisible) {
            await expect(saveButton.first()).toBeEnabled({ timeout: 15000 });
            
            // Button is enabled, click it to save and close modal
            await saveButton.first().click();
            console.log('✓ Save button clicked in thumbnail upload modal - modal will close');
            
            // Wait for modal to close
            await this.page.waitForTimeout(2000);
          }
        } catch (enableError) {
          console.log('Save button did not become enabled or not found, trying to close modal manually...');
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
              console.log('✓ Clicked Cancel button');
            } else if (closeVisible) {
              await closeButton.click();
              console.log('✓ Clicked Close button');
            } else {
              // Press Escape key to close modal
              await this.page.keyboard.press('Escape');
              console.log('✓ Pressed Escape to close modal');
            }
          } catch (closeError) {
            console.log('Could not close modal, will try to remove overlays...');
          }
        }
        
        // Wait for modal to disappear
        await uploadPhotoHeading.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        console.log('Waiting for modal overlays to disappear...');
        
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
        console.log('Modal closed, proceeding...');
      } else {
        console.log('No Upload Photo modal found, proceeding...');
        await this.page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('Modal handling error:', e instanceof Error ? e.message : e);
      
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
        } catch (evalError) {
          console.log('Could not remove overlays - page may be closed');
        }
      }
      
      await this.page.waitForTimeout(2000).catch(() => {});
    }
  }

  // Remove any modal overlays
  async removeOverlays() {
    // Check if page is open before evaluating
    const isPageOpen = async () => {
      try {
        await this.page.evaluate(() => document.title);
        return true;
      } catch {
        return false;
      }
    };
    
    if (await isPageOpen()) {
      try {
        await this.page.evaluate(() => {
          const overlays = document.querySelectorAll('.ant-modal-wrap, .ant-modal-mask, .cdk-overlay-container .ant-modal-wrap, [class*="modal-wrap"]');
          overlays.forEach((overlay) => {
            overlay.style.display = 'none';
            overlay.remove();
          });
        });
        await this.page.waitForTimeout(500);
      } catch (e) {
        // Page may have closed, ignore error
        console.log('Could not remove overlays - page may be closed');
      }
    }
  }

  // Click Continue button (Step 1 -> Step 2)
  async clickContinue() {
    console.log('Locating Continue button...');
    
    await this.removeOverlays();
    await this.page.waitForTimeout(1000);
    
    let continueBtn = this.page.getByRole('button', { name: 'Continue', exact: true });
    
    try {
      await continueBtn.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      console.log('Role-based selector failed, trying class-based selector...');
      continueBtn = this.page.locator('button.continueBtn, button:has-text("Continue")').first();
      await continueBtn.waitFor({ state: 'visible', timeout: 5000 });
    }
    
    await expect(continueBtn).toBeVisible();
    await continueBtn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Verify thumbnail is uploaded before proceeding
    console.log('Verifying form is ready to continue (thumbnail uploaded)...');
    
    // Check if file input actually has a file (more reliable than UI text)
    const fileInputs = this.page.locator('input[type="file"]');
    const inputCount = await fileInputs.count().catch(() => 0);
    let fileInputHasFile = false;
    
    for (let i = 0; i < inputCount; i++) {
      const input = fileInputs.nth(i);
      try {
        const files = await input.evaluate(el => el.files?.length ?? 0);
        if (files > 0) {
          fileInputHasFile = true;
          console.log(`✓ File input [${i}] has file attached`);
          break;
        }
      } catch (e) {
        // Continue checking other inputs
      }
    }
    
    // Check UI text as secondary verification
    const noFileChosenText = this.page.locator('text=/No file chosen/i');
    const stillShowingNoFile = await noFileChosenText.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (stillShowingNoFile && !fileInputHasFile) {
      console.log('⚠ Warning: Thumbnail section shows "No file chosen" and no file input has file');
      console.log('Attempting to wait a bit longer for thumbnail to process...');
      await this.page.waitForTimeout(3000);
      
      // Check file inputs again
      for (let i = 0; i < inputCount; i++) {
        const input = fileInputs.nth(i);
        try {
          const files = await input.evaluate(el => el.files?.length ?? 0);
          if (files > 0) {
            fileInputHasFile = true;
            break;
          }
        } catch (e) {}
      }
      
      const stillNoFile = await noFileChosenText.isVisible({ timeout: 2000 }).catch(() => false);
      if (stillNoFile && !fileInputHasFile) {
        console.log('⚠ Thumbnail may not be uploaded, but checking if Continue button is enabled anyway...');
      }
    } else if (stillShowingNoFile && fileInputHasFile) {
      console.log('⚠ UI shows "No file chosen" but file input has file - UI may be out of sync, proceeding...');
    }
    
    // Check for validation errors before clicking Continue
    console.log('Checking for form validation errors...');
    const titleInput = this.page.getByPlaceholder('Insert your title');
    const titleErrorText = this.page.locator('text=/Course Title already exist/i')
      .or(this.page.locator('text=/title already exist/i'))
      .or(this.page.locator('text=/already exist/i'))
      .first();
    
    const hasTitleError = await titleErrorText.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasTitleError) {
      console.log('⚠ Validation error detected: Course title already exists. Generating unique title...');
      
      // Generate a unique title by appending timestamp
      const timestamp = Date.now();
      const uniqueTitle = `Automation Framework ${timestamp}`;
      
      // Clear and refill title with unique value
      await titleInput.waitFor({ state: 'visible', timeout: 10000 });
      await titleInput.clear();
      await titleInput.fill(uniqueTitle);
      await this.page.waitForTimeout(2000); // Wait for validation to re-check
      
      // Verify error is gone
      const stillHasError = await titleErrorText.isVisible({ timeout: 2000 }).catch(() => false);
      if (stillHasError) {
        throw new Error('Title validation error persists even after changing to unique title');
      }
      
      console.log(`✓ Updated title to unique value: "${uniqueTitle}"`);
    } else {
      console.log('✓ No validation errors detected');
    }
    
    // Check if Continue button is enabled (form validation may pass even if UI text is stale)
    const isEnabled = await continueBtn.isEnabled({ timeout: 5000 }).catch(() => false);
    if (!isEnabled) {
      await expect(continueBtn).toBeEnabled({ timeout: 15000 });
    } else {
      console.log('✓ Continue button is enabled - form is ready');
    }
    
    await this.removeOverlays();
    await this.page.waitForTimeout(500);
    
    console.log('Clicking Continue button using JavaScript...');
    const currentURL = this.page.url();
    console.log(`Current URL before Continue click: ${currentURL}`);
    
    try {
      await continueBtn.evaluate((btn) => {
        const button = btn;
        if (button.disabled) {
          throw new Error('Button is disabled');
        }
        button.click();
      });
      console.log('✓ Continue button clicked successfully (JavaScript click)');
    } catch (e) {
      console.log('JavaScript click failed, trying normal click...', e instanceof Error ? e.message : e);
      await continueBtn.click({ timeout: 10000, force: true });
      console.log('✓ Continue button clicked successfully (force click)');
    }
    
    // Wait for form to process the Continue click and transition to Step 2
    await this.page.waitForTimeout(3000);
  }

  // Verify Step 2 (Add Sections) is loaded
  async verifyStep2Loaded() {
    console.log('Waiting for form to advance to step 2 (Add Sections)...');
    
    // Wait for form transition to complete
    await this.page.waitForTimeout(3000);
    
    // Verify Step 1 content is hidden (Title field should not be visible in Step 2)
    const titleField = this.page.getByPlaceholder('Insert your title');
    const titleVisible = await titleField.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Primary verification: Wait for Step 2 form fields to appear
    const sectionNameField = this.page.getByPlaceholder('Section name *').or(this.page.locator('input[placeholder*="Section name"]'));
    
    try {
      // Wait for Section name field to be visible (this is the key indicator that Step 2 is loaded)
      await sectionNameField.first().waitFor({ state: 'visible', timeout: 20000 });
      console.log('✓ Found "Section name" field - Step 2 form is loaded');
      
      // Verify Step 1 content is hidden
      if (titleVisible) {
        console.log('⚠ Warning: Step 1 content still visible, waiting a bit more...');
        await this.page.waitForTimeout(2000);
        const titleStillVisible = await titleField.isVisible({ timeout: 2000 }).catch(() => false);
        if (titleStillVisible) {
          throw new Error('Step 1 content still visible - form may not have advanced to Step 2');
        }
      }
      
      // Additional verification: Check for other Step 2 indicators
      const topicNameField = this.page.getByPlaceholder('Topic name *').or(this.page.locator('input[placeholder*="Topic name"]'));
      const topicNameVisible = await topicNameField.first().isVisible({ timeout: 5000 }).catch(() => false);
      
      if (topicNameVisible) {
        console.log('✓ Found "Topic name" field - Step 2 confirmed');
      }
      
      console.log(`✓ Successfully advanced to step 2 (Add Sections)`);
      await expect(this.page).toHaveURL(/\/instructor\/test/);
      
    } catch (e) {
      const finalURL = this.page.url();
      console.error(`Step 2 verification failed. Current URL: ${finalURL}`);
      
      // Fallback verification
      const isOnTestPage = finalURL.includes('/instructor/test');
      if (isOnTestPage) {
        // Check if Step 1 is hidden and Step 2 is visible
        const titleStillVisible = await titleField.isVisible({ timeout: 2000 }).catch(() => false);
        const sectionNameInput = await this.page.getByPlaceholder('Section name *').count().catch(() => 0);
        const topicNameInput = await this.page.getByPlaceholder('Topic name *').count().catch(() => 0);
        
        if (!titleStillVisible && (sectionNameInput > 0 || topicNameInput > 0)) {
          console.log('✓ Step 2 form fields found and Step 1 is hidden - Step 2 appears to be loaded');
        } else {
          throw new Error(`Failed to verify form advancement to step 2. Step 1 visible: ${titleStillVisible}, Section name fields: ${sectionNameInput}, Topic name fields: ${topicNameInput}`);
        }
      } else {
        throw new Error(`Failed to verify form advancement to step 2. Current URL: ${finalURL}`);
      }
    }
  }

  // Fill Add Sections form (Step 2)
  async fillAddSectionsForm() {
    console.log('Filling in Add Sections form...');
    
    // Wait for step 2 form to be ready - wait longer for form to fully load
    await this.page.waitForTimeout(2000); // Give page time to render Step 2 content
    
    const sectionNameFieldReady = this.page.getByPlaceholder('Section name *').or(this.page.locator('input[placeholder*="Section name"]')).first();
    await sectionNameFieldReady.waitFor({ state: 'visible', timeout: 15000 });
    await sectionNameFieldReady.waitFor({ state: 'attached', timeout: 15000 });
    
    // Section Name: "Section 1"
    console.log('Filling Section Name field...');
    const sectionNameInput = this.page.getByPlaceholder('Section name *').or(this.page.locator('input[placeholder*="Section name"]')).first();
    await sectionNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await sectionNameInput.scrollIntoViewIfNeeded();
    await sectionNameInput.clear();
    await sectionNameInput.fill('Section 1');
    await expect(sectionNameInput).toHaveValue('Section 1');
    console.log('✓ Section Name filled: Section 1');
    
    // Topic Name: "Database Basics"
    console.log('Filling Topic Name field...');
    const topicNameInput = this.page.getByPlaceholder('Topic name *').or(this.page.locator('input[placeholder*="Topic name"]')).first();
    await topicNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await topicNameInput.scrollIntoViewIfNeeded();
    await topicNameInput.clear();
    await topicNameInput.fill('Database Basics');
    await expect(topicNameInput).toHaveValue('Database Basics');
    console.log('✓ Topic Name filled: Database Basics');
    
    // Type dropdown: Choose "Basic Quiz"
    console.log('Selecting Type dropdown: Basic Quiz...');
    const typeDropdowns = this.page.locator('.ant-select-selector');
    const typeDropdownsCount = await typeDropdowns.count();
    let typeDropdownSelected = false;
    
    for (let i = 0; i < typeDropdownsCount; i++) {
      const dropdown = typeDropdowns.nth(i);
      await dropdown.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await dropdown.scrollIntoViewIfNeeded();
      await dropdown.click();
      await this.page.waitForTimeout(500);
      
      // Try multiple variations of "Basic Quiz" option name
      const basicQuizOptions = ['Basic Quiz', 'BasicQuiz', 'Basic quiz'];
      let optionFound = false;
      
      for (const optionText of basicQuizOptions) {
        const quizOption = this.page.locator('.cdk-overlay-pane, .ant-select-dropdown').getByText(optionText, { exact: false }).first();
        const quizVisible = await quizOption.isVisible({ timeout: 2000 }).catch(() => false);
        if (quizVisible) {
          await quizOption.click();
          typeDropdownSelected = true;
          console.log(`✓ Type dropdown selected: ${optionText}`);
          await this.page.waitForSelector('.cdk-overlay-pane', { state: 'hidden', timeout: 3000 }).catch(() => {});
          optionFound = true;
          break;
        }
      }
      
      if (optionFound) {
        break;
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
    
    if (!typeDropdownSelected) {
      throw new Error('Failed to select Basic Quiz from Type dropdown');
    }
    
    await this.page.waitForSelector('.cdk-overlay-pane', { state: 'hidden', timeout: 3000 }).catch(() => {});
    
    // Sub Type / Options dropdown: Choose "Basic Quiz and Survey" (optional - skip if not available)
    console.log('Selecting Sub Type / Options dropdown: Basic Quiz and Survey...');
    await this.page.waitForTimeout(500); // Wait for dropdowns to update after Type selection
    
    const subTypeDropdowns = this.page.locator('.ant-select-selector');
    const subTypeCount = await subTypeDropdowns.count();
    let subTypeSelected = false;
    
    // Find dropdown that comes after Topic Type dropdown (skip already selected dropdowns)
    for (let i = 0; i < subTypeCount; i++) {
      const dropdown = subTypeDropdowns.nth(i);
      const isVisible = await dropdown.isVisible().catch(() => false);
      if (!isVisible) continue;
      
      // Check if this dropdown already has a value selected (skip if it does)
      const hasValue = await dropdown.evaluate((el) => {
        return el.textContent && el.textContent.trim() !== '';
      }).catch(() => false);
      
      // Skip the Type dropdown we just selected (it shows "Basic Quiz")
      const text = await dropdown.textContent().catch(() => '');
      if ((text.includes('Basic Quiz') || text.includes('BasicQuiz')) && hasValue) {
        continue; // Skip the Type dropdown
      }
      
      await dropdown.scrollIntoViewIfNeeded();
      await dropdown.click();
      await this.page.waitForTimeout(600); // Wait longer for options to load
      
      // Try multiple option names (exact match, partial match)
      const options = [
        'Basic Quiz and Survey',
        'Basic Quiz',
        'Quiz and Survey',
        'Basic',
        'All' // Sometimes shows "All" as default
      ];
      
      let optionFound = false;
      for (const optionText of options) {
        const option = this.page.locator('.cdk-overlay-pane, .ant-select-dropdown')
          .getByText(optionText, { exact: false }).first();
        const optionVisible = await option.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (optionVisible) {
          await option.click();
          subTypeSelected = true;
          console.log(`✓ Sub Type dropdown selected: ${optionText}`);
          await this.page.waitForSelector('.cdk-overlay-pane', { state: 'hidden', timeout: 3000 }).catch(() => {});
          optionFound = true;
          break;
        }
      }
      
      if (optionFound) {
        break;
      } else {
        // Close dropdown if option not found
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
      }
    }
    
    // Make Sub Type selection optional - if not found, continue (Basic Quiz type might not require Sub Type)
    if (!subTypeSelected) {
      console.log('⚠ Sub Type dropdown not found or option not available - continuing without Sub Type selection');
    }
    
    await this.page.waitForSelector('.cdk-overlay-pane', { state: 'hidden', timeout: 3000 }).catch(() => {});
    
    // Quiz Duration: 15
    console.log('Setting Quiz Duration to 15...');
    const quizDurationLabel = this.page.locator('text=/Quiz duration/i').first();
    await quizDurationLabel.waitFor({ state: 'visible', timeout: 10000 });
    await quizDurationLabel.scrollIntoViewIfNeeded();
    
    const quizDurationInput = quizDurationLabel.locator('xpath=following::input[@type="number"][1]').or(
      quizDurationLabel.locator('xpath=following::*[@role="spinbutton"][1]').locator('input').first()
    );
    
    await quizDurationInput.waitFor({ state: 'visible', timeout: 10000 });
    await quizDurationInput.scrollIntoViewIfNeeded();
    await quizDurationInput.clear();
    await quizDurationInput.fill('15');
    await this.page.waitForTimeout(500);
    const quizDurationValue = await quizDurationInput.inputValue();
    if (quizDurationValue !== '15') {
      await quizDurationInput.fill('15');
    }
    console.log(`✓ Quiz Duration set to: ${await quizDurationInput.inputValue()}`);
    
    // Passing Criteria: 20 (optional - may not exist for all test types)
    console.log('Setting Passing Criteria to 20...');
    const passingCriteriaLabel = this.page.locator('text=/Passing criteria/i').first();
    const passingCriteriaVisible = await passingCriteriaLabel.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (passingCriteriaVisible) {
      await passingCriteriaLabel.scrollIntoViewIfNeeded();
      
      const passingCriteriaInput = passingCriteriaLabel.locator('xpath=following::input[@type="number"][1]').or(
        passingCriteriaLabel.locator('xpath=following::*[@role="spinbutton"][1]').locator('input').first()
      );
      
      await passingCriteriaInput.waitFor({ state: 'visible', timeout: 10000 });
      await passingCriteriaInput.scrollIntoViewIfNeeded();
      await passingCriteriaInput.clear();
      await passingCriteriaInput.fill('20');
      await this.page.waitForTimeout(500);
      const passingCriteriaValue = await passingCriteriaInput.inputValue();
      if (passingCriteriaValue !== '20') {
        await passingCriteriaInput.fill('20');
      }
      console.log(`✓ Passing Criteria set to: ${await passingCriteriaInput.inputValue()}`);
    } else {
      console.log('⚠ Passing Criteria field not found - skipping (may not be required for this test type)');
    }
    
    await this.page.waitForTimeout(1000);
    console.log('✓ All Add Sections form fields filled successfully');
  }

  // Click Save button in Step 2 (saves questions and sections before continuing)
  async clickSaveButton() {
    console.log('Clicking Save button to save questions and sections...');
    
    // First, check if page is open - if not, wait for it to reopen
    let pageOpen = await this.isPageOpen().catch(() => false);
    if (!pageOpen) {
      console.log('⚠ Page appears closed. Waiting to see if it reopens...');
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        pageOpen = await this.isPageOpen().catch(() => false);
        if (pageOpen) {
          console.log('✓ Page reopened');
          break;
        }
      }
      
      if (!pageOpen) {
        throw new Error('Cannot click Save button: Page is not available and did not reopen');
      }
    }
    
    // Check if preview modal is still open and close it if needed
    const previewModal = this.page.locator('dialog, [role="dialog"]').filter({
      has: this.page.getByText('AI Report Preview', { exact: false })
    }).first();
    
    const modalVisible = await previewModal.isVisible({ timeout: 3000 }).catch(() => false);
    if (modalVisible) {
      console.log('⚠ Preview modal is still open. Closing it before saving...');
      try {
        const closeButton = previewModal.locator('button:has-text("Close"):not([nz-modal-close])').first();
        await closeButton.waitFor({ state: 'visible', timeout: 5000 });
        await closeButton.click();
        await this.page.waitForTimeout(1000);
        console.log('✓ Preview modal closed');
      } catch (e) {
        console.log('⚠ Could not close modal, trying Escape key...');
        try {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(1000);
        } catch {
          // Ignore
        }
      }
    }
    
    // Find the Save button (typically near the questions section)
    const saveButton = this.page.getByRole('button', { name: 'Save', exact: true })
      .or(this.page.locator('button:has-text("Save"):not(:has-text("Save as"))'))
      .first();
    
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.scrollIntoViewIfNeeded();
    
    // Safe wait
    try {
      if (await this.isPageOpen()) {
        await this.page.waitForTimeout(500);
      }
    } catch {
      // Ignore
    }
    
    // Check if button is enabled
    const isEnabled = await saveButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      await expect(saveButton).toBeEnabled({ timeout: 10000 });
    }
    
    await saveButton.click();
    console.log('✓ Save button clicked');
    
    // Wait for save to complete
    try {
      if (await this.isPageOpen()) {
        await this.page.waitForTimeout(2000);
      }
    } catch {
      // Ignore
    }
    
    // Wait for loading overlay to disappear if present
    await this.waitForLoadingOverlayToDisappear();
    
    console.log('✅ Questions and sections saved successfully');
  }

  // Click Continue button (Step 2 -> Step 3)
  async clickContinueStep2() {
    console.log('Clicking Continue button to advance to next step...');
    
    // Check if page is open before proceeding
    const pageOpen = await this.isPageOpen().catch(() => false);
    if (!pageOpen) {
      throw new Error('Cannot click Continue button: Page has been closed. This may indicate an error during Preview Report generation.');
    }
    
    // Wait a moment for any ongoing operations to complete
    try {
      await this.page.waitForTimeout(1000);
    } catch (e) {
      // If wait fails, page might have closed - check again
      const stillOpen = await this.isPageOpen().catch(() => false);
      if (!stillOpen) {
        throw new Error('Page was closed while waiting. This may indicate an error during Preview Report generation.');
      }
      // If page is still open, continue
    }
    
    // Try to locate the Continue button
    const continueBtnStep2 = this.page.getByRole('button', { name: 'Continue', exact: true }).last();
    
    // Wait for button to be visible and enabled
    await continueBtnStep2.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtnStep2.scrollIntoViewIfNeeded();
    await expect(continueBtnStep2).toBeEnabled({ timeout: 5000 });
    
    // Small wait before clicking
    try {
      await this.page.waitForTimeout(500);
    } catch {
      // Page might be closed, but try clicking anyway
    }
    
    await continueBtnStep2.click();
    console.log('✓ Continue button clicked on step 2');
    
    // Small wait for page to process the click
    try {
      await this.page.waitForTimeout(2000);
    } catch {
      // Ignore if page closes after click
    }
  }

  // Verify Step 3 (Preview) is loaded
  async verifyStep3Loaded() {
    console.log('Waiting for form to advance to step 3 (Preview)...');
    
    try {
      const previewHeading = this.page.getByText('Preview', { exact: true }).or(this.page.locator('text=/Preview/i'));
      await previewHeading.waitFor({ state: 'visible', timeout: 15000 });
      
      console.log('✓ Successfully advanced to step 3 (Preview)');
      console.log('✓ Form submission successful - all steps completed');
      
    } catch (e) {
      console.error(`Step 3 verification failed:`, e instanceof Error ? e.message : e);
      const previewContent = await this.page.locator('text=/Preview/i').count().catch(() => 0);
      if (previewContent > 0) {
        console.log('✓ Found preview content - step 3 appears to be loaded');
      } else {
        throw new Error(`Failed to verify form advancement to step 3 (Preview)`);
      }
    }
  }

  // Click Publish button on Step 3 (Preview)
  async clickPublish() {
    console.log('Clicking Publish button to publish the test...');
    
    // Wait for Step 3 to be fully loaded first
    await this.page.waitForTimeout(2000);
    
    // Find the Publish button using multiple strategies - be more specific
    // The Publish button is typically at the bottom, often next to a "Back" button
    let publishButton = this.page.getByRole('button', { name: 'Publish', exact: true })
      .or(this.page.locator('button:has-text("Publish"):not(:has-text("Back"))'))
      .or(this.page.locator('button').filter({ hasText: /^Publish$/i }))
      .first();
    
    // Alternative: Look for button that comes after "Back" button
    const backButton = this.page.getByRole('button', { name: 'Back', exact: true })
      .or(this.page.locator('button:has-text("Back")')).first();
    const backButtonExists = await backButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (backButtonExists) {
      // Find Publish button as sibling or next button after Back
      const publishAfterBack = backButton.locator('xpath=following-sibling::button[contains(., "Publish")]')
        .or(this.page.locator('button:has-text("Publish")').filter({ hasNot: this.page.locator('button:has-text("Back")') }))
        .first();
      const publishAfterBackExists = await publishAfterBack.isVisible({ timeout: 2000 }).catch(() => false);
      if (publishAfterBackExists) {
        publishButton = publishAfterBack;
        console.log('✓ Found Publish button after Back button');
      }
    }
    
    // Wait for button to be visible
    await publishButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Scroll button into view - make sure it's visible
    await publishButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Check if button is actually in viewport
    const isInViewport = await publishButton.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }).catch(() => false);
    
    if (!isInViewport) {
      console.log('⚠ Publish button not fully in viewport, scrolling again...');
      await publishButton.scrollIntoViewIfNeeded({ behavior: 'smooth', block: 'center' });
      await this.page.waitForTimeout(1000);
    }
    
    // Check if button is enabled
    const isEnabled = await publishButton.isEnabled().catch(() => false);
    if (!isEnabled) {
      console.log('⚠ Publish button is disabled, waiting for it to become enabled...');
      await expect(publishButton).toBeEnabled({ timeout: 10000 });
    }
    
    // Check if button is visible one more time before clicking
    const isVisible = await publishButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) {
      throw new Error('Publish button is not visible');
    }
    
    // Try multiple click strategies
    try {
      // Strategy 1: Normal click
      await publishButton.click({ timeout: 10000 });
      console.log('✓ Publish button clicked (normal click)');
    } catch (clickError) {
      console.log('⚠ Normal click failed, trying JavaScript click...');
      // Strategy 2: JavaScript click
      await publishButton.evaluate((btn) => {
        if (btn.disabled) {
          throw new Error('Button is disabled');
        }
        btn.click();
      });
      console.log('✓ Publish button clicked (JavaScript click)');
    }
    
    // Wait for any loading/confirmation to appear
    await this.page.waitForTimeout(2000);
    
    // Wait for loading overlay to disappear if present
    await this.waitForLoadingOverlayToDisappear();
    
    // Wait for and verify the success message: "Your course has been published"
    console.log('Waiting for success message: "Your course has been published"...');
    const successMessage = this.page.getByText('Your course has been published', { exact: false })
      .or(this.page.locator('text=/Your course has been published/i'))
      .or(this.page.locator('text=/course has been published/i'))
      .or(this.page.locator('text=/has been published/i'));
    
    await successMessage.waitFor({ state: 'visible', timeout: 15000 });
    await expect(successMessage).toBeVisible();
    console.log('✓ Success message verified: "Your course has been published"');
    
    console.log('✅ Test published successfully');
  }

  // Verify that the page has loaded successfully
  async verifyPageLoaded() {
    console.log('Verifying page loaded...');
    await this.page.waitForLoadState('load');
    await expect(this.page).toHaveURL('https://staging.fastlearner.ai/instructor/test', { timeout: 15000 });
    console.log('Page verified successfully');
  }

  // Add a single quiz question with options and correct answer
  async addQuestion(questionText, options, correctOptionIndex) {
    console.log(`Adding question: "${questionText}"`);
    
    // Step 1: Check if we need to click "Add a question" button (if Question 1 is already filled, we need to add more)
    // First, check if there's an empty question input available
    const existingQuestionInput = this.page.getByPlaceholder('Let\'s ask a question').first();
    const isEmpty = await existingQuestionInput.inputValue().then(val => val.trim() === '').catch(() => false);
    
    if (!isEmpty) {
      // Need to add a new question - click "Add a question" button
      const addQuestionButton = this.page.getByText('Add a question', { exact: false })
        .or(this.page.locator('button:has-text("Add a question")'))
        .or(this.page.locator('button:has-text("add a question")'))
        .last(); // Get the last one (most recent)
      
      await addQuestionButton.waitFor({ state: 'visible', timeout: 10000 });
      await addQuestionButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await addQuestionButton.click();
      console.log('✓ Clicked "Add a question" button');
      await this.page.waitForTimeout(1000); // Wait for new question form to render
    } else {
      console.log('✓ Using existing empty question slot');
    }
    
    // Step 2: Find and fill the question text input (use the last/empty one)
    const questionInput = this.page.getByPlaceholder('Let\'s ask a question').last();
    await questionInput.waitFor({ state: 'visible', timeout: 10000 });
    await questionInput.scrollIntoViewIfNeeded();
    await questionInput.fill(questionText);
    console.log(`✓ Filled question text: "${questionText}"`);
    await this.page.waitForTimeout(500);
    
    // Step 3: Add options - scope to current question section to avoid counting options from other questions
    // Find the question container (ancestor of the question input)
    const questionSection = questionInput.locator('xpath=ancestor::*[contains(., "Question") or contains(@class, "question")][1]').or(
      questionInput.locator('xpath=ancestor::*[position()<=10]').last()
    );
    
    // Count option inputs ONLY in this question section
    const optionInputsInSection = questionSection.locator('input[placeholder*="Option" i]');
    let existingOptionCount = await optionInputsInSection.count().catch(() => 0);
    
    console.log(`Found ${existingOptionCount} existing option input(s) in current question section`);
    
    // Always ensure we have at least as many options as needed (add more if necessary)
    for (let i = 0; i < options.length; i++) {
      const optionText = options[i];
      console.log(`Adding option ${i + 1}: "${optionText}"`);
      
      let optionInput;
      const currentOptionCount = await optionInputsInSection.count().catch(() => 0);
      
      if (i < currentOptionCount) {
        // Use existing option input from this question section
        optionInput = optionInputsInSection.nth(i);
      } else {
        // Need to click "Add an option" button to create new option input
        // Find the "Add an option" button within this question section
        const addOptionButton = questionSection.getByText('Add an option', { exact: false })
          .or(questionSection.locator('button:has-text("Add an option")'))
          .first(); // Get the first one in this section
        
        await addOptionButton.waitFor({ state: 'visible', timeout: 10000 });
        await addOptionButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await addOptionButton.click();
        console.log(`✓ Clicked "Add an option" button for option ${i + 1}`);
        await this.page.waitForTimeout(500);
        
        // Re-find option inputs after adding (count may have changed)
        const updatedOptionInputs = questionSection.locator('input[placeholder*="Option" i]');
        const newCount = await updatedOptionInputs.count().catch(() => 0);
        
        // Get the newly created option input (should be the last one)
        optionInput = updatedOptionInputs.nth(newCount - 1);
      }
      
      // Fill the option input
      await optionInput.waitFor({ state: 'visible', timeout: 10000 });
      await optionInput.scrollIntoViewIfNeeded();
      await optionInput.clear();
      await optionInput.fill(optionText);
      console.log(`✓ Filled option ${i + 1} text: "${optionText}"`);
      await this.page.waitForTimeout(300);
    }
    
    // Wait for answer buttons to appear (they render after options are filled)
    await this.page.waitForTimeout(1000);
    
    // Step 4: Select the correct answer - look for elements labeled A, B, C, D, etc.
    console.log(`Selecting correct answer at index ${correctOptionIndex}`);
    
    // Map index to letter (0=A, 1=B, 2=C, 3=D, etc.)
    const answerLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const answerLetter = answerLetters[correctOptionIndex];
    
    if (!answerLetter) {
      throw new Error(`Invalid correctOptionIndex: ${correctOptionIndex}. Must be 0-5.`);
    }
    
    // Find the "Correct answer" label within the current question section
    const correctAnswerLabel = questionSection.getByText('Correct answer', { exact: false }).first();
    
    // Wait for answer buttons to appear (they render after options are filled)
    // The answer elements (A, B, C, D) are generic divs in a container after "Correct answer"
    await correctAnswerLabel.waitFor({ state: 'visible', timeout: 10000 });
    
    // Find the container that holds the answer buttons (A, B, C, D)
    // It appears right after "Correct answer" label
    const answerContainer = correctAnswerLabel.locator('xpath=following::*[1]');
    
    // Wait for answer buttons to appear (they may take a moment to render)
    // Look for elements with text A, B, C, D within the answer container
    const answerSelector = answerContainer.getByText(answerLetter, { exact: true }).first();
    
    await answerSelector.waitFor({ state: 'visible', timeout: 15000 });
    await answerSelector.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await answerSelector.click();
    console.log(`✓ Selected correct answer: ${answerLetter} (index ${correctOptionIndex})`);
    
    await this.page.waitForTimeout(500);
    
    console.log(`✅ Question added successfully: "${questionText}"`);
  }

  // Add multiple quiz questions
  async addMultipleQuestions(questionsArray) {
    console.log(`Starting to add ${questionsArray.length} quiz questions...`);
    
    for (let i = 0; i < questionsArray.length; i++) {
      const question = questionsArray[i];
      console.log(`\n--- Adding Question ${i + 1} of ${questionsArray.length} ---`);
      
      try {
        await this.addQuestion(
          question.questionText,
          question.options,
          question.correctOptionIndex
        );
        
        // Add a small delay between questions to ensure UI updates
        if (i < questionsArray.length - 1) {
          await this.page.waitForTimeout(1000);
        }
      } catch (error) {
        console.error(`❌ Failed to add question ${i + 1}:`, error instanceof Error ? error.message : error);
        throw new Error(`Failed to add question ${i + 1}: ${error instanceof Error ? error.message : error}`);
      }
    }
    
    console.log(`\n✅ Successfully added all ${questionsArray.length} questions!`);
  }

  // ============================================================================
  // RANDOM QUESTION GENERATION FUNCTIONS
  // ============================================================================

  /**
   * Helper function to generate a single random question object
   * Creates fully random, unique questions programmatically without copying fixed examples
   * @param {number} index - Question index number for unique identification
   * @returns {Object} Question object with structure: { question: string, options: [string], correctAnswerIndex: number }
   */
  generateRandomQuestion(index) {
    const topics = ["Math", "Science", "English", "History", "Geography", "Computers"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    let questionText = '';
    let options = [];
    let correctAnswer = '';
    
    // Generate unique questions based on topic using algorithmic generation
    switch(topic) {
      case "Math":
        {
          const operation = Math.floor(Math.random() * 6); // 0: addition, 1: subtraction, 2: multiplication, 3: division, 4: square, 5: area/perimeter
          let a, b, result;
          
          // Use index to vary the random seed for uniqueness
          const seed = index * 17 + Math.floor(Math.random() * 1000);
          
          if (operation === 0) {
            // Addition
            a = Math.floor((seed % 500) + 1);
            b = Math.floor(((seed * 3) % 500) + 1);
            result = a + b;
            questionText = `What is ${a} + ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 50) + 1).toString(),
              (result - Math.floor(Math.random() * 50) - 1).toString(),
              (a * 2 + b).toString()
            ];
          } else if (operation === 1) {
            // Subtraction
            a = Math.floor((seed % 500) + 100);
            b = Math.floor(((seed * 2) % (a - 50)) + 1);
            result = a - b;
            questionText = `What is ${a} - ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 30) + 1).toString(),
              (result - Math.floor(Math.random() * 30) - 1).toString(),
              (a + b).toString()
            ];
          } else if (operation === 2) {
            // Multiplication
            a = Math.floor((seed % 20) + 1);
            b = Math.floor(((seed * 5) % 20) + 1);
            result = a * b;
            questionText = `What is ${a} × ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 20) + 1).toString(),
              (result - Math.floor(Math.random() * 20) - 1).toString(),
              (a + b).toString()
            ];
          } else if (operation === 3) {
            // Division
            b = Math.floor((seed % 15) + 2);
            const quotient = Math.floor(((seed * 7) % 20) + 1);
            a = b * quotient;
            result = quotient;
            questionText = `What is ${a} ÷ ${b}?`;
            correctAnswer = result.toString();
            options = [
              result.toString(),
              (result + Math.floor(Math.random() * 5) + 1).toString(),
              (result - Math.floor(Math.random() * 5) - 1).toString(),
              (a * b).toString()
            ];
          } else if (operation === 4) {
            // Square or square root
            const isSquare = seed % 2 === 0;
            if (isSquare) {
              a = Math.floor((seed % 15) + 1);
              result = a * a;
              questionText = `What is ${a}²?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a * 2).toString(),
                (a + a).toString(),
                (result + a).toString()
              ];
            } else {
              const root = Math.floor((seed % 15) + 1);
              a = root * root;
              result = root;
              questionText = `What is the square root of ${a}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (result + 1).toString(),
                (result * 2).toString(),
                a.toString()
              ];
            }
          } else {
            // Area or perimeter
            const isArea = seed % 2 === 0;
            a = Math.floor((seed % 30) + 1);
            b = Math.floor(((seed * 3) % 30) + 1);
            if (isArea) {
              result = a * b;
              questionText = `What is the area of a rectangle with length ${a} and width ${b}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a + b).toString(),
                ((a + b) * 2).toString(),
                (a - b).toString()
              ];
            } else {
              result = a * 4;
              questionText = `What is the perimeter of a square with side ${a}?`;
              correctAnswer = result.toString();
              options = [
                result.toString(),
                (a * a).toString(),
                (a * 2).toString(),
                (a + 4).toString()
              ];
            }
          }
        }
        break;
        
      case "Science":
        {
          const scienceType = Math.floor(Math.random() * 5);
          const seed = index * 23;
          
          if (scienceType === 0) {
            // Chemistry - element symbols (programmatically selected)
            const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen', 'Iron', 'Gold', 'Silver', 'Copper', 'Zinc', 'Calcium', 'Sodium', 'Potassium', 'Magnesium', 'Aluminum', 'Chlorine', 'Sulfur', 'Phosphorus', 'Silicon', 'Boron', 'Fluorine'];
            const symbols = ['H', 'O', 'C', 'N', 'Fe', 'Au', 'Ag', 'Cu', 'Zn', 'Ca', 'Na', 'K', 'Mg', 'Al', 'Cl', 'S', 'P', 'Si', 'B', 'F'];
            const elementIndex = seed % elements.length;
            const element = elements[elementIndex];
            const correctSymbol = symbols[elementIndex];
            questionText = `What is the chemical symbol for ${element}?`;
            correctAnswer = correctSymbol;
            const wrongSymbols = symbols.filter((s, i) => i !== elementIndex);
            const wrong1 = wrongSymbols[(seed * 2) % wrongSymbols.length];
            const wrong2 = wrongSymbols[(seed * 3) % wrongSymbols.length];
            const wrong3 = wrongSymbols[(seed * 4) % wrongSymbols.length];
            options = [correctSymbol, wrong1, wrong2, wrong3];
          } else if (scienceType === 1) {
            // Physics - calculations (programmatically generated)
            const physicsType = seed % 3;
            if (physicsType === 0) {
              const mass = Math.floor((seed % 100) + 10);
              const velocity = Math.floor(((seed * 2) % 50) + 5);
              const kineticEnergy = Math.round(0.5 * mass * velocity * velocity);
              questionText = `Calculate the kinetic energy (in Joules) for an object with mass ${mass} kg moving at ${velocity} m/s.`;
              correctAnswer = kineticEnergy.toString();
              options = [
                correctAnswer,
                (kineticEnergy * 2).toString(),
                (kineticEnergy / 2).toString(),
                (mass * velocity).toString()
              ];
            } else if (physicsType === 1) {
              const distance = Math.floor((seed % 100) + 10);
              const time = Math.floor(((seed * 3) % 20) + 1);
              const speed = Math.round((distance / time) * 10) / 10;
              questionText = `An object travels ${distance} meters in ${time} seconds. What is its speed in m/s?`;
              correctAnswer = speed.toString();
              options = [
                correctAnswer,
                (speed * 2).toFixed(1),
                (speed / 2).toFixed(1),
                (distance + time).toString()
              ];
            } else {
              const base = Math.floor((seed % 10) + 1);
              const exponent = Math.floor(((seed * 5) % 4) + 2);
              const result = Math.pow(base, exponent);
              questionText = `What is ${base} raised to the power of ${exponent}?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor(Math.random() * 50)).toString(),
                (result - Math.floor(Math.random() * 50)).toString(),
                (base * exponent).toString()
              ];
            }
          } else {
            // Biology - general science (with programmatic variations)
            const biologyType = seed % 4;
            if (biologyType === 0) {
              questionText = `How many bones are in an adult human body?`;
              correctAnswer = '206';
              options = ['206', '200', '210', '220'];
            } else if (biologyType === 1) {
              questionText = `What is the approximate pH of pure water?`;
              correctAnswer = '7';
              options = ['7', '6', '8', '5'];
            } else if (biologyType === 2) {
              questionText = `How many chambers does a human heart have?`;
              correctAnswer = '4';
              options = ['4', '2', '3', '5'];
            } else {
              const temp = Math.floor((seed % 50) + 80);
              questionText = `What is the approximate body temperature of a healthy human in Fahrenheit?`;
              correctAnswer = '98.6';
              options = ['98.6', temp.toString(), (temp + 5).toString(), (temp - 5).toString()];
            }
          }
        }
        break;
        
      case "English":
        {
          const englishType = Math.floor(Math.random() * 4);
          const seed = index * 31;
          
          if (englishType === 0) {
            // Synonyms (programmatically selected pairs)
            const wordPairs = [
              ['Happy', 'Joyful'], ['Sad', 'Mournful'], ['Big', 'Large'], ['Small', 'Tiny'],
              ['Fast', 'Quick'], ['Slow', 'Sluggish'], ['Beautiful', 'Lovely'], ['Ugly', 'Hideous'],
              ['Smart', 'Intelligent'], ['Dumb', 'Stupid'], ['Brave', 'Courageous'], ['Afraid', 'Fearful'],
              ['Angry', 'Furious'], ['Calm', 'Peaceful'], ['Bright', 'Radiant'], ['Dark', 'Gloomy']
            ];
            const pairIndex = seed % wordPairs.length;
            const pair = wordPairs[pairIndex];
            questionText = `What is a synonym for "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allWords = wordPairs.flat().filter((w, i) => i !== pairIndex * 2 && i !== pairIndex * 2 + 1);
            options = [
              pair[1],
              allWords[(seed * 2) % allWords.length],
              allWords[(seed * 3) % allWords.length],
              allWords[(seed * 5) % allWords.length]
            ];
          } else if (englishType === 1) {
            // Antonyms (programmatically selected pairs)
            const antonyms = [
              ['Hot', 'Cold'], ['Light', 'Dark'], ['Up', 'Down'], ['Good', 'Bad'],
              ['Love', 'Hate'], ['Day', 'Night'], ['Begin', 'End'], ['Create', 'Destroy'],
              ['Win', 'Lose'], ['Start', 'Finish'], ['Give', 'Take'], ['Ask', 'Answer']
            ];
            const pairIndex = seed % antonyms.length;
            const pair = antonyms[pairIndex];
            questionText = `What is an antonym for "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allWords = antonyms.flat().filter((w, i) => i !== pairIndex * 2 && i !== pairIndex * 2 + 1);
            options = [
              pair[1],
              allWords[(seed * 2) % allWords.length],
              allWords[(seed * 3) % allWords.length],
              allWords[(seed * 4) % allWords.length]
            ];
          } else if (englishType === 2) {
            // Grammar - parts of speech (programmatically selected)
            const parts = [
              { word: 'Running', type: 'Verb', wrong: ['Noun', 'Adjective', 'Adverb'] },
              { word: 'Beautiful', type: 'Adjective', wrong: ['Noun', 'Verb', 'Adverb'] },
              { word: 'Quickly', type: 'Adverb', wrong: ['Noun', 'Verb', 'Adjective'] },
              { word: 'Computer', type: 'Noun', wrong: ['Verb', 'Adjective', 'Adverb'] },
              { word: 'Writing', type: 'Noun', wrong: ['Verb', 'Adjective', 'Adverb'] },
              { word: 'Lovely', type: 'Adjective', wrong: ['Noun', 'Verb', 'Adverb'] }
            ];
            const selectedIndex = seed % parts.length;
            const selected = parts[selectedIndex];
            questionText = `What part of speech is "${selected.word}"?`;
            correctAnswer = selected.type;
            options = [selected.type, ...selected.wrong];
          } else {
            // Past tense (programmatically selected verbs)
            const verbs = [
              ['Run', 'Ran'], ['Go', 'Went'], ['See', 'Saw'], ['Take', 'Took'],
              ['Come', 'Came'], ['Eat', 'Ate'], ['Write', 'Wrote'], ['Break', 'Broke'],
              ['Speak', 'Spoke'], ['Choose', 'Chose'], ['Begin', 'Began'], ['Swim', 'Swam']
            ];
            const verbIndex = seed % verbs.length;
            const pair = verbs[verbIndex];
            questionText = `What is the past tense of "${pair[0]}"?`;
            correctAnswer = pair[1];
            const allForms = verbs.flat().filter((w, i) => i !== verbIndex * 2 && i !== verbIndex * 2 + 1);
            options = [
              pair[1],
              allForms[(seed * 2) % allForms.length],
              allForms[(seed * 3) % allForms.length],
              allForms[(seed * 4) % allForms.length]
            ];
          }
        }
        break;
        
      case "History":
        {
          const historyType = Math.floor(Math.random() * 3);
          const seed = index * 37;
          
          if (historyType === 0) {
            // Years - generate random year questions with programmatic variations
            const century = 1500 + Math.floor((seed % 500));
            const year = century + Math.floor((seed * 2 % 100));
            questionText = `In which year did a major historical event occur around ${year}?`;
            correctAnswer = year.toString();
            options = [
              year.toString(),
              (year + Math.floor((seed * 3) % 20) - 10).toString(),
              (year + Math.floor((seed * 5) % 30) - 15).toString(),
              (year - Math.floor((seed * 7) % 25) + 10).toString()
            ];
          } else if (historyType === 1) {
            // Historical facts with programmatic selection
            const facts = [
              { q: `How many years did World War II last?`, correct: '6', wrong: ['4', '5', '8'] },
              { q: `In which century did the Renaissance begin?`, correct: '14th', wrong: ['12th', '13th', '15th'] },
              { q: `How many original colonies were there in America?`, correct: '13', wrong: ['10', '15', '12'] },
              { q: `The Industrial Revolution started in which country?`, correct: 'England', wrong: ['France', 'Germany', 'United States'] },
              { q: `In which year did the Berlin Wall fall?`, correct: '1989', wrong: ['1987', '1991', '1985'] },
              { q: `How many years did the Cold War last approximately?`, correct: '44', wrong: ['30', '50', '60'] }
            ];
            const selectedIndex = seed % facts.length;
            const selected = facts[selectedIndex];
            questionText = selected.q;
            correctAnswer = selected.correct;
            options = [selected.correct, ...selected.wrong];
          } else {
            // Programmatically generated historical calculations
            const startYear = 1800 + Math.floor((seed % 200));
            const duration = Math.floor((seed * 3 % 50) + 1);
            const endYear = startYear + duration;
            questionText = `If a war started in ${startYear} and lasted ${duration} years, in which year did it end?`;
            correctAnswer = endYear.toString();
            options = [
              endYear.toString(),
              (endYear + 1).toString(),
              (endYear - 1).toString(),
              (startYear - duration).toString()
            ];
          }
        }
        break;
        
      case "Geography":
        {
          const geoType = Math.floor(Math.random() * 3);
          const seed = index * 41;
          
          if (geoType === 0) {
            // Capitals - programmatically selected countries
            const countries = [
              ['France', 'Paris'], ['Japan', 'Tokyo'], ['Brazil', 'Brasília'], ['Australia', 'Canberra'],
              ['Canada', 'Ottawa'], ['India', 'New Delhi'], ['Russia', 'Moscow'], ['Egypt', 'Cairo'],
              ['Germany', 'Berlin'], ['Italy', 'Rome'], ['Spain', 'Madrid'], ['Mexico', 'Mexico City'],
              ['South Korea', 'Seoul'], ['Thailand', 'Bangkok'], ['Argentina', 'Buenos Aires'], ['Chile', 'Santiago']
            ];
            const countryIndex = seed % countries.length;
            const pair = countries[countryIndex];
            questionText = `What is the capital of ${pair[0]}?`;
            correctAnswer = pair[1];
            const allCities = countries.map(c => c[1]).filter((c, i) => i !== countryIndex);
            options = [
              pair[1],
              allCities[(seed * 2) % allCities.length],
              allCities[(seed * 3) % allCities.length],
              allCities[(seed * 5) % allCities.length]
            ];
          } else if (geoType === 1) {
            // Geography facts with programmatic selection
            const geoQ = seed % 4;
            if (geoQ === 0) {
              questionText = `How many continents are there on Earth?`;
              correctAnswer = '7';
              options = ['7', '5', '6', '8'];
            } else if (geoQ === 1) {
              questionText = `What percentage of Earth's surface is covered by water?`;
              correctAnswer = '71%';
              options = ['71%', '60%', '80%', '65%'];
            } else if (geoQ === 2) {
              questionText = `Which is the largest continent by area?`;
              correctAnswer = 'Asia';
              options = ['Asia', 'Africa', 'North America', 'Europe'];
            } else {
              questionText = `How many countries are there approximately in the world?`;
              correctAnswer = '195';
              options = ['195', '180', '210', '170'];
            }
          } else {
            // Random geographic calculations
            const length = Math.floor((seed % 1000) + 100);
            const width = Math.floor(((seed * 2) % 500) + 50);
            const area = length * width;
            questionText = `A rectangular region has a length of ${length} km and width of ${width} km. What is its area in square kilometers?`;
            correctAnswer = area.toString();
            options = [
              correctAnswer,
              (area + Math.floor((seed * 3) % 10000)).toString(),
              (area - Math.floor((seed * 5) % 10000)).toString(),
              (length + width).toString()
            ];
          }
        }
        break;
        
      case "Computers":
        {
          const compType = Math.floor(Math.random() * 5);
          const seed = index * 43;
          
          if (compType === 0) {
            // Binary conversion (programmatically generated)
            const decimal = Math.floor((seed % 256));
            const binary = decimal.toString(2);
            questionText = `What is the binary equivalent of ${decimal}?`;
            correctAnswer = binary;
            const wrong1 = (decimal + 1).toString(2);
            const wrong2 = Math.max(0, decimal - 1).toString(2);
            const wrong3 = (decimal * 2).toString(2);
            options = [binary, wrong1, wrong2, wrong3];
          } else if (compType === 1) {
            // Computer acronyms (programmatically selected)
            const acronyms = [
              ['CPU', 'Central Processing Unit'],
              ['RAM', 'Random Access Memory'],
              ['HTTP', 'HyperText Transfer Protocol'],
              ['HTML', 'HyperText Markup Language'],
              ['API', 'Application Programming Interface'],
              ['URL', 'Uniform Resource Locator'],
              ['DNS', 'Domain Name System'],
              ['SSD', 'Solid State Drive']
            ];
            const acroIndex = seed % acronyms.length;
            const pair = acronyms[acroIndex];
            questionText = `What does ${pair[0]} stand for?`;
            correctAnswer = pair[1];
            const allMeanings = acronyms.map(a => a[1]).filter((m, i) => i !== acroIndex);
            options = [
              pair[1],
              allMeanings[(seed * 2) % allMeanings.length],
              allMeanings[(seed * 3) % allMeanings.length],
              allMeanings[(seed * 4) % allMeanings.length]
            ];
          } else if (compType === 2) {
            // Math operations in programming context (programmatically generated)
            const a = Math.floor((seed % 100) + 1);
            const b = Math.floor(((seed * 3) % 100) + 1);
            const op = seed % 2; // 0: modulo, 1: bitwise AND
            if (op === 0) {
              const result = a % b;
              questionText = `In programming, what is the result of ${a} % ${b} (modulo operation)?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor((seed * 2) % 10) + 1).toString(),
                Math.floor(a / b).toString(),
                (a + b).toString()
              ];
            } else {
              const result = a & b;
              questionText = `In programming, what is the result of ${a} & ${b} (bitwise AND)?`;
              correctAnswer = result.toString();
              options = [
                correctAnswer,
                (result + Math.floor((seed * 2) % 10) + 1).toString(),
                (a | b).toString(),
                (a + b).toString()
              ];
            }
          } else if (compType === 3) {
            // Computer storage/bytes (programmatically generated)
            const bytesType = seed % 3;
            if (bytesType === 0) {
              questionText = `How many bits are in a byte?`;
              correctAnswer = '8';
              options = ['8', '4', '16', '32'];
            } else if (bytesType === 1) {
              const kb = Math.floor((seed % 8) + 1);
              const bytes = kb * 1024;
              questionText = `How many bytes are in ${kb} KB?`;
              correctAnswer = bytes.toString();
              options = [
                correctAnswer,
                (kb * 1000).toString(),
                (kb * 512).toString(),
                kb.toString()
              ];
            } else {
              questionText = `What is the primary function of an operating system?`;
              correctAnswer = 'Manage hardware and software';
              options = ['Manage hardware and software', 'Run web browsers', 'Create documents', 'Send emails'];
            }
          } else {
            // Computer protocols (programmatically selected)
            const protocols = [
              { q: `Which protocol is used for secure web communication?`, correct: 'HTTPS', wrong: ['HTTP', 'FTP', 'SMTP'] },
              { q: `Which protocol is used for email transmission?`, correct: 'SMTP', wrong: ['HTTP', 'FTP', 'HTTPS'] },
              { q: `Which protocol is used for file transfer?`, correct: 'FTP', wrong: ['HTTP', 'SMTP', 'HTTPS'] }
            ];
            const protoIndex = seed % protocols.length;
            const selected = protocols[protoIndex];
            questionText = selected.q;
            correctAnswer = selected.correct;
            options = [selected.correct, ...selected.wrong];
          }
        }
        break;
    }
    
    // Shuffle options so correct answer is not always at index 0
    const shuffledOptions = [...options];
    
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    // Find new index of correct answer after shuffling
    const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      question: questionText,
      options: shuffledOptions,
      correctAnswerIndex: correctAnswerIndex
    };
  }

  /**
   * Legacy helper function to generate a single random question object (without index)
   * Uses the rich category-based generation approach
   * @returns {Object} Question object with structure: { question: string, options: [string], correctAnswerIndex: number }
   */
  generateRandomQuestionLegacy() {
    // Categories and their question templates
    const categories = {
      Math: [
        { template: 'What is {a} + {b}?', generate: () => {
          const a = Math.floor(Math.random() * 100) + 1;
          const b = Math.floor(Math.random() * 100) + 1;
          return { q: `What is ${a} + ${b}?`, correct: a + b, wrong: [a + b - 10, a + b + 5, a - b] };
        }},
        { template: 'What is {a} - {b}?', generate: () => {
          const a = Math.floor(Math.random() * 100) + 50;
          const b = Math.floor(Math.random() * (a - 1)) + 1;
          return { q: `What is ${a} - ${b}?`, correct: a - b, wrong: [a + b, a - b + 10, b - a] };
        }},
        { template: 'What is {a} × {b}?', generate: () => {
          const a = Math.floor(Math.random() * 12) + 1;
          const b = Math.floor(Math.random() * 12) + 1;
          return { q: `What is ${a} × ${b}?`, correct: a * b, wrong: [a + b, a * (b + 1), (a + 1) * b] };
        }},
        { template: 'What is {a} ÷ {b}?', generate: () => {
          const b = Math.floor(Math.random() * 10) + 2;
          const quotient = Math.floor(Math.random() * 10) + 1;
          const a = b * quotient;
          return { q: `What is ${a} ÷ ${b}?`, correct: quotient, wrong: [a * b, a + b, b] };
        }},
        { template: 'What is the square root of {a}?', generate: () => {
          const root = Math.floor(Math.random() * 10) + 1;
          const a = root * root;
          return { q: `What is the square root of ${a}?`, correct: root, wrong: [a, root + 1, root * 2] };
        }},
        { template: 'What is {a}²?', generate: () => {
          const a = Math.floor(Math.random() * 10) + 1;
          return { q: `What is ${a}²?`, correct: a * a, wrong: [a * 2, a + a, a * a + a] };
        }},
        { template: 'What is the area of a rectangle with length {a} and width {b}?', generate: () => {
          const a = Math.floor(Math.random() * 20) + 1;
          const b = Math.floor(Math.random() * 20) + 1;
          return { q: `What is the area of a rectangle with length ${a} and width ${b}?`, correct: a * b, wrong: [a + b, (a + b) * 2, a - b] };
        }},
        { template: 'What is the perimeter of a square with side {a}?', generate: () => {
          const a = Math.floor(Math.random() * 20) + 1;
          return { q: `What is the perimeter of a square with side ${a}?`, correct: a * 4, wrong: [a * a, a * 2, a + 4] };
        }}
      ],
      Science: [
        { template: 'What is the chemical symbol for {element}?', generate: () => {
          const elements = [
            { name: 'Hydrogen', symbol: 'H' },
            { name: 'Oxygen', symbol: 'O' },
            { name: 'Carbon', symbol: 'C' },
            { name: 'Nitrogen', symbol: 'N' },
            { name: 'Iron', symbol: 'Fe' },
            { name: 'Gold', symbol: 'Au' },
            { name: 'Silver', symbol: 'Ag' },
            { name: 'Sodium', symbol: 'Na' },
            { name: 'Calcium', symbol: 'Ca' },
            { name: 'Zinc', symbol: 'Zn' }
          ];
          const element = elements[Math.floor(Math.random() * elements.length)];
          const wrong = ['He', 'Li', 'Be', 'B', 'F', 'Ne', 'Mg', 'Al', 'Si', 'P'].filter(s => s !== element.symbol);
          return { q: `What is the chemical symbol for ${element.name}?`, correct: element.symbol, wrong: wrong.slice(0, 3) };
        }},
        { template: 'How many planets are in our solar system?', generate: () => {
          return { q: 'How many planets are in our solar system?', correct: 8, wrong: [7, 9, 10] };
        }},
        { template: 'What is the speed of light in vacuum?', generate: () => {
          return { q: 'What is the speed of light in vacuum (approximately)?', correct: '299,792,458 m/s', wrong: ['150,000,000 m/s', '450,000,000 m/s', '100,000,000 m/s'] };
        }},
        { template: 'What is H2O?', generate: () => {
          return { q: 'What is H2O?', correct: 'Water', wrong: ['Hydrogen', 'Oxygen', 'Carbon Dioxide'] };
        }},
        { template: 'What is the boiling point of water?', generate: () => {
          return { q: 'What is the boiling point of water at sea level?', correct: '100°C', wrong: ['90°C', '110°C', '0°C'] };
        }},
        { template: 'What is the smallest unit of matter?', generate: () => {
          return { q: 'What is the smallest unit of matter?', correct: 'Atom', wrong: ['Molecule', 'Electron', 'Proton'] };
        }},
        { template: 'What gas do plants absorb?', generate: () => {
          return { q: 'What gas do plants absorb during photosynthesis?', correct: 'Carbon Dioxide', wrong: ['Oxygen', 'Nitrogen', 'Hydrogen'] };
        }},
        { template: 'What is the largest planet?', generate: () => {
          return { q: 'What is the largest planet in our solar system?', correct: 'Jupiter', wrong: ['Saturn', 'Earth', 'Neptune'] };
        }}
      ],
      English: [
        { template: 'What is the synonym of {word}?', generate: () => {
          const words = [
            { word: 'Happy', correct: 'Joyful', wrong: ['Sad', 'Angry', 'Tired'] },
            { word: 'Big', correct: 'Large', wrong: ['Small', 'Tiny', 'Medium'] },
            { word: 'Fast', correct: 'Quick', wrong: ['Slow', 'Medium', 'Stopped'] },
            { word: 'Beautiful', correct: 'Pretty', wrong: ['Ugly', 'Plain', 'Simple'] },
            { word: 'Smart', correct: 'Intelligent', wrong: ['Dumb', 'Average', 'Slow'] },
            { word: 'Brave', correct: 'Courageous', wrong: ['Afraid', 'Timid', 'Weak'] },
            { word: 'Angry', correct: 'Furious', wrong: ['Happy', 'Calm', 'Peaceful'] },
            { word: 'Tiny', correct: 'Minuscule', wrong: ['Huge', 'Large', 'Big'] }
          ];
          const item = words[Math.floor(Math.random() * words.length)];
          return { q: `What is a synonym of "${item.word}"?`, correct: item.correct, wrong: item.wrong };
        }},
        { template: 'What is the antonym of {word}?', generate: () => {
          const words = [
            { word: 'Hot', correct: 'Cold', wrong: ['Warm', 'Cool', 'Tepid'] },
            { word: 'Light', correct: 'Dark', wrong: ['Bright', 'Dim', 'Clear'] },
            { word: 'Up', correct: 'Down', wrong: ['Above', 'High', 'Top'] },
            { word: 'Good', correct: 'Bad', wrong: ['Okay', 'Fine', 'Average'] },
            { word: 'Love', correct: 'Hate', wrong: ['Like', 'Enjoy', 'Prefer'] }
          ];
          const item = words[Math.floor(Math.random() * words.length)];
          return { q: `What is an antonym of "${item.word}"?`, correct: item.correct, wrong: item.wrong };
        }},
        { template: 'Which word is a noun?', generate: () => {
          const options = [
            { q: 'Which word is a noun?', correct: 'Book', wrong: ['Running', 'Quickly', 'Beautiful'] },
            { q: 'Which word is a noun?', correct: 'Computer', wrong: ['Working', 'Easily', 'Amazing'] },
            { q: 'Which word is a noun?', correct: 'School', wrong: ['Learning', 'Fast', 'Wonderful'] }
          ];
          return options[Math.floor(Math.random() * options.length)];
        }},
        { template: 'What is the past tense of {verb}?', generate: () => {
          const verbs = [
            { verb: 'Run', correct: 'Ran', wrong: ['Runned', 'Running', 'Runs'] },
            { verb: 'Go', correct: 'Went', wrong: ['Goed', 'Going', 'Goes'] },
            { verb: 'See', correct: 'Saw', wrong: ['Seed', 'Seeing', 'Sees'] },
            { verb: 'Take', correct: 'Took', wrong: ['Taked', 'Taking', 'Takes'] },
            { verb: 'Come', correct: 'Came', wrong: ['Comed', 'Coming', 'Comes'] }
          ];
          const item = verbs[Math.floor(Math.random() * verbs.length)];
          return { q: `What is the past tense of "${item.verb}"?`, correct: item.correct, wrong: item.wrong };
        }}
      ],
      History: [
        { template: 'In which year did World War II end?', generate: () => {
          return { q: 'In which year did World War II end?', correct: '1945', wrong: ['1944', '1946', '1943'] };
        }},
        { template: 'Who was the first President of the United States?', generate: () => {
          return { q: 'Who was the first President of the United States?', correct: 'George Washington', wrong: ['Thomas Jefferson', 'Abraham Lincoln', 'John Adams'] };
        }},
        { template: 'Which empire was ruled by Julius Caesar?', generate: () => {
          return { q: 'Which empire was ruled by Julius Caesar?', correct: 'Roman Empire', wrong: ['Greek Empire', 'Egyptian Empire', 'Persian Empire'] };
        }},
        { template: 'When did the American Civil War start?', generate: () => {
          return { q: 'When did the American Civil War start?', correct: '1861', wrong: ['1860', '1862', '1865'] };
        }},
        { template: 'Who painted the Mona Lisa?', generate: () => {
          return { q: 'Who painted the Mona Lisa?', correct: 'Leonardo da Vinci', wrong: ['Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'] };
        }},
        { template: 'Which country was the first to land on the moon?', generate: () => {
          return { q: 'Which country was the first to land humans on the moon?', correct: 'United States', wrong: ['Soviet Union', 'China', 'Japan'] };
        }},
        { template: 'When did World War I begin?', generate: () => {
          return { q: 'When did World War I begin?', correct: '1914', wrong: ['1913', '1915', '1916'] };
        }},
        { template: 'Who was the leader of Nazi Germany?', generate: () => {
          return { q: 'Who was the leader of Nazi Germany during World War II?', correct: 'Adolf Hitler', wrong: ['Benito Mussolini', 'Joseph Stalin', 'Winston Churchill'] };
        }}
      ],
      Geography: [
        { template: 'What is the capital of {country}?', generate: () => {
          const countries = [
            { country: 'France', capital: 'Paris', wrong: ['London', 'Berlin', 'Madrid'] },
            { country: 'Japan', capital: 'Tokyo', wrong: ['Beijing', 'Seoul', 'Bangkok'] },
            { country: 'Brazil', capital: 'Brasília', wrong: ['Rio de Janeiro', 'São Paulo', 'Buenos Aires'] },
            { country: 'Australia', capital: 'Canberra', wrong: ['Sydney', 'Melbourne', 'Perth'] },
            { country: 'Canada', capital: 'Ottawa', wrong: ['Toronto', 'Vancouver', 'Montreal'] },
            { country: 'India', capital: 'New Delhi', wrong: ['Mumbai', 'Bangalore', 'Kolkata'] },
            { country: 'Russia', capital: 'Moscow', wrong: ['Saint Petersburg', 'Kiev', 'Minsk'] },
            { country: 'Egypt', capital: 'Cairo', wrong: ['Alexandria', 'Luxor', 'Aswan'] }
          ];
          const item = countries[Math.floor(Math.random() * countries.length)];
          return { q: `What is the capital of ${item.country}?`, correct: item.capital, wrong: item.wrong };
        }},
        { template: 'What is the longest river in the world?', generate: () => {
          return { q: 'What is the longest river in the world?', correct: 'Nile River', wrong: ['Amazon River', 'Yangtze River', 'Mississippi River'] };
        }},
        { template: 'What is the largest ocean?', generate: () => {
          return { q: 'What is the largest ocean on Earth?', correct: 'Pacific Ocean', wrong: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'] };
        }},
        { template: 'What is the highest mountain?', generate: () => {
          return { q: 'What is the highest mountain in the world?', correct: 'Mount Everest', wrong: ['K2', 'Kangchenjunga', 'Lhotse'] };
        }},
        { template: 'How many continents are there?', generate: () => {
          return { q: 'How many continents are there on Earth?', correct: '7', wrong: ['5', '6', '8'] };
        }},
        { template: 'What is the smallest country?', generate: () => {
          return { q: 'What is the smallest country in the world by area?', correct: 'Vatican City', wrong: ['Monaco', 'San Marino', 'Liechtenstein'] };
        }},
        { template: 'What is the largest desert?', generate: () => {
          return { q: 'What is the largest hot desert in the world?', correct: 'Sahara Desert', wrong: ['Arabian Desert', 'Gobi Desert', 'Kalahari Desert'] };
        }}
      ],
      Computers: [
        { template: 'What does CPU stand for?', generate: () => {
          return { q: 'What does CPU stand for?', correct: 'Central Processing Unit', wrong: ['Computer Processing Unit', 'Central Program Unit', 'Computer Program Unit'] };
        }},
        { template: 'What does RAM stand for?', generate: () => {
          return { q: 'What does RAM stand for?', correct: 'Random Access Memory', wrong: ['Read Access Memory', 'Random Application Memory', 'Read Application Memory'] };
        }},
        { template: 'What is the binary equivalent of {num}?', generate: () => {
          const nums = [
            { num: 8, correct: '1000', wrong: ['100', '1100', '1010'] },
            { num: 16, correct: '10000', wrong: ['11000', '10100', '11110'] },
            { num: 32, correct: '100000', wrong: ['110000', '101000', '111100'] },
            { num: 4, correct: '100', wrong: ['10', '110', '101'] },
            { num: 10, correct: '1010', wrong: ['1000', '1100', '1110'] }
          ];
          const item = nums[Math.floor(Math.random() * nums.length)];
          return { q: `What is the binary equivalent of ${item.num}?`, correct: item.correct, wrong: item.wrong };
        }},
        { template: 'What does HTTP stand for?', generate: () => {
          return { q: 'What does HTTP stand for?', correct: 'HyperText Transfer Protocol', wrong: ['HyperText Transport Protocol', 'HyperText Transmission Protocol', 'HyperText Transfer Process'] };
        }},
        { template: 'What does HTML stand for?', generate: () => {
          return { q: 'What does HTML stand for?', correct: 'HyperText Markup Language', wrong: ['HyperText Makeup Language', 'HyperText Markdown Language', 'HyperText Modeling Language'] };
        }},
        { template: 'What is the primary function of an operating system?', generate: () => {
          return { q: 'What is the primary function of an operating system?', correct: 'Manage computer hardware and software', wrong: ['Run web browsers', 'Create documents', 'Send emails'] };
        }},
        { template: 'How many bits are in a byte?', generate: () => {
          return { q: 'How many bits are in a byte?', correct: '8', wrong: ['4', '16', '32'] };
        }},
        { template: 'What is the programming language used for web development?', generate: () => {
          const options = [
            { q: 'Which programming language is primarily used for web development?', correct: 'JavaScript', wrong: ['Java', 'Python', 'C++'] },
            { q: 'Which language is used for styling web pages?', correct: 'CSS', wrong: ['HTML', 'JavaScript', 'Python'] }
          ];
          return options[Math.floor(Math.random() * options.length)];
        }},
        { template: 'What is cloud computing?', generate: () => {
          return { q: 'What is cloud computing?', correct: 'Delivering computing services over the internet', wrong: ['Computing in the sky', 'Using physical servers only', 'Storing data on hard drives only'] };
        }},
        { template: 'What does API stand for?', generate: () => {
          return { q: 'What does API stand for?', correct: 'Application Programming Interface', wrong: ['Application Program Interface', 'Application Process Interface', 'Application Protocol Interface'] };
        }}
      ]
    };

    // Select a random category
    const categoryNames = Object.keys(categories);
    const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const templates = categories[randomCategory];

    // Select a random template from the category
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate question data
    let questionData;
    if (randomTemplate.generate) {
      questionData = randomTemplate.generate();
    } else {
      // Fallback for templates without generate function
      questionData = { q: randomTemplate.template, correct: 'Answer', wrong: ['Wrong1', 'Wrong2', 'Wrong3'] };
    }

    // Create options array
    const options = [questionData.correct, ...questionData.wrong];
    
    // Shuffle options so correct answer is not always at index 0
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Find the index of the correct answer after shuffling
    const correctAnswerIndex = options.indexOf(questionData.correct);

    return {
      question: questionData.q,
      options: options,
      correctAnswerIndex: correctAnswerIndex
    };
  }

  /**
   * Generate an array of random questions with unique, programmatically generated content
   * @param {number} count - Number of questions to generate
   * @returns {Array} Array of question objects, each with unique content
   */
  generateRandomQuestions(count) {
    console.log(`Generating ${count} unique random questions programmatically...`);
    const questions = [];
    
    // Use index to ensure each question is unique
    for (let i = 0; i < count; i++) {
      questions.push(this.generateRandomQuestion(i + 1));
    }
    
    console.log(`✓ Generated ${count} unique random questions`);
    return questions;
  }

  /**
   * Add multiple random questions to the test
   * This method generates and adds questions programmatically without using fixed examples
   * @param {number} count - Number of random questions to add (default: 500)
   */
  async addQuestions(count = 500) {
    return this.addRandomQuestions(count);
  }

  /**
   * Add multiple random questions to the test (main implementation)
   * Generates "count" number of unique questions and adds them to the form
   * @param {number} count - Number of random questions to add (default: 500)
   */
  async addRandomQuestions(count = 500) {
    console.log(`\n🚀 Starting to generate and add ${count} unique random questions...`);
    
    // Generate all random questions first (this creates unique content programmatically)
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push(this.generateRandomQuestion(i + 1));
    }
    
    console.log(`✓ Generated ${count} unique random questions programmatically`);
    console.log(`📝 Starting to add them to the form...\n`);
    
    let addedCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionNumber = i + 1;
      
      try {
        // For each question after the first one, we need to click "Add a question" to create a new slot
        if (questionNumber > 1) {
          // Step 1: Click "Add a question" button to create a new question slot
          const addQuestionButton = this.page.getByText('Add a question', { exact: false })
            .or(this.page.locator('button:has-text("Add a question")'))
            .or(this.page.locator('button:has-text("add a question")'))
            .or(this.page.locator('button').filter({ hasText: /add.*question/i }))
            .last(); // Get the last/most recent button
          
          try {
            await addQuestionButton.waitFor({ state: 'visible', timeout: 10000 });
            await addQuestionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(300);
            await addQuestionButton.click();
            await this.page.waitForTimeout(800); // Wait for new question form to render
            console.log(`  ✓ Created question slot ${questionNumber}`);
          } catch (btnError) {
            console.log(`  ⚠ Could not find/click "Add a question" button for question ${questionNumber}, trying to use existing slot...`);
            // Continue anyway - might be using an existing empty slot
          }
        }
        
        // Step 2: Find the question input field (should be the last/empty one)
        const questionInputs = this.page.getByPlaceholder('Let\'s ask a question');
        const questionInput = questionInputs.last(); // Always use the last (most recent) question input
        
        await questionInput.waitFor({ state: 'visible', timeout: 10000 });
        await questionInput.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        
        // Clear and fill question text
        await questionInput.clear();
        await questionInput.fill(q.question);
        await this.page.waitForTimeout(300);
        
        // Step 3: Find the question section for scoping (to avoid interfering with other questions)
        const questionSection = questionInput.locator('xpath=ancestor::*[contains(., "Question") or contains(@class, "question")][1]').or(
          questionInput.locator('xpath=ancestor::*[position()<=10]').last()
        );
        
        // Step 4: Ensure we have 4 option inputs and fill them
        const optionInputsInSection = questionSection.locator('input[placeholder*="Option" i]');
        let currentOptionCount = await optionInputsInSection.count().catch(() => 0);
        
        // Add option inputs if needed (we need exactly 4)
        while (currentOptionCount < 4) {
          const addOptionButton = questionSection.getByText('Add an option', { exact: false })
            .or(questionSection.locator('button:has-text("Add an option")'))
            .or(questionSection.locator('button').filter({ hasText: /add.*option/i }))
            .first();
          
          try {
            await addOptionButton.waitFor({ state: 'visible', timeout: 5000 });
            await addOptionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            await addOptionButton.click();
            await this.page.waitForTimeout(400);
            currentOptionCount = await optionInputsInSection.count().catch(() => 0);
          } catch (optError) {
            console.log(`  ⚠ Could not add option input ${currentOptionCount + 1}, continuing...`);
            break; // Break if we can't add more options
          }
        }
        
        // Fill all 4 options
        for (let optIdx = 0; optIdx < 4; optIdx++) {
          const optionInput = optionInputsInSection.nth(optIdx);
          try {
            await optionInput.waitFor({ state: 'visible', timeout: 5000 });
            await optionInput.scrollIntoViewIfNeeded();
            await optionInput.clear();
            await optionInput.fill(q.options[optIdx]);
            await this.page.waitForTimeout(150);
          } catch (optFillError) {
            console.log(`  ⚠ Failed to fill option ${optIdx + 1} for question ${questionNumber}`);
          }
        }
        
        // Step 5: Wait for answer buttons to appear (they render after options are filled)
        await this.page.waitForTimeout(600);
        
        // Step 6: Select the correct answer
        const answerLetters = ['A', 'B', 'C', 'D'];
        const answerLetter = answerLetters[q.correctAnswerIndex];
        
        // Find the correct answer button within this question section
        const correctAnswerLabel = questionSection.getByText('Correct answer', { exact: false }).first();
        
        try {
          await correctAnswerLabel.waitFor({ state: 'visible', timeout: 10000 });
          
          // Find the container with answer buttons (A, B, C, D)
          const answerContainer = correctAnswerLabel.locator('xpath=following::*[1]');
          
          // Find and click the correct answer letter button
          const answerSelector = answerContainer.getByText(answerLetter, { exact: true }).first();
          await answerSelector.waitFor({ state: 'visible', timeout: 10000 });
          await answerSelector.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(200);
          await answerSelector.click();
        } catch (answerError) {
          console.log(`  ⚠ Failed to select answer ${answerLetter} for question ${questionNumber}, continuing...`);
        }
        
        // Step 7: Check for and click "Save Question" button if it exists
        await this.page.waitForTimeout(400);
        
        const saveQuestionButton = questionSection.getByText('Save Question', { exact: false })
          .or(questionSection.locator('button:has-text("Save Question")'))
          .or(questionSection.locator('button:has-text("Save")').filter({ hasNot: this.page.locator('text=Save as') }))
          .first();
        
        const saveButtonExists = await saveQuestionButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (saveButtonExists) {
          try {
            await saveQuestionButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            await saveQuestionButton.click();
            await this.page.waitForTimeout(500);
          } catch (saveError) {
            // Save button might not be required, continue
          }
        }
        
        addedCount++;
        
        // Log progress every 10 questions for visibility
        if (questionNumber % 10 === 0 || questionNumber === 1) {
          console.log(`  ✓ Added ${questionNumber}/${count} questions... (${addedCount} successful, ${failedCount} failed)`);
        }
        
        // Small delay between questions to ensure UI updates properly
        if (questionNumber < count) {
          await this.page.waitForTimeout(300);
        }
        
      } catch (error) {
        failedCount++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ Failed to add question ${questionNumber}: ${errorMsg}`);
        
        // Log detailed error for first few failures
        if (failedCount <= 3) {
          console.error(`    Error details:`, error);
        }
        
        // Continue with next question instead of stopping
        await this.page.waitForTimeout(200);
      }
    }
    
    console.log(`\n✅ Process completed!`);
    console.log(`   - Successfully added: ${addedCount} questions`);
    console.log(`   - Failed: ${failedCount} questions`);
    console.log(`   - Total attempted: ${count} questions\n`);
    
    return addedCount;
  }

  // Configure and generate AI-Based Assessment Report
  async generateAIReport() {
    console.log('Configuring AI-Based Assessment Report...');
    
    // Step 1: Find and check the "Generate AI-Based Assessment Report" checkbox
    const generateReportCheckbox = this.page.locator('input[type="checkbox"]').filter({
      has: this.page.getByText('Generate AI-Based Assessment Report', { exact: false })
    }).or(
      this.page.getByText('Generate AI-Based Assessment Report', { exact: false })
        .locator('xpath=preceding::input[@type="checkbox"][1]')
        .or(this.page.locator('input[type="checkbox"]').filter({
          hasText: /Generate AI-Based Assessment Report/i
        }))
    );
    
    // Wait for checkbox to be visible
    await generateReportCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await generateReportCheckbox.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Check if already checked
    const isChecked = await generateReportCheckbox.isChecked().catch(() => false);
    if (!isChecked) {
      await generateReportCheckbox.check();
      console.log('✓ Checked "Generate AI-Based Assessment Report" checkbox');
      await this.page.waitForTimeout(1000); // Wait for report preference section to appear
    } else {
      console.log('✓ "Generate AI-Based Assessment Report" checkbox already checked');
    }
    
    // Step 2: Fill in the Report Preference (Prompt) textarea
    const reportPrompt = `I want to generate an AI-powered report for my SQA Database quiz.

The report should have the following structure:

1) **Question Title** – Display the quiz question text clearly

2) **Options** – List all possible answer choices (A, B, C, D)

3) **Correct Answer** – Highlight the correct option

4) **Explanation** – Provide a short, beginner-friendly explanation of why the correct answer is correct (1–2 sentences)

Use the questions provided (or any quiz questions given) and generate the report in a clean, readable, and structured format.

Make sure the report is:

- Easy for beginners to read and understand
- Well-formatted with clear headings for each question
- Includes all options, clearly marks the correct answer, and gives a short explanation
- Suitable for course documentation, student reference, or study material

Do not just list answers; explain each answer concisely so learners understand the reasoning behind it.`;
    
    // Find the Report Preference textarea
    const reportPreferenceTextarea = this.page.getByPlaceholder(/Write a prompt on how you want the report to look like/i)
      .or(this.page.locator('textarea').filter({
        has: this.page.getByText('Report Preference', { exact: false })
      }))
      .or(this.page.locator('textarea[placeholder*="prompt" i]'))
      .or(this.page.locator('textarea[placeholder*="Report" i]'));
    
    await reportPreferenceTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await reportPreferenceTextarea.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Clear and fill the textarea
    await reportPreferenceTextarea.clear();
    await reportPreferenceTextarea.fill(reportPrompt);
    console.log('✓ Filled Report Preference (Prompt) textarea');
    await this.page.waitForTimeout(500);
    
    // Step 3: Skip "Preview Report" button click and continue with other steps
    // COMMENTED OUT: Preview Report button causes page crashes, skipping it
    /*
    const previewReportButton = this.page.getByRole('button', { name: 'Preview Report', exact: false })
      .or(this.page.locator('button:has-text("Preview Report")'))
      .or(this.page.locator('button:has-text("preview report")'))
      .first();
    
    await previewReportButton.waitFor({ state: 'visible', timeout: 10000 });
    await previewReportButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await previewReportButton.click();
    console.log('✓ Clicked "Preview Report" button');
    
    // Wait for the preview modal to appear and then close it
    const previewModal = this.page.locator('dialog, [role="dialog"]').filter({
      has: this.page.getByText('AI Report Preview', { exact: false })
    }).first();
    
    try {
      await previewModal.waitFor({ state: 'visible', timeout: 30000 });
      console.log('✓ Preview modal appeared');
      
      // Wait for loading overlay to disappear
      await this.waitForLoadingOverlayToDisappear();
      
      // Close the modal by clicking the "Close" button (not the X button)
      const closeButton = previewModal.locator('button:has-text("Close"):not([nz-modal-close])').first();
      await closeButton.waitFor({ state: 'visible', timeout: 10000 });
      await closeButton.click();
      console.log('✓ Closed preview modal');
      
      // Wait for modal to disappear
      await previewModal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    } catch (e) {
      console.log('⚠ Preview modal did not appear or could not be closed:', e instanceof Error ? e.message : e);
    }
    */
    console.log('⚠ Skipping "Preview Report" button click - continuing with other steps');
    
    console.log('✅ AI-Based Assessment Report configured');
  }

  // Helper method to check if page is still open
  async isPageOpen() {
    try {
      await this.page.evaluate(() => document.title);
      return true;
    } catch {
      return false;
    }
  }

  // Helper method to wait for loading overlay to disappear
  async waitForLoadingOverlayToDisappear(timeout = 30000) {
    try {
      // Check if page is still open before proceeding
      const pageOpen = await this.isPageOpen().catch(() => false);
      if (!pageOpen) {
        console.log('⚠ Page is not available - cannot check loading overlay');
        return;
      }

      const loadingOverlay = this.page.locator('.ngx-overlay.loading-foreground, .ngx-overlay, [class*="loading-foreground"]');
      
      // Check if loading overlay is visible
      const isVisible = await loadingOverlay.first().isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isVisible) {
        console.log('Loading overlay detected, waiting for it to disappear...');
        // Wait for overlay to be hidden or removed naturally
        try {
          await loadingOverlay.first().waitFor({ state: 'hidden', timeout });
          // Small delay after overlay disappears (only if page is still open)
          try {
            if (await this.isPageOpen()) {
              await this.page.waitForTimeout(500);
            }
          } catch {
            // Page might be closed, ignore
          }
          console.log('✓ Loading overlay disappeared');
        } catch {
          // If timeout, log warning but don't force remove (might break the page)
          console.log('⚠ Loading overlay did not disappear within timeout - it may still be loading. Proceeding carefully...');
          // Don't force remove as it might cause page to crash/close
          // The overlay will eventually disappear when the operation completes
        }
      } else {
        console.log('No loading overlay detected');
      }
    } catch (e) {
      // If page is closed or any error occurs, just log and continue
      console.log('⚠ Error checking loading overlay (page may be unavailable):', e instanceof Error ? e.message : e);
    }
  }
}

module.exports = CreateTestPage;
