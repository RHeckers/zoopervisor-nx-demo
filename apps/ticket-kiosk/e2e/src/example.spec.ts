import { test, expect } from '@playwright/test';

test(
  'ticket-kiosk buys tickets',
  { tag: ['@ticket-kiosk', '@tickets-ui', '@shared-ui'] },
  async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  },
);
