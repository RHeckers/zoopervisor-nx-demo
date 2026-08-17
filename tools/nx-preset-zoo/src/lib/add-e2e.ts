import { Tree } from '@nx/devkit';

/**
 * Hand-template a Playwright e2e project at `apps/<app>/e2e` (sibling of the
 * shell). The @nx/playwright/plugin infers the `e2e` target from the config.
 * The config wires E2E_GREP so `tools/affected-e2e.mjs` can filter specs to the
 * affected projects, and the sample spec tags itself with the Nx project names
 * it exercises.
 */
export function addE2e(
  tree: Tree,
  app: string,
  platformTags: string[],
): void {
  const root = `apps/${app}/e2e`;

  tree.write(
    `${root}/project.json`,
    JSON.stringify(
      {
        name: `${app}-e2e`,
        $schema: '../../../node_modules/nx/schemas/project-schema.json',
        projectType: 'application',
        sourceRoot: `${root}/src`,
        implicitDependencies: [app],
        tags: [`app:${app}`, 'type:e2e', ...platformTags],
        targets: {},
      },
      null,
      2,
    ),
  );

  tree.write(
    `${root}/playwright.config.mts`,
    `import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  // E2E_GREP lets tools/affected-e2e.mjs run only specs for affected projects.
  grep: process.env['E2E_GREP'] ? new RegExp(process.env['E2E_GREP']) : undefined,
  use: { baseURL, trace: 'on-first-retry' },
  webServer: {
    command: 'npx nx run ${app}:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
`,
  );

  tree.write(
    `${root}/src/example.spec.ts`,
    `import { test, expect } from '@playwright/test';

// Specs tag themselves with the Nx project names they exercise, so an affected
// run (E2E_GREP) executes only the ones touched by a change.
test('${app} loads', { tag: ['@${app}', '@shared-ui-common'] }, async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
`,
  );

  tree.write(
    `${root}/tsconfig.json`,
    JSON.stringify(
      {
        extends: '../../../tsconfig.base.json',
        compilerOptions: {
          sourceMap: false,
          outDir: 'out-tsc/playwright',
          allowJs: true,
          types: ['node'],
        },
        include: [
          '**/*.ts',
          '**/*.js',
          'playwright.config.mts',
          'src/**/*.spec.ts',
          'src/**/*.spec.js',
          'src/**/*.d.ts',
        ],
      },
      null,
      2,
    ),
  );

  tree.write(
    `${root}/eslint.config.mjs`,
    `import playwright from 'eslint-plugin-playwright';
import baseConfig from '../../../eslint.config.mjs';

export default [
  playwright.configs['flat/recommended'],
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {},
  },
];
`,
  );
}
