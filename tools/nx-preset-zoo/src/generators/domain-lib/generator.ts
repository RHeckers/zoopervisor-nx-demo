import { Tree, formatFiles, names } from '@nx/devkit';
import { addDomainLib } from '../../lib/add-domain-lib';
import { assertDomainExists } from '../../lib/workspace';
import { DomainLibGeneratorSchema } from './schema';

/** Add a single library to an existing domain, tagged `domain:<d>` + `type:<k>`. */
export async function domainLibGenerator(
  tree: Tree,
  options: DomainLibGeneratorSchema,
) {
  const domain = names(options.domain).fileName;
  assertDomainExists(tree, domain);
  addDomainLib(tree, domain, options.kind);
  await formatFiles(tree);
}

export default domainLibGenerator;
