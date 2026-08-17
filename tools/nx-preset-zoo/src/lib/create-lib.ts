import {
  Tree,
  addProjectConfiguration,
  offsetFromRoot,
  updateJson,
} from '@nx/devkit';
import { ANGULAR_KINDS, LibKind, SELECTOR_PREFIX } from './kinds';

export interface CreateLibOptions {
  /** Nx project name, unique across the workspace (e.g. `animals-data-access`). */
  projectName: string;
  /** Workspace-relative project root (e.g. `libs/animals/data-access`). */
  root: string;
  /** TS path alias the lib is imported as (e.g. `@zoo/animals/data-access`). */
  importPath: string;
  /** The layer this lib represents. */
  kind: LibKind;
  /** Tags written verbatim into project.json — the whole point of the generators. */
  tags: string[];
  /** Source files, keyed by path relative to the project root. */
  files?: Record<string, string>;
  /** Lines placed inside `src/index.ts` (the public surface). */
  indexExports?: string[];
}

/**
 * Scaffold one non-buildable library: no package.json, TS path alias only,
 * a vitest smoke target so `nx affected -t test` has something to run, and the
 * tags the boundary rules enforce. Every generator funnels through here so the
 * shape is identical everywhere.
 */
export function createLib(tree: Tree, options: CreateLibOptions): void {
  const { projectName, root, importPath, kind, tags } = options;
  const offset = offsetFromRoot(root);
  const isAngular = ANGULAR_KINDS.has(kind);

  addProjectConfiguration(tree, projectName, {
    root,
    projectType: 'library',
    sourceRoot: `${root}/src`,
    prefix: SELECTOR_PREFIX,
    tags,
    targets: {
      test: {
        executor: '@nx/vitest:test',
        outputs: ['{options.reportsDirectory}'],
        options: { reportsDirectory: `coverage/${root}` },
      },
      lint: { executor: '@nx/eslint:lint' },
    },
  });

  // --- tsconfig trio -------------------------------------------------------
  tree.write(
    `${root}/tsconfig.json`,
    JSON.stringify(
      {
        extends: `${offset}tsconfig.base.json`,
        compilerOptions: {
          isolatedModules: true,
          target: 'es2022',
          strict: true,
          noImplicitOverride: true,
          noPropertyAccessFromIndexSignature: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          emitDecoratorMetadata: false,
          module: 'preserve',
        },
        angularCompilerOptions: {
          enableI18nLegacyMessageIdFormat: false,
          strictInjectionParameters: true,
          strictInputAccessModifiers: true,
          strictTemplates: true,
        },
        files: [],
        include: [],
        references: [
          { path: './tsconfig.lib.json' },
          { path: './tsconfig.spec.json' },
        ],
      },
      null,
      2,
    ),
  );

  tree.write(
    `${root}/tsconfig.lib.json`,
    JSON.stringify(
      {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: `${offset}dist/out-tsc`,
          declaration: true,
          declarationMap: true,
          inlineSources: true,
          types: [],
        },
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'vite.config.mts',
          'src/test-setup.ts',
        ],
      },
      null,
      2,
    ),
  );

  tree.write(
    `${root}/tsconfig.spec.json`,
    JSON.stringify(
      {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: `${offset}dist/out-tsc`,
          types: [
            'vitest/globals',
            'vitest/importMeta',
            'vite/client',
            'node',
            'vitest',
          ],
        },
        include: [
          'vite.config.mts',
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/**/*.d.ts',
        ],
        files: ['src/test-setup.ts'],
      },
      null,
      2,
    ),
  );

  // --- vitest --------------------------------------------------------------
  tree.write(
    `${root}/vite.config.mts`,
    `/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '${offset}node_modules/.vite/${root}',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  test: {
    name: '${projectName}',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '${offset}coverage/${root}',
      provider: 'v8' as const,
    },
  },
}));
`,
  );

  tree.write(
    `${root}/src/test-setup.ts`,
    `// Zoneless workspace — no zone.js. Angular TestBed auto-initialises via
// @analogjs/vite-plugin-angular; add setup here if a spec needs it.
export {};
`,
  );

  // --- eslint (per project, extends the computed root config) --------------
  tree.write(
    `${root}/eslint.config.mjs`,
    isAngular
      ? `import nx from '@nx/eslint-plugin';
import baseConfig from '${offset}eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: '${SELECTOR_PREFIX}', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: '${SELECTOR_PREFIX}', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
];
`
      : `import baseConfig from '${offset}eslint.config.mjs';

export default [...baseConfig];
`,
  );

  // --- public surface ------------------------------------------------------
  const indexExports = options.indexExports ?? [];
  tree.write(
    `${root}/src/index.ts`,
    indexExports.length ? indexExports.join('\n') + '\n' : 'export {};\n',
  );

  // --- caller-provided source ---------------------------------------------
  for (const [rel, content] of Object.entries(options.files ?? {})) {
    tree.write(`${root}/${rel}`, content);
  }

  // --- smoke spec so `nx affected -t test` always has a target -------------
  const hasSpec = Object.keys(options.files ?? {}).some((f) =>
    /\.spec\.ts$/.test(f),
  );
  if (!hasSpec) {
    tree.write(
      `${root}/src/lib/${projectName}.smoke.spec.ts`,
      `describe('${projectName}', () => {
  it('is wired up', () => {
    expect(true).toBe(true);
  });
});
`,
    );
  }

  // --- register the @zoo/* path -------------------------------------------
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions ??= {};
    json.compilerOptions.paths ??= {};
    json.compilerOptions.paths[importPath] = [`${root}/src/index.ts`];
    return json;
  });
}
