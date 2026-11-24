// Architecture check: turns the decisions in docs/architecture.md into rules a machine can enforce.
// Run: npm run check        (CI runs it on every push)
//
// It is deliberately simple: it reads source text, so it catches only what it looks for.
// Passing it does not mean the architecture is good. Failing it means a recorded decision was broken.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = 'src';
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) files.push(relative('.', p).split(sep).join('/'));
  }
})(SRC);

const layerOf = (f) => f.split('/')[1]; // src/<layer>/...  -> layer (or a file name for src/*.ts)
const SQL = /\b(SELECT\s+[\s\S]+?\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b/i;
const importsOf = (text) => [...text.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
const violations = [];
const fail = (rule, file, why) => violations.push({ rule, file, why });

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const layer = layerOf(file);
  const imports = importsOf(text);

  // R1 (ADR-001): SQL and the database driver live only in the data layer.
  if (layer !== 'data') {
    if (imports.includes('node:sqlite')) fail('R1', file, 'imports node:sqlite outside src/data');
    if (SQL.test(text)) fail('R1', file, 'contains SQL outside src/data');
  }

  // R2 (ADR-001): HTTP code talks to the domain, never to the data layer.
  if (layer === 'http' && imports.some((i) => i.includes('/data/'))) {
    fail('R2', file, 'src/http imports from src/data (go through src/domain)');
  }

  // R3 (ADR-001): the domain knows nothing about HTTP or the database.
  if (layer === 'domain') {
    if (imports.some((i) => i === 'express' || i.includes('/http/'))) fail('R3', file, 'src/domain depends on HTTP');
    if (imports.some((i) => i.includes('/data/'))) fail('R3', file, 'src/domain imports from src/data');
  }

  // R4 (ADR-002): every route is behind identity.
  if (layer === 'http' && /router\.(get|post|put|patch|delete)\(/.test(text)) {
    const routes = [...text.matchAll(/router\.(get|post|put|patch|delete)\(([^\n]*)/g)];
    for (const r of routes) {
      if (!r[2].includes('requireUser')) fail('R4', file, `route without requireUser: router.${r[1]}(${r[2].trim().slice(0, 50)}`);
    }
  }

  // R5 (ADR-003): the owner comes from identity, never from the request.
  if (/req\.(body|query|params)\??\.(owner|ownerId|owner_id|userId|user_id)\b/.test(text)) {
    fail('R5', file, 'reads the owner from the request; it must come from res.locals.userId');
  }
}

if (violations.length === 0) {
  console.log(`Architecture check passed (${files.length} files, rules R1-R5).`);
} else {
  console.log(`Architecture check FAILED: ${violations.length} violation(s)\n`);
  for (const v of violations) console.log(`  ${v.rule}  ${v.file}\n      ${v.why}`);
  console.log('\nRules are explained in docs/architecture.md.');
  process.exit(1);
}
