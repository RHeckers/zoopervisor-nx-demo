import { Tree, formatFiles, names } from '@nx/devkit';
import { createLib } from '../../lib/create-lib';
import { typeTag } from '../../lib/kinds';
import { stubFor } from '../../lib/stubs';
import { PackageGeneratorSchema } from './schema';

/**
 * Create a lib under `packages/`. Packages are tagged `domain:shared` so both
 * the app and domain allow-lists resolve them, plus a `type:` tag.
 */
export async function packageGenerator(
  tree: Tree,
  options: PackageGeneratorSchema,
) {
  const name = names(options.name).fileName;
  const root = `packages/${name}`;
  const stub = stubFor(options.kind, name);

  createLib(tree, {
    projectName: name,
    root,
    importPath: `@zoo/${name}`,
    kind: options.kind,
    tags: ['domain:shared', typeTag(options.kind)],
    files: stub.files,
    indexExports: stub.indexExports,
  });

  await formatFiles(tree);
}

export default packageGenerator;
