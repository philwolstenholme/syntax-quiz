import { expect, test, type Locator, type Page } from '@playwright/test';
import { levels } from '../src/data/questions';

const FEEDBACK_BUTTON_TIMEOUT_MS = 5_000;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value);

const getLevel = (levelId: number) => {
  const level = levels.find((entry) => entry.id === levelId);
  expect(level, `Missing level ${levelId}`).toBeDefined();
  return level!;
};

const pickLevel = async (page: Page, levelId: number) => {
  await page.goto('/');
  await page.getByRole('link', { name: new RegExp(`Level ${levelId}`) }).click();
  await expect(page).toHaveURL(new RegExp(`/level/${levelId}/questions$`));
};

const currentQuestionPanel = (page: Page): Locator => page.getByTestId('question-panel').last();

const getCurrentQuestion = async (page: Page, levelId: number) => {
  const panel = currentQuestionPanel(page);
  await expect(panel).toBeVisible();

  const indexValue = await panel.getAttribute('data-question-index');
  expect(indexValue, 'Expected question panel to expose data-question-index').toBeTruthy();

  const originalIndex = Number.parseInt(indexValue!, 10);
  const level = getLevel(levelId);
  const question = level.questions[originalIndex];

  expect(question, `Missing question at index ${originalIndex} for level ${levelId}`).toBeDefined();

  return { panel, question };
};

const waitForAndDismissFeedback = async (page: Page) => {
  const feedbackBanner = page.getByTestId('feedback-banner');
  const skipFeedback = page.getByRole('button', { name: 'Skip Feedback' });
  const nextQuestion = page.getByRole('button', { name: 'Next Question' });

  await expect(feedbackBanner).toBeVisible();

  await Promise.race([
    skipFeedback.waitFor({ state: 'visible', timeout: FEEDBACK_BUTTON_TIMEOUT_MS }),
    nextQuestion.waitFor({ state: 'visible', timeout: FEEDBACK_BUTTON_TIMEOUT_MS }),
  ]);

  if (await skipFeedback.isVisible()) {
    await skipFeedback.click();
  } else {
    await nextQuestion.click();
  }

  await expect(feedbackBanner).not.toBeVisible();
};

const answerQuestionCorrectly = async (page: Page, levelId: number) => {
  const { panel, question } = await getCurrentQuestion(page, levelId);

  await panel
    .getByRole('button', { name: new RegExp(`^${escapeRegExp(question.correct)}$`) })
    .click();
};

const answerQuestionIncorrectly = async (page: Page, levelId: number) => {
  const { panel, question } = await getCurrentQuestion(page, levelId);
  const wrongAnswer = question.options.find((option) => option !== question.correct);

  expect(wrongAnswer, `Could not find wrong answer for ${question.question}`).toBeDefined();

  await panel
    .getByRole('button', { name: new RegExp(`^${escapeRegExp(wrongAnswer!)}$`) })
    .click();
};

const runPerfectLevel = async (page: Page, levelId: number) => {
  const level = getLevel(levelId);

  await pickLevel(page, levelId);

  for (let index = 0; index < level.questions.length; index += 1) {
    await answerQuestionCorrectly(page, levelId);
    await waitForAndDismissFeedback(page);
  }

  await expect(page).toHaveURL(new RegExp(`/level/${levelId}/score$`));
  await expect(page.getByRole('heading', { name: 'Quiz Complete!' })).toBeVisible();
  await expect(page.locator('text=Total Score').locator('..')).toContainText(
    formatNumber(10 * level.questions.length * (level.questions.length + 1) / 2),
  );
  await expect(page.getByText('Accuracy').locator('..')).toContainText('100%');
  await expect(page.getByText('Correct').locator('..')).toContainText(String(level.questions.length));
};

const getIncorrectlyAnsweredIndices = (totalQuestions: number): Set<number> => {
  const wrongAnswerCount = Math.floor(totalQuestions * 0.25);
  const result = new Set<number>();

  for (let index = 0; index < wrongAnswerCount; index += 1) {
    result.add(index * 4);
  }

  return result;
};

const calculateExpectedScoreWithRetry = (totalQuestions: number, incorrectlyAnswered: Set<number>): number => {
  let score = 0;
  let streak = 0;

  for (let index = 0; index < totalQuestions; index += 1) {
    if (incorrectlyAnswered.has(index)) {
      streak = 0;
      continue;
    }

    streak += 1;
    score += 10 * streak;
  }

  for (let index = 0; index < incorrectlyAnswered.size; index += 1) {
    streak += 1;
    score += 10 * streak;
  }

  return score;
};

const runRetryRoundLevel = async (page: Page, levelId: number) => {
  const level = getLevel(levelId);
  const incorrectlyAnsweredIndices = getIncorrectlyAnsweredIndices(level.questions.length);

  await pickLevel(page, levelId);

  for (let index = 0; index < level.questions.length; index += 1) {
    const { panel } = await getCurrentQuestion(page, levelId);
    const originalIndex = Number.parseInt((await panel.getAttribute('data-question-index'))!, 10);

    if (incorrectlyAnsweredIndices.has(originalIndex)) {
      await answerQuestionIncorrectly(page, levelId);
    } else {
      await answerQuestionCorrectly(page, levelId);
    }

    await waitForAndDismissFeedback(page);
  }

  await expect(page).toHaveURL(new RegExp(`/level/${levelId}/questions$`));
  await expect(page.getByText(new RegExp(`Retry Round — reviewing ${incorrectlyAnsweredIndices.size} missed`))).toBeVisible();

  for (let index = 0; index < incorrectlyAnsweredIndices.size; index += 1) {
    await answerQuestionCorrectly(page, levelId);
    await waitForAndDismissFeedback(page);
  }

  const expectedScore = calculateExpectedScoreWithRetry(level.questions.length, incorrectlyAnsweredIndices);

  await expect(page).toHaveURL(new RegExp(`/level/${levelId}/score$`));
  await expect(page.getByRole('heading', { name: 'Quiz Complete!' })).toBeVisible();
  await expect(page.locator('text=Total Score').locator('..')).toContainText(formatNumber(expectedScore));
  await expect(page.getByText('Correct').locator('..')).toContainText(String(level.questions.length));
};

const getScoreValue = async (page: Page): Promise<number> => {
  const scoreText = await page.getByTestId('score-value').locator('span').last().innerText();
  return Number.parseInt(scoreText.replace(/,/g, ''), 10);
};

const getStreakValue = async (page: Page): Promise<number> => {
  const streakText = await page.getByTestId('streak-value').locator('span').last().innerText();
  return Number.parseInt(streakText.replace(/,/g, ''), 10);
};

test.describe('Syntax Quiz perfect-score runs', () => {
  for (const level of levels) {
    test(`scores 100% on ${level.name}`, async ({ page }) => {
      await runPerfectLevel(page, level.id);
    });
  }
});

test('requires retry round when 25% of answers are wrong on Level 1', async ({ page }) => {
  await runRetryRoundLevel(page, 1);
});

test('correct answer shows feedback banner that can be paused/resumed and skipped', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);
  await answerQuestionCorrectly(page, levelId);

  const feedbackBanner = page.getByTestId('feedback-banner');
  await expect(feedbackBanner).toBeVisible();

  const pauseButton = page.getByRole('button', { name: 'Pause Timer' });
  const resumeButton = page.getByRole('button', { name: 'Resume Timer' });
  const skipFeedback = page.getByRole('button', { name: 'Skip Feedback' });

  await expect(pauseButton).toBeVisible();
  await expect(skipFeedback).toBeVisible();

  await pauseButton.click();
  await expect(resumeButton).toBeVisible();

  await resumeButton.click();
  await expect(pauseButton).toBeVisible();

  await skipFeedback.click();
  await expect(feedbackBanner).not.toBeVisible();
});

test('incorrect answer shows feedback banner that requires next question click', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);
  await answerQuestionIncorrectly(page, levelId);

  const feedbackBanner = page.getByTestId('feedback-banner');
  const skipFeedback = page.getByRole('button', { name: 'Skip Feedback' });
  const nextQuestion = page.getByRole('button', { name: 'Next Question' });

  await expect(feedbackBanner).toBeVisible();
  await expect(skipFeedback).not.toBeVisible();
  await expect(nextQuestion).toBeVisible();

  await nextQuestion.click();
  await expect(feedbackBanner).not.toBeVisible();
});

test('skip question shows feedback banner that requires next question click', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);
  await currentQuestionPanel(page).getByTestId('skip-question').click();

  const feedbackBanner = page.getByTestId('feedback-banner');
  const skipFeedback = page.getByRole('button', { name: 'Skip Feedback' });
  const nextQuestion = page.getByRole('button', { name: 'Next Question' });

  await expect(feedbackBanner).toBeVisible();
  await expect(skipFeedback).not.toBeVisible();
  await expect(nextQuestion).toBeVisible();

  await nextQuestion.click();
  await expect(feedbackBanner).not.toBeVisible();
});

test('save URL restores score and returns user to question flow', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);
  await answerQuestionCorrectly(page, levelId);
  await waitForAndDismissFeedback(page);

  const scoreBeforeSave = await getScoreValue(page);
  expect(scoreBeforeSave).toBeGreaterThan(0);

  await page.getByRole('button', { name: /Save/i }).click();

  const saveLink = page.locator('a').filter({ hasText: 'Open save link' });
  await expect(saveLink).toBeVisible();

  const savedUrl = await saveLink.getAttribute('href');
  expect(savedUrl).toBeTruthy();
  expect(savedUrl).toContain('?s=');

  await page.goto(savedUrl!);

  await expect(page).toHaveURL(new RegExp(`/level/${levelId}/questions`));
  expect(page.url()).not.toContain('?s=');
  const restoredScore = await getScoreValue(page);
  expect(restoredScore).toBe(scoreBeforeSave);
});

test('level selection page lists available levels and navigates to selected level', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Syntax Quiz' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Level 1/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Level 2/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Level 3/i })).toBeVisible();

  await page.getByRole('link', { name: /Level 2/i }).click();
  await expect(page).toHaveURL(/\/level\/2\/questions$/);
});

test('can answer by dragging an option to the dropzone', async ({ page }) => {
  const levelId = 1;
  const { panel, question } = await (async () => {
    await pickLevel(page, levelId);
    return getCurrentQuestion(page, levelId);
  })();

  const answerButton = panel.getByRole('button', { name: new RegExp(`^${escapeRegExp(question.correct)}$`) });
  await answerButton.dragTo(panel.locator('[data-dropzone]'));

  await expect(page.getByTestId('feedback-banner')).toBeVisible();
  await waitForAndDismissFeedback(page);
});

test('hint flow eliminates answers, reveals hint text, and applies score penalty', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);

  await currentQuestionPanel(page).getByRole('button', { name: /Eliminate 2 Answers/i }).click();

  const disabledOptions = currentQuestionPanel(page)
    .getByTestId('answer-option')
    .locator(':disabled');
  await expect(disabledOptions).toHaveCount(2);

  await currentQuestionPanel(page).getByRole('button', { name: /Show Hint/i }).click();
  await expect(page.getByText(/This appears in the function declaration/i)).toBeVisible();

  await answerQuestionCorrectly(page, levelId);
  await waitForAndDismissFeedback(page);

  const score = await getScoreValue(page);
  expect(score).toBe(3);
});

test('score and streak increment on consecutive correct answers', async ({ page }) => {
  const levelId = 1;

  await pickLevel(page, levelId);

  await answerQuestionCorrectly(page, levelId);
  await waitForAndDismissFeedback(page);

  expect(await getScoreValue(page)).toBe(10);
  expect(await getStreakValue(page)).toBe(1);

  await answerQuestionCorrectly(page, levelId);
  await waitForAndDismissFeedback(page);

  expect(await getScoreValue(page)).toBe(30);
  expect(await getStreakValue(page)).toBe(2);
});
