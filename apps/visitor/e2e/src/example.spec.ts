import { test, expect } from '@playwright/test';

// Tags name the Nx projects this spec exercises, so an affected run (E2E_GREP)
// only executes it when one of them changed.
test(
  'visitor shows the animal list',
  { tag: ['@visitor', '@animals-ui', '@enclosures-ui', '@shared-ui-common'] },
  async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  },
);
