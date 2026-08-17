/*
 * Demonstrates the deliberate tree-shaking violation (§10).
 *
 * Builds `visitor` in production twice:
 *   1. with the violating util exported from the shared/utils barrel
 *   2. with that export removed
 * and prints the two JS chunk totals plus whether the string `reptile-house`
 * (only present in the violating util's ZONES array) survived into the bundle.
 *
 * The app never imports ZONE_LABELS — it only imports `titleCase` from the same
 * barrel. Because `ZONE_LABELS = ZONES.map(...)` runs at module-eval time,
 * esbuild can't prove the module is inert and keeps it. Move the map inside a
 * function (zone-labels.fixed.util.ts) and it drops out.
 *
 * Run: node tools/show-bundle-retention.mjs   (or: npm run show-retention)
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BARREL = 'libs/shared/utils/src/index.ts';
const BROWSER_DIR = 'dist/apps/visitor/shell/browser';
const NEEDLE = 'reptile-house';

function build(label) {
  execSync('npx nx build visitor --skip-nx-cache', { stdio: 'ignore' });
  let bytes = 0;
  let retained = false;
  for (const file of readdirSync(BROWSER_DIR)) {
    if (!file.endsWith('.js')) continue;
    const buf = readFileSync(join(BROWSER_DIR, file));
    bytes += buf.length;
    if (buf.includes(NEEDLE)) retained = true;
  }
  const kb = (bytes / 1024).toFixed(1);
  console.log(
    `${label.padEnd(34)} ${kb.padStart(8)} kB   "${NEEDLE}" present: ${retained}`,
  );
  return bytes;
}

const original = readFileSync(BARREL, 'utf8');

console.log('Building visitor twice — watch the chunk size and the needle:\n');
const withViolation = build('WITH ZONE_LABELS in barrel');

// Remove the violating export, rebuild, then always restore the barrel.
const patched = original
  .split('\n')
  .filter((line) => !line.includes('zone-labels.util'))
  .join('\n');
writeFileSync(BARREL, patched);
try {
  const without = build('WITHOUT ZONE_LABELS in barrel');
  const delta = ((withViolation - without) / 1024).toFixed(1);
  console.log(`\nDifference: ${delta} kB retained purely by the barrel.`);
} finally {
  writeFileSync(BARREL, original);
  console.log('(restored libs/shared/utils/src/index.ts)');
}
