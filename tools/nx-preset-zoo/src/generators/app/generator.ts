import {
  Tree,
  formatFiles,
  names,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { applicationGenerator, E2eTestRunner } from '@nx/angular/generators';
import { addE2e } from '../../lib/add-e2e';
import { AppGeneratorSchema } from './schema';

/**
 * Create an Angular app. Everything the app owns — src/, public/, the root
 * component, app.config, routing — lives under `apps/<name>/shell`, which is
 * the one buildable project (tagged `type:app` + `app:<name>` + platform). The
 * app's features/slices/data-access/ui are generated as siblings under
 * `apps/<name>/`, so the shell's lint/build never reaches into them. The e2e
 * project is added separately (see tools/affected-e2e + the e2e step).
 */
export async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  const app = names(options.name).fileName;
  const platformTags = options.platform ? [`platform:${options.platform}`] : [];

  await applicationGenerator(tree, {
    directory: `apps/${app}/shell`,
    name: app,
    routing: true,
    style: 'scss',
    prefix: 'app',
    e2eTestRunner: E2eTestRunner.None,
    skipFormat: true,
  });

  // Tag the buildable app (rooted at apps/<name>/shell).
  const appCfg = readProjectConfiguration(tree, app);
  appCfg.tags = [`app:${app}`, 'type:app', ...platformTags];
  updateProjectConfiguration(tree, app, appCfg);

  // e2e sibling at apps/<name>/e2e.
  addE2e(tree, app, platformTags);

  await formatFiles(tree);
}

export default appGenerator;
