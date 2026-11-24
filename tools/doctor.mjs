// Checks that this machine can run the workshop stack. Run: npm run doctor
const results = [];
const ok = (name, pass, hint = '') => results.push({ name, pass, hint });

const [major, minor] = process.versions.node.split('.').map(Number);
ok(`Node.js ${process.versions.node} (need 22.13 or newer)`, major > 22 || (major === 22 && minor >= 13),
  'Node is too old for the built-in SQLite module. Tell the instructor.');

try {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE t (x INTEGER) STRICT');
  db.close();
  ok('Built-in SQLite (node:sqlite) with STRICT tables', true);
} catch (e) {
  ok('Built-in SQLite (node:sqlite) with STRICT tables', false, String(e.message));
}

try {
  const res = await fetch('https://registry.npmjs.org/express/latest', { signal: AbortSignal.timeout(8000) });
  ok('npm registry reachable', res.ok, `HTTP ${res.status}`);
} catch {
  ok('npm registry reachable', false, 'npm install will fail. Tell the instructor.');
}

for (const r of results) console.log(`${r.pass ? 'OK  ' : 'FAIL'}  ${r.name}${r.pass || !r.hint ? '' : '\n      -> ' + r.hint}`);
process.exit(results.every((r) => r.pass) ? 0 : 1);
