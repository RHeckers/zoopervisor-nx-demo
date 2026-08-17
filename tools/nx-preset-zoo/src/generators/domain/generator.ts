import { Tree, formatFiles, names } from '@nx/devkit';
import { addDomainLib } from '../../lib/add-domain-lib';
import { LibKind } from '../../lib/kinds';
import { existingDomains } from '../../lib/workspace';
import { DomainGeneratorSchema } from './schema';

/**
 * Lay down a whole domain at once: data-access, ui, utils and types (and slices
 * with --slices). Each sub-lib is tagged `domain:<name>` + its `type:`.
 */
export async function domainGenerator(
  tree: Tree,
  options: DomainGeneratorSchema,
) {
  const domain = names(options.name).fileName;

  if (existingDomains(tree).has(domain)) {
    throw new Error(`Domain "${domain}" already exists.`);
  }

  const kinds: LibKind[] = ['data-access', 'ui', 'util', 'types'];
  if (options.slices) kinds.push('slice');

  for (const kind of kinds) {
    addDomainLib(tree, domain, kind);
  }

  await formatFiles(tree);
}

export default domainGenerator;
