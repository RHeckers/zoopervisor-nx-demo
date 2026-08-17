import { test, expect } from '@playwright/test';

// Specs tag themselves with the Nx project names they exercise, so an affected
// run (E2E_GREP) executes only the ones touched by a change.
test(
  'keeper-mobile loads',
  { tag: ['@keeper-mobile', '@shared-ui'] },
  async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  },
);
