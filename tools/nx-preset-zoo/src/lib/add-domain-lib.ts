import { Tree, names } from '@nx/devkit';
import { createLib } from './create-lib';
import { LibKind, segment, typeTag } from './kinds';
import { stubFor } from './stubs';

export type DomainLibKind = Extract<
  LibKind,
  'data-access' | 'ui' | 'util' | 'types' | 'slice' | 'feature'
>;

/**
 * Add one library to a domain and return its import path. The domain itself is
 * just a folder, not an Nx project — so the first lib of a fresh domain simply
 * brings the folder into existence.
 *
 * Unnamed libs are the domain's default of that kind (`libs/<d>/<seg>`). A
 * `name` adds a second lib of the same kind next to it (`libs/<d>/<name>-<seg>`)
 * with its own project name so the graph shows them apart — the tags stay
 * `domain:<d>` + `type:<kind>` either way, because the boundary rules care
 * about the layer, not which lib of that layer. Features are always named and
 * grouped under `features/`, mirroring apps.
 */
export function addDomainLib(
  tree: Tree,
  domain: string,
  kind: DomainLibKind,
  name?: string,
): string {
  let root: string;
  let importPath: string;
  let projectName: string;
  let semanticName: string;

  if (kind === 'feature') {
    if (!name) {
      throw new Error('A feature needs a --name (e.g. health-report).');
    }
    const fname = names(name).fileName;
    root = `libs/${domain}/features/${fname}`;
    importPath = `@zoo/${domain}/features/${fname}`;
    projectName = `${domain}-${fname}`;
    semanticName = fname;
  } else if (name) {
    const fname = names(name).fileName;
    const seg = segment(kind);
    root = `libs/${domain}/${fname}-${seg}`;
    importPath = `@zoo/${domain}/${fname}-${seg}`;
    projectName = `${domain}-${fname}-${seg}`;
    semanticName = fname;
  } else {
    const seg = segment(kind);
    root = `libs/${domain}/${seg}`;
    importPath = `@zoo/${domain}/${seg}`;
    projectName = `${domain}-${seg}`;
    semanticName = domain;
  }

  const stub = stubFor(kind, semanticName);
  createLib(tree, {
    projectName,
    root,
    importPath,
    kind,
    tags: [`domain:${domain}`, typeTag(kind)],
    files: stub.files,
    indexExports: stub.indexExports,
  });

  return importPath;
}
