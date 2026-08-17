import { Tree, getProjects } from '@nx/devkit';

/** All values found across every project's `tags` for a given prefix. */
function tagValues(tree: Tree, prefix: string): Set<string> {
  const values = new Set<string>();
  for (const [, project] of getProjects(tree)) {
    for (const tag of project.tags ?? []) {
      if (tag.startsWith(prefix)) values.add(tag.slice(prefix.length));
    }
  }
  return values;
}

/** Domains that already have at least one library (`domain:` tag), minus shared. */
export function existingDomains(tree: Tree): Set<string> {
  const domains = tagValues(tree, 'domain:');
  domains.delete('shared');
  return domains;
}

/** Apps that already exist (`app:` tag). */
export function existingApps(tree: Tree): Set<string> {
  return tagValues(tree, 'app:');
}

/** Fail loudly when a generator targets a domain that was never created. */
export function assertDomainExists(tree: Tree, domain: string): void {
  const domains = existingDomains(tree);
  if (!domains.has(domain)) {
    throw new Error(
      `Domain "${domain}" does not exist. Known domains: ${
        [...domains].sort().join(', ') || '(none)'
      }. Create it first with: nx g @zoo/nx-preset-zoo:domain ${domain}`,
    );
  }
}

/** Fail loudly when a generator targets an app that was never created. */
export function assertAppExists(tree: Tree, app: string): void {
  const apps = existingApps(tree);
  if (!apps.has(app)) {
    throw new Error(
      `App "${app}" does not exist. Known apps: ${
        [...apps].sort().join(', ') || '(none)'
      }. Create it first with: nx g @zoo/nx-preset-zoo:app ${app}`,
    );
  }
}
