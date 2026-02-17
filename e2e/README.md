# End-to-End Tests with Playwright

This directory contains comprehensive end-to-end tests for the Syntax Quiz game using [Playwright](https://playwright.dev/).

## Test Coverage

The test suite covers all major game functionality:

### ✅ Passing Tests
1. **Level Selection UI** - Verifies home page elements and level options
2. **Feedback Banner Controls** - Tests pause, resume, and skip buttons
3. **Hint System** - Validates hint button functionality and option elimination
4. **Save Modal** - Tests save functionality and URL generation

### 🔄 Tests in Progress (timing improvements needed)
5. **Navigation** - Home to quiz questions page
6. **Answer & Feedback** - Question answering and feedback display
7. **Score & Streak** - Score tracking and streak calculation
8. **Quiz Completion** - Full quiz playthrough to results page
9. **Results Navigation** - Back button from score page to home
10. **Mixed Answers** - Handling correct and incorrect answers

## Test Features

- **Order-Independent**: Tests don't rely on questions being in a specific order (handles shuffled questions)
- **Component Focused**: Each test validates specific component functionality
- **User-Like Interactions**: Tests simulate real user behavior (clicking, navigating)
- **Comprehensive Assertions**: Verifies UI updates, URL changes, and state management

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug
```

## CI/CD Integration

Tests are automatically run on:
- Pull requests to `main` branch
- Pushes to `main` branch

The GitHub Actions workflow:
- Installs Playwright browsers
- Runs all E2E tests
- Uploads test results and screenshots as artifacts
- Reports failures in PR checks

## Test Structure

```
e2e/
└── quiz-game.spec.ts  # Main test suite covering all game functionality
```

## Configuration

Test configuration is in `playwright.config.ts`:
- **Browser**: Chromium (desktop)
- **Base URL**: http://localhost:5173
- **Dev Server**: Auto-starts Vite dev server
- **Retries**: 2 on CI, 0 locally
- **Artifacts**: Screenshots and videos on failure

## Writing New Tests

When adding new features, ensure:
1. Tests are order-independent (handle shuffled questions)
2. Use `data-testid` attributes for reliable element selection
3. Add appropriate waits for async operations
4. Test both success and error cases
5. Verify URL updates and query parameters

## Troubleshooting

### Tests timing out
- Increase `page.waitForLoadState('networkidle')` usage
- Add explicit waits for dynamic content
- Check dev server is running properly

### Flaky tests
- Use `data-testid` attributes instead of CSS selectors
- Add `.catch()` handlers for optional elements
- Increase timeout for slow operations

### Can't find elements
- Verify element selectors in browser DevTools
- Check if element is hidden or disabled
- Use Playwright Inspector: `npm run test:e2e:debug`
