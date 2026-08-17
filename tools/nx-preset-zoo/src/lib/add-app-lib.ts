import { Tree, names } from '@nx/devkit';
import { createLib } from './create-lib';
import { LibKind, segment, typeTag } from './kinds';
import { stubFor } from './stubs';

export type AppLibKind = Extract<
  LibKind,
  'feature' | 'slice' | 'data-access' | 'ui'
>;

/**
 * Add one library inside an app. Features are named and live under
 * `features/<name>`; slice/data-access/ui are singletons per app. Everything is
 * tagged `app:<app>` + `type:<kind>` — the allow-list boundary rule then lets
 * the app reach it, and refuses any project the app doesn't own.
 */
export function addAppLib(
  tree: Tree,
  app: string,
  kind: AppLibKind,
  name?: string,
): string {
  let root: string;
  let importPath: string;
  let projectName: string;
  let semanticName: string;

  if (kind === 'feature') {
    if (!name) {
      throw new Error('A feature needs a --name (e.g. animal-list).');
    }
    const fname = names(name).fileName;
    root = `apps/${app}/features/${fname}`;
    importPath = `@zoo/${app}/features/${fname}`;
    projectName = `${app}-${fname}`;
    semanticName = fname;
  } else {
    const seg = segment(kind);
    root = `apps/${app}/${seg}`;
    importPath = `@zoo/${app}/${seg}`;
    projectName = `${app}-${seg}`;
    semanticName = `${app}-${seg}`;
  }

  const stub = stubFor(kind, semanticName);
  createLib(tree, {
    projectName,
    root,
    importPath,
    kind,
    tags: [`app:${app}`, typeTag(kind)],
    files: stub.files,
    indexExports: stub.indexExports,
  });

  return importPath;
}
