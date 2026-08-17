import { Tree, formatFiles, names } from '@nx/devkit';
import { addAppLib } from '../../lib/add-app-lib';
import { assertAppExists } from '../../lib/workspace';
import { FeatureGeneratorSchema } from './schema';

/**
 * Scaffold an app feature with its facade already wired: a thin smart component
 * that injects only the facade, the facade itself, and routes. Tagged
 * `app:<app>` + `type:feature`.
 */
export async function featureGenerator(
  tree: Tree,
  options: FeatureGeneratorSchema,
) {
  const app = names(options.app).fileName;
  assertAppExists(tree, app);
  addAppLib(tree, app, 'feature', options.name);
  await formatFiles(tree);
}

export default featureGenerator;
