import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Walk the workspace and gather every project.json `tag` that starts with
 * `prefix` (e.g. 'domain:' or 'app:'). Returns a fresh Set per call and merges
 * the Sets returned by child directories — no accumulator parameter, so the
 * boundary rules can be *computed* at eslint load time instead of hand-listed.
 */
export function collectTags(dir, prefix) {
  const tags = new Set();

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name.startsWith('.')
    ) {
      continue;
    }

    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      for (const tag of collectTags(full, prefix)) tags.add(tag);
    } else if (entry.name === 'project.json') {
      const projectTags = JSON.parse(readFileSync(full, 'utf8')).tags ?? [];
      for (const tag of projectTags) {
        if (tag.startsWith(prefix)) tags.add(tag);
      }
    }
  }

  return tags;
}
