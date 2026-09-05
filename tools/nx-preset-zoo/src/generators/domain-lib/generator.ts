import { Tree, formatFiles, names } from '@nx/devkit';
import { addDomainLib } from '../../lib/add-domain-lib';
import { DomainLibGeneratorSchema } from './schema';

/**
 * Add a single library to a domain, tagged `domain:<d>` + `type:<k>`. The
 * domain does not have to exist yet — a domain is only a folder, so its first
 * lib creates it. Nobody is forced through the full `domain` generator. An
 * optional `--name` adds a second lib of an already-present kind (and is
 * required for `feature`).
 */
export async function domainLibGenerator(
  tree: Tree,
  options: DomainLibGeneratorSchema,
) {
  const domain = names(options.domain).fileName;
  addDomainLib(tree, domain, options.kind, options.name);
  await formatFiles(tree);
}

export default domainLibGenerator;
