import nx from '@nx/eslint-plugin';
import { collectTags } from './tools/collect-tags.mjs';
// --- §5.2 Type constraints (static) ------------------------------------------
// ui and data-access are peers — neither may reach the other. Layers only ever
// depend downward.
const typeConstraints = [
  // The app (its src/ + public/ live under apps/<name>/shell) is the only
  // buildable project per app and may reach any layer.
  { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:*'] },
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: ['type:*'],
    notDependOnLibsWithTags: ['type:shell', 'type:feature'],
  },
  {
    sourceTag: 'type:slice',
    onlyDependOnLibsWithTags: [
      'type:ui',
      'type:data-access',
      'type:util',
      'type:types',
    ],
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:types'],
  },
  {
    sourceTag: 'type:data-access',
    onlyDependOnLibsWithTags: ['type:data-access', 'type:util', 'type:types'],
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util', 'type:types'],
  },
  { sourceTag: 'type:types', onlyDependOnLibsWithTags: ['type:types'] },
];
// --- §5.3 Domain constraints (generated) -------------------------------------
// One rule per real domain: it may only reach itself and shared. `domain:shared`
// is excluded here and pinned by a static rule below.
const domains = [...collectTags(process.cwd(), 'domain:')].filter(
  (tag) => tag !== 'domain:shared',
);
const domainConstraints = domains.map((domain) => ({
  sourceTag: domain,
  onlyDependOnLibsWithTags: [domain, 'domain:shared'],
}));
// --- §5.4 App constraints (generated, allow-list) ----------------------------
// Allow-list form: each rule names only its own app, so adding an app never
// edits an existing rule, and an untagged project is refused rather than
// silently permitted.
const apps = [...collectTags(process.cwd(), 'app:')];
const appConstraints = apps.map((app) => ({
  sourceTag: app,
  onlyDependOnLibsWithTags: [app, 'domain:*'],
}));
// --- §5.5 Platform constraints (static) --------------------------------------
const platformConstraints = [
  {
    sourceTag: 'platform:desktop',
    notDependOnLibsWithTags: ['platform:mobile'],
    bannedExternalImports: ['@capacitor/*'],
  },
  {
    sourceTag: 'platform:mobile',
    notDependOnLibsWithTags: ['platform:desktop'],
  },
];
// --- §5.6 Assembly -----------------------------------------------------------
const depConstraints = [
  ...typeConstraints,
  ...domainConstraints,
  { sourceTag: 'domain:shared', onlyDependOnLibsWithTags: ['domain:shared'] },
  ...appConstraints,
  ...platformConstraints,
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints,
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.json'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
