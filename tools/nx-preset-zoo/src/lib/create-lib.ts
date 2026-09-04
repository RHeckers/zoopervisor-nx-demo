import {
  Tree,
  addProjectConfiguration,
  generateFiles,
  offsetFromRoot,
  updateJson,
} from '@nx/devkit';
import { join } from 'node:path';
import { ANGULAR_KINDS, LibKind, SELECTOR_PREFIX } from './kinds';

/** Template sources live with the generators; `.template` suffixes are stripped. */
const TEMPLATE_ROOT = join(__dirname, '..', 'generators', 'files');

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

  if (isAngular) {
    // `prefix` is not part of the ProjectConfiguration type, but the
    // @nx/angular component/directive generators read it from project.json to
    // default their selectors — so it goes in after the typed write.
    updateJson(tree, `${root}/project.json`, (json) => ({
      ...json,
      prefix: SELECTOR_PREFIX,
    }));
  }

  // --- boilerplate: tsconfig trio, vitest config, test setup ---------------
  generateFiles(tree, join(TEMPLATE_ROOT, 'lib'), root, {
    offset,
    root,
    projectName,
  });

  // --- eslint (per project, extends the computed root config) --------------
  generateFiles(
    tree,
    join(TEMPLATE_ROOT, isAngular ? 'eslint-angular' : 'eslint-plain'),
    root,
    { offset, prefix: SELECTOR_PREFIX },
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
    generateFiles(tree, join(TEMPLATE_ROOT, 'smoke'), root, { projectName });
  }

  // --- register the @zoo/* path -------------------------------------------
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions ??= {};
    json.compilerOptions.paths ??= {};
    // Leading `./` keeps the value relative so no tsconfig `baseUrl` is needed
    // (the Angular compiler rejects non-relative path values without one).
    json.compilerOptions.paths[importPath] = [`./${root}/src/index.ts`];
    return json;
  });
}
