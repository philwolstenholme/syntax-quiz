import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function auditTheme(page: import('@playwright/test').Page, theme: 'light' | 'dark') {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Set theme via localStorage and reload
  await page.evaluate((t) => {
    localStorage.setItem('syntax-quiz-theme', t);
  }, theme);
  await page.reload();
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .withRules(['color-contrast'])
    .analyze();

  if (results.violations.length > 0) {
    console.log(`\n=== ${theme.toUpperCase()} THEME CONTRAST VIOLATIONS ===`);
    for (const v of results.violations) {
      console.log(`\nRule: ${v.id} - ${v.help}`);
      for (const node of v.nodes) {
        console.log(`  Element: ${node.html.slice(0, 120)}`);
        for (const failure of node.any) {
          console.log(`  Failure: ${failure.message}`);
          if (failure.data) console.log(`  Data: ${JSON.stringify(failure.data)}`);
        }
      }
    }
  } else {
    console.log(`\n=== ${theme.toUpperCase()} THEME: No contrast violations ===`);
  }
}

test('contrast audit - light theme', async ({ page }) => {
  await auditTheme(page, 'light');
});

test('contrast audit - dark theme', async ({ page }) => {
  await auditTheme(page, 'dark');
});
