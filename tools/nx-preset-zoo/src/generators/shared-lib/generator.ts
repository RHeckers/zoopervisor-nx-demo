import { Tree, formatFiles } from '@nx/devkit';
import { createLib } from '../../lib/create-lib';
import { segment, typeTag } from '../../lib/kinds';
import { stubFor } from '../../lib/stubs';
import { SharedLibGeneratorSchema } from './schema';

/** Create one library under `libs/shared`, tagged `domain:shared` + `type:<k>`. */
export async function sharedLibGenerator(
  tree: Tree,
  options: SharedLibGeneratorSchema,
) {
  const { kind, platform } = options;

  if (platform && kind !== 'ui') {
    throw new Error('--platform is only valid with --kind=ui.');
  }

  const seg = segment(kind);
  const root = platform ? `libs/shared/ui/${platform}` : `libs/shared/${seg}`;
  const importPath = platform
    ? `@zoo/shared/ui/${platform}`
    : `@zoo/shared/${seg}`;
  const projectName = platform ? `shared-ui-${platform}` : `shared-${seg}`;
  const tags = platform
    ? ['domain:shared', 'type:ui', `platform:${platform}`]
    : ['domain:shared', typeTag(kind)];

  const stub = stubFor(kind, projectName);
  createLib(tree, {
    projectName,
    root,
    importPath,
    kind,
    tags,
    files: stub.files,
    indexExports: stub.indexExports,
  });

  await formatFiles(tree);
}

export default sharedLibGenerator;
