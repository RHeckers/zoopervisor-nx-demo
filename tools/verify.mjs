/*
 * Scripts the acceptance checks from the build plan (§13):
 *   1. every project.json carries at least a `type:` tag (fails CI otherwise)
 *   2. a set of imports that MUST fail lint actually do, with the right rule
 *
 * Each "must fail" case prepends a bare import to a real file, lints that one
 * project, asserts the boundary rule rejected it, and always restores the file.
 *
 * Run: node tools/verify.mjs   (or: npm run verify)
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failures = 0;
const ok = (m) => console.log('  ✓', m);
const bad = (m) => {
  console.log('  ✗', m);
  failures += 1;
};

function findProjectJsons(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.nx', '.git', '.angular'].includes(entry.name))
      continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findProjectJsons(full, out);
    else if (entry.name === 'project.json') out.push(full);
  }
  return out;
}

// --- 1. every project.json has a type: tag ----------------------------------
console.log('Structural: every project.json has a type: tag');
for (const path of findProjectJsons(process.cwd())) {
  const tags = JSON.parse(readFileSync(path, 'utf8')).tags ?? [];
  if (tags.some((t) => t.startsWith('type:'))) ok(path.replace(/\\/g, '/'));
  else bad(`${path} has no type: tag`);
}

// --- 2. boundaries that must fail lint ---------------------------------------
const cases = [
  {
    why: 'domain rule (animals ↛ tickets)',
    project: 'animals-ui',
    file: 'libs/animals/ui/src/lib/animal-card.component.ts',
    imp: "import '@zoo/tickets/data-access';",
  },
  {
    why: 'type rule (ui ↛ data-access)',
    project: 'animals-ui',
    file: 'libs/animals/ui/src/lib/animal-card.component.ts',
    imp: "import '@zoo/animals/data-access';",
  },
  {
    why: 'platform rule (desktop ↛ mobile)',
    project: 'shared-ui-desktop',
    file: 'libs/shared/ui/desktop/src/lib/atoms/key-hint.component.ts',
    imp: "import '@zoo/shared/ui/mobile';",
  },
  {
    why: 'banned external import (desktop ↛ @capacitor/*)',
    project: 'shared-ui-desktop',
    file: 'libs/shared/ui/desktop/src/lib/atoms/key-hint.component.ts',
    imp: "import '@capacitor/core';",
  },
];

console.log('\nBoundaries that must fail lint');
for (const c of cases) {
  const original = readFileSync(c.file, 'utf8');
  writeFileSync(c.file, `${c.imp}\n${original}`);
  let failed = false;
  let output = '';
  try {
    execSync(`npx nx lint ${c.project} --skip-nx-cache`, { stdio: 'pipe' });
  } catch (err) {
    failed = true;
    output = `${err.stdout ?? ''}${err.stderr ?? ''}`;
  } finally {
    writeFileSync(c.file, original);
  }
  if (failed && /enforce-module-boundaries/.test(output)) {
    ok(`${c.why}`);
  } else {
    bad(`${c.why} — expected a boundary lint failure but none occurred`);
  }
}

// --- 3. no hard-coded sentences in libs/ templates --------------------------
// Shared/domain templates must name i18n keys, not own their wording (Task A).
function findHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.nx'].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

console.log('\nNo hard-coded sentences in libs/ templates');
const sentence = /[A-Z][a-z]+(?:\s+[a-z]+){1,}[.!?]/;
let bareFound = false;
for (const file of findHtml(join(process.cwd(), 'libs'))) {
  // strip interpolations, then look for a capitalised sentence ending in . ! ?
  const stripped = readFileSync(file, 'utf8').replace(/\{\{[^}]*\}\}/g, '');
  if (sentence.test(stripped)) {
    bad(`hard-coded sentence in ${file.replace(/\\/g, '/')}`);
    bareFound = true;
  }
}
if (!bareFound) ok('no hard-coded sentences in libs/ templates');

// --- 4. shared libs name no app ---------------------------------------------
// Nothing under libs/shared (i18n, the ui tiers, data-access, …) may import an
// app — shared code decides nothing app-specific (Tasks A & B).
function findTs(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.nx'].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findTs(full, out);
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts'))
      out.push(full);
  }
  return out;
}

console.log('\nShared libs name no app');
const appImport = /@zoo\/(visitor|keeper-mobile|ticket-kiosk)\b/;
let appNameLeak = false;
for (const file of findTs(join(process.cwd(), 'libs', 'shared'))) {
  if (appImport.test(readFileSync(file, 'utf8'))) {
    bad(`app name imported inside a shared lib: ${file.replace(/\\/g, '/')}`);
    appNameLeak = true;
  }
}
if (!appNameLeak) ok('no app names imported anywhere under libs/shared');

console.log(
  failures ? `\n${failures} check(s) FAILED` : '\nAll acceptance checks passed',
);
process.exit(failures ? 1 : 0);
