import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  // E2E_GREP lets tools/affected-e2e.mjs run only specs for affected projects.
  grep: process.env['E2E_GREP']
    ? new RegExp(process.env['E2E_GREP'])
    : undefined,
  use: { baseURL, trace: 'on-first-retry' },
  webServer: {
    command: 'npx nx run visitor:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
