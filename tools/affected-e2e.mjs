/*
 * Run only the e2e specs that exercise an affected library (§11).
 *
 *   1. ask Nx for the affected libs
 *   2. exit 0 early if there are none
 *   3. build a `@<project>|@<project>` grep from their names
 *   4. spawn `nx affected -t e2e` with E2E_GREP in the environment
 *
 * Each spec tags itself with the Nx project names it exercises, and every
 * playwright.config.mts turns E2E_GREP into `grep`, so only the matching specs
 * run. The `e2e` target declares E2E_GREP as an input in nx.json, so a cache
 * hit can never replay a run made under a different filter.
 *
 * Run: node tools/affected-e2e.mjs   (or: npm run affected:e2e)
 */
import { execSync, spawnSync } from 'node:child_process';

const raw = execSync('npx nx show projects --affected --type=lib --json', {
  encoding: 'utf8',
});
const libs = JSON.parse(raw.trim() || '[]');

if (libs.length === 0) {
  console.log('No affected libs — nothing to e2e.');
  process.exit(0);
}

const grep = libs.map((project) => `@${project}`).join('|');
console.log(`Affected libs → e2e grep:\n  ${grep}\n`);

const result = spawnSync('npx', ['nx', 'affected', '-t', 'e2e'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, E2E_GREP: grep },
});

process.exit(result.status ?? 0);
