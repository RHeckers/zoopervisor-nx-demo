import { Tree } from '@nx/devkit';
import { createLib } from './create-lib';
import { LibKind, segment, typeTag } from './kinds';
import { stubFor } from './stubs';

/**
 * Add one library to a domain and return its import path. The `domain`
 * generator uses this to lay down a whole domain at once; `domain-lib` calls it
 * after asserting the domain already exists.
 */
export function addDomainLib(tree: Tree, domain: string, kind: LibKind): string {
  const seg = segment(kind);
  const root = `libs/${domain}/${seg}`;
  const importPath = `@zoo/${domain}/${seg}`;
  const stub = stubFor(kind, domain);

  createLib(tree, {
    projectName: `${domain}-${seg}`,
    root,
    importPath,
    kind,
    tags: [`domain:${domain}`, typeTag(kind)],
    files: stub.files,
    indexExports: stub.indexExports,
  });

  return importPath;
}
