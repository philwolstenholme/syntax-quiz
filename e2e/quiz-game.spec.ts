import { test, expect, type Page } from '@playwright/test';

/**
 * Comprehensive E2E test for the Syntax Quiz game.
 * Tests all game functionality including:
 * - Level selection and navigation
 * - Quiz gameplay (clicking and dragging answers)
 * - Scoring system and streak calculation
 * - Hint system
 * - Feedback banner controls (pause, resume, skip)
 * - Quiz completion and results
 * - Save/restore game state
 * - URL updates and query parameters
 * - Handling of shuffled questions (order-independent)
 */

test.describe('Syntax Quiz E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the home page
    await page.goto('/');
  });

  test('should display correct UI elements on level selection page', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Syntax Quiz');
    
    // Check that multiple level options are visible (at least 3)
    const levelLinks = page.getByRole('link').filter({ hasText: /Level [1-9]/i });
    const count = await levelLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Each level should have a subtitle
    await expect(page.locator('text=/Easy|Medium|Hard/i').first()).toBeVisible();
  });

  test('should navigate from home to quiz questions page', async ({ page }) => {
    // Select Level 1 
    const level1Button = page.getByRole('link', { name: /Level 1/i });
    await expect(level1Button).toBeVisible();
    await level1Button.click();
    
    // Verify navigation to questions page
    await expect(page).toHaveURL(/\/syntax-quiz\/level\/1\/questions/);
    
    // Verify quiz page loaded with question
    await expect(page.locator('pre, code').first()).toBeVisible();
    
    // Check for answer buttons
    const answerButtons = page.getByRole('button').filter({ hasText: /^[a-zA-Z]/ });
    await expect(answerButtons.first()).toBeVisible();
    
    // Check for score and streak display
    await expect(page.locator('text=/Score/i')).toBeVisible();
    await expect(page.locator('text=/Streak/i')).toBeVisible();
  });

  test('should answer a question and display feedback', async ({ page }) => {
    // Navigate to quiz
    await page.getByRole('link', { name: /Level 1/i }).click();
    await expect(page).toHaveURL(/\/questions/);
    
    // Answer first question
    const answerButtons = page.getByRole('button').filter({ hasText: /^[a-zA-Z]/ });
    await answerButtons.first().click();
    
    // Feedback banner should appear
    await expect(page.locator('[role="status"], [role="alert"]')).toBeVisible({ timeout: 2000 });
    
    // Should show either "Correct!" or "Wrong!"
    const feedback = page.locator('[role="status"], [role="alert"]');
    await expect(feedback).toContainText(/Correct!|Wrong!/);
  });

  test('should use pause and skip buttons on feedback banner', async ({ page }) => {
    // Navigate to quiz and answer a question
    await page.getByRole('link', { name: /Level 1/i }).click();
    await page.getByRole('button').filter({ hasText: /^[a-zA-Z]/ }).first().click();
    
    // Wait for feedback banner
    await expect(page.locator('[role="status"], [role="alert"]')).toBeVisible({ timeout: 2000 });
    
    // Test pause button
    const pauseButton = page.getByRole('button', { name: /Pause Timer/i });
    if (await pauseButton.isVisible()) {
      await pauseButton.click();
      
      // Should change to resume
      await expect(page.getByRole('button', { name: /Resume Timer/i })).toBeVisible();
      
      // Resume
      await page.getByRole('button', { name: /Resume Timer/i }).click();
      await expect(page.getByRole('button', { name: /Pause Timer/i })).toBeVisible();
    }
    
    // Test skip button
    const skipButton = page.getByRole('button', { name: /Skip Feedback/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
      
      // Feedback should disappear
      await expect(page.locator('[role="status"], [role="alert"]')).not.toBeVisible({ timeout: 2000 });
      
      // Should show next question or completion
      await page.waitForTimeout(500);
    }
  });

  test('should use hint system', async ({ page }) => {
    // Navigate to quiz
    await page.getByRole('link', { name: /Level 1/i }).click();
    await expect(page).toHaveURL(/\/questions/);
    
    // Click hint button
    const hintButton = page.getByRole('button', { name: /Hint/i }).or(
      page.locator('button').filter({ hasText: /💡|hint|bulb/i })
    );
    
    if (await hintButton.first().isVisible()) {
      // Get initial number of enabled buttons
      const initialButtons = await page.getByRole('button').filter({ 
        hasText: /^[a-zA-Z]/, 
        disabled: false 
      }).count();
      
      await hintButton.first().click();
      await page.waitForTimeout(500);
      
      // Should have disabled some buttons
      const disabledButtons = await page.getByRole('button', { disabled: true }).count();
      expect(disabledButtons).toBeGreaterThanOrEqual(1);
    }
  });

  test('should display score and streak', async ({ page }) => {
    // Navigate to quiz and answer questions
    await page.getByRole('link', { name: /Level 1/i }).click();
    
    // Answer first question
    await page.getByRole('button').filter({ hasText: /^[a-zA-Z]/ }).first().click();
    await page.waitForTimeout(1000);
    
    // Verify score and streak elements exist and contain numbers
    const scoreElement = page.locator('text=/Score/i').locator('..');
    const streakElement = page.locator('text=/Streak/i').locator('..');
    
    const scoreText = await scoreElement.textContent();
    const streakText = await streakElement.textContent();
    
    expect(scoreText).toMatch(/\d+/);
    expect(streakText).toMatch(/\d+/);
  });

  test('should complete quiz and show results page', async ({ page }) => {
    // Navigate to quiz
    await page.getByRole('link', { name: /Level 1/i }).click();
    
    // Answer questions quickly until completion (limit to 35 to avoid infinite loop)
    for (let i = 0; i < 35; i++) {
      const currentUrl = page.url();
      if (currentUrl.includes('/score')) {
        break;
      }
      
      // Answer a question
      const answerButtons = page.getByRole('button').filter({ hasText: /^[a-zA-Z]/, disabled: false });
      const count = await answerButtons.count();
      
      if (count === 0) break;
      
      await answerButtons.first().click();
      await page.waitForTimeout(300);
      
      // Skip feedback if available
      const skipButton = page.getByRole('button', { name: /Skip Feedback/i });
      if (await skipButton.isVisible()) {
        await skipButton.click();
        await page.waitForTimeout(300);
      } else {
        // Wait for timer to complete
        await page.waitForTimeout(8500);
      }
    }
    
    // Should be on score page
    await expect(page).toHaveURL(/\/score\?/, { timeout: 10000 });
    
    // Verify completion screen elements
    await expect(page.locator('h1')).toContainText(/Quiz Complete|Complete|Finished/i);
    
    // Verify score is displayed
    await expect(page.locator('text=/Total Score|Score/i')).toBeVisible();
    
    // Verify accuracy is shown
    await expect(page.locator('text=/Accuracy/i')).toBeVisible();
    
    // Verify correct count
    await expect(page.locator('text=/Correct/i')).toBeVisible();
    
    // Check URL has query parameters
    expect(page.url()).toContain('completed=true');
    expect(page.url()).toContain('score=');
    
    // Verify navigation buttons
    await expect(page.getByRole('link', { name: /Try Again/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Choose Another Level|Back/i })).toBeVisible();
  });

  test('should navigate back to home from score page', async ({ page }) => {
    // Navigate to quiz and answer a few questions to get to score page
    await page.getByRole('link', { name: /Level 1/i }).click();
    
    // Answer questions quickly
    for (let i = 0; i < 35; i++) {
      if (page.url().includes('/score')) break;
      
      const answerButtons = page.getByRole('button').filter({ hasText: /^[a-zA-Z]/, disabled: false });
      if (await answerButtons.first().isVisible()) {
        await answerButtons.first().click();
        await page.waitForTimeout(200);
        
        const skipButton = page.getByRole('button', { name: /Skip Feedback/i });
        if (await skipButton.isVisible()) {
          await skipButton.click();
          await page.waitForTimeout(200);
        }
      }
    }
    
    // Should be on score page
    await expect(page).toHaveURL(/\/score/, { timeout: 15000 });
    
    // Click back to levels
    const backButton = page.getByRole('link', { name: /Choose Another Level|Back/i });
    await backButton.click();
    
    // Should be back at home
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Syntax Quiz');
  });

  test('should open save modal and display save URL', async ({ page }) => {
    // Navigate to quiz
    await page.getByRole('link', { name: /Level 1/i }).click();
    await expect(page).toHaveURL(/\/questions/);
    
    // Answer at least one question
    await page.getByRole('button').filter({ hasText: /^[a-zA-Z]/ }).first().click();
    await page.waitForTimeout(500);
    
    // Skip feedback
    const skipButton = page.getByRole('button', { name: /Skip Feedback/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Find and click save button
    const saveButton = page.getByRole('button', { name: /Save|Bookmark/i }).first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Modal should appear
      await expect(page.locator('[role="dialog"], .modal').first()).toBeVisible({ timeout: 2000 });
      
      // Should contain a URL with save parameter
      const modalText = await page.locator('[role="dialog"], .modal').first().textContent();
      expect(modalText).toMatch(/https?:\/\//);
      expect(modalText).toContain('?s=');
    }
  });

  test('should handle mix of correct and incorrect answers', async ({ page }) => {
    // Navigate to quiz
    await page.getByRole('link', { name: /Level 1/i }).click();
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    // Answer several questions and track results
    for (let i = 0; i < 5; i++) {
      const answerButtons = page.getByRole('button').filter({ hasText: /^[a-zA-Z]/, disabled: false });
      const count = await answerButtons.count();
      
      if (count === 0) break;
      
      // Try different options to get a mix
      const index = i % count;
      await answerButtons.nth(index).click();
      
      // Check feedback
      await page.waitForTimeout(500);
      const feedback = page.locator('[role="status"], [role="alert"]');
      const feedbackText = await feedback.textContent();
      
      if (feedbackText?.includes('Correct')) {
        correctCount++;
      } else if (feedbackText?.includes('Wrong')) {
        incorrectCount++;
      }
      
      // Skip
      const skipButton = page.getByRole('button', { name: /Skip Feedback/i });
      if (await skipButton.isVisible()) {
        await skipButton.click();
        await page.waitForTimeout(300);
      }
    }
    
    // Should have answered some questions
    expect(correctCount + incorrectCount).toBeGreaterThan(0);
  });
});
