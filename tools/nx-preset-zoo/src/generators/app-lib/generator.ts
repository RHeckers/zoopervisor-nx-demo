import { Tree, formatFiles, names } from '@nx/devkit';
import { addAppLib } from '../../lib/add-app-lib';
import { assertAppExists } from '../../lib/workspace';
import { AppLibGeneratorSchema } from './schema';

/** Create one library inside an existing app (feature / slice / data-access / ui). */
export async function appLibGenerator(
  tree: Tree,
  options: AppLibGeneratorSchema,
) {
  const app = names(options.app).fileName;
  assertAppExists(tree, app);
  addAppLib(tree, app, options.kind, options.name);
  await formatFiles(tree);
}

export default appLibGenerator;
