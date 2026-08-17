import {
  Tree,
  formatFiles,
  getProjects,
  names,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { applicationGenerator, E2eTestRunner } from '@nx/angular/generators';
import { createLib } from '../../lib/create-lib';
import { stubFor } from '../../lib/stubs';
import { AppGeneratorSchema } from './schema';

/**
 * Create an Angular app plus its shell lib and e2e project, tagged
 * `type:app` / `type:shell` / `type:e2e` and `app:<name>` (and a platform tag
 * when given). The app is a thin bootstrap; the shell owns routing/layout.
 */
export async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  const app = names(options.name).fileName;
  const platformTags = options.platform ? [`platform:${options.platform}`] : [];

  await applicationGenerator(tree, {
    directory: `apps/${app}`,
    name: app,
    routing: true,
    style: 'scss',
    prefix: 'app',
    e2eTestRunner: E2eTestRunner.Playwright,
    skipFormat: true,
  });

  // Tag the buildable app project.
  const appCfg = readProjectConfiguration(tree, app);
  appCfg.tags = [`app:${app}`, 'type:app', ...platformTags];
  updateProjectConfiguration(tree, app, appCfg);

  // Tag the generated e2e project (its name ends with -e2e and points at us).
  for (const [name, cfg] of getProjects(tree)) {
    const isOurE2e =
      name !== app &&
      (cfg.implicitDependencies?.includes(app) || name === `${app}-e2e`);
    if (isOurE2e) {
      cfg.tags = [`app:${app}`, 'type:e2e', ...platformTags];
      updateProjectConfiguration(tree, name, cfg);
    }
  }

  // Add the shell as its own project (type:shell) — routing/layout live here.
  const stub = stubFor('shell', app);
  createLib(tree, {
    projectName: `${app}-shell`,
    root: `apps/${app}/shell`,
    importPath: `@zoo/${app}/shell`,
    kind: 'shell',
    tags: [`app:${app}`, 'type:shell', ...platformTags],
    files: stub.files,
    indexExports: stub.indexExports,
  });

  await formatFiles(tree);
}

export default appGenerator;
