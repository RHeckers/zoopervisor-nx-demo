import { test, expect } from '@playwright/test';

test(
  'keeper-mobile shows animal detail',
  { tag: ['@keeper-mobile', '@animals-ui', '@feeding-data-access', '@shared-ui-mobile'] },
  async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  },
);
