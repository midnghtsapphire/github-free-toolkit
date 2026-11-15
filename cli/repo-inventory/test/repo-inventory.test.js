'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseArgs, inspect, select, formatTable, main } = require('../bin/repo-inventory.js');

const node = (over) => ({
  name: 'x', nameWithOwner: 'acme/x', description: 'A thing', isPrivate: false, isFork: false, isArchived: false,
  pushedAt: '2026-01-01T00:00:00Z', url: 'https://github.com/acme/x', licenseInfo: { spdxId: 'MIT' },
  root: { entries: [{ name: 'README.md' }, { name: 'src' }] }, ...over,
});
const nodes = [
  node({ name: 'good', nameWithOwner: 'acme/good' }),
  node({ name: 'nodesc', nameWithOwner: 'acme/nodesc', description: '  ' }),
  node({ name: 'noreadme', nameWithOwner: 'acme/noreadme', root: { entries: [{ name: 'src' }] } }),
  node({ name: 'nolic', nameWithOwner: 'acme/nolic', licenseInfo: null }),
  node({ name: 'licfile', nameWithOwner: 'acme/licfile', licenseInfo: null, root: { entries: [{ name: 'readme.rst' }, { name: 'LICENSE.txt' }] } }),
  node({ name: 'empty', nameWithOwner: 'acme/empty', root: null, description: null, licenseInfo: null }),
  node({ name: 'priv', nameWithOwner: 'acme/priv', isPrivate: true, description: null }),
  node({ name: 'fork', nameWithOwner: 'acme/fork', isFork: true, description: null }),
  node({ name: 'old', nameWithOwner: 'acme/old', isArchived: true, description: null }),
];

test('parseArgs', () => {
  assert.equal(parseArgs(['acme']).owner, 'acme');
  assert.equal(parseArgs(['--owner', 'acme', '--public-only', '--all']).publicOnly, true);
  assert.throws(() => parseArgs(['--nope']), /Unknown option/);
  assert.throws(() => parseArgs(['--owner']), /Missing value/);
  assert.throws(() => parseArgs(['a b']), /owner must be/);
});

test('inspect finds README and license variants and reports gaps', () => {
  assert.deepEqual(inspect(nodes[0]).missing, []);
  assert.deepEqual(inspect(nodes[1]).missing, ['description']);
  assert.deepEqual(inspect(nodes[2]).missing, ['README']);
  assert.deepEqual(inspect(nodes[3]).missing, ['license']);
  assert.deepEqual(inspect(nodes[4]).missing, []);
  assert.deepEqual(inspect(nodes[5]).missing, ['README', 'license', 'description']);
  assert.equal(inspect(nodes[5]).empty, true);
});

test('select hides forks, archived and healthy repos by default', () => {
  const names = (rows) => rows.map((r) => r.repository.split('/')[1]);
  assert.deepEqual(names(select(nodes, parseArgs([]))), ['nodesc', 'noreadme', 'nolic', 'empty', 'priv']);
  assert.deepEqual(names(select(nodes, parseArgs(['--public-only']))), ['nodesc', 'noreadme', 'nolic', 'empty']);
  assert.equal(select(nodes, parseArgs(['--all', '--include-forks', '--include-archived'])).length, 9);
});

test('formatTable', () => {
  assert.match(formatTable([]), /Every repository checked/);
  const text = formatTable(select(nodes, parseArgs([])));
  assert.match(text, /^REPOSITORY\s+VISIBILITY\s+README\s+LICENSE\s+DESCRIPTION/);
  assert.match(text, /acme\/noreadme\s+public\s+MISSING\s+ok\s+ok/);
});

function stub(dir) {
  const file = path.join(dir, 'gh-stub.js');
  fs.writeFileSync(file, `#!/usr/bin/env node
const a = process.argv.slice(2);
if (a[0] === 'api' && a[1] === 'user') { console.log('acme'); process.exit(0); }
if (a[0] === 'api' && a[1] === 'graphql') {
  if (!a.includes('owner=acme') || a.some((x) => /mutation/i.test(x))) { console.error('bad call'); process.exit(1); }
  for (const n of ${JSON.stringify(nodes)}) console.log(JSON.stringify(n));
  process.exit(0);
}
console.error('unexpected args'); process.exit(1);
`);
  fs.chmodSync(file, 0o755);
  return file;
}
const capture = () => { const out = []; const err = []; return { io: { out: (s) => out.push(s), err: (s) => err.push(s) }, out, err }; };

test('main end to end with a stub gh', () => {
  const env = { ...process.env, GH_BIN: stub(fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-'))) };
  const a = capture();
  assert.equal(main(['acme', '--json', '--fail-if-any'], env, a.io), 1);
  assert.equal(JSON.parse(a.out[0]).length, 5);
  const b = capture();
  assert.equal(main([], env, b.io), 0);
  assert.match(b.out[0], /repositories with a gap/);
});

test('main errors', () => {
  const a = capture();
  assert.equal(main(['x'], { ...process.env, GH_BIN: '/nonexistent/gh' }, a.io), 2);
  assert.match(a.err.join('\n'), /cli\.github\.com/);
  assert.equal(main(['--bogus'], process.env, capture().io), 2);
  assert.equal(main(['-h'], process.env, capture().io), 0);
});
