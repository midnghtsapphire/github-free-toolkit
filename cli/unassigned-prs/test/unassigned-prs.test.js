'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseArgs, toRows, formatTable, main } = require('../bin/unassigned-prs.js');

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-01-31T00:00:00Z');
const iso = (d) => new Date(NOW - d * DAY).toISOString();
const item = (over) => ({
  repository_url: 'https://api.github.com/repos/acme/api', number: 1, title: 'A change', user: { login: 'ann' },
  draft: false, assignees: [], created_at: iso(5), html_url: 'https://github.com/acme/api/pull/1', ...over,
});
const items = [
  item({ number: 1, created_at: iso(5) }),
  item({ number: 2, created_at: iso(20), repository_url: 'https://api.github.com/repos/acme/web' }),
  item({ number: 3, draft: true, created_at: iso(9) }),
  item({ number: 4, assignees: [{ login: 'bo' }] }),
  item({ number: 5, user: null, created_at: iso(1) }),
];

test('parseArgs accepts a positional owner, --owner and rejects bad input', () => {
  assert.equal(parseArgs(['acme']).owner, 'acme');
  assert.equal(parseArgs(['--owner', 'acme', '--json']).json, true);
  assert.throws(() => parseArgs(['--limit', '0']), /positive whole number/);
  assert.throws(() => parseArgs(['--nope']), /Unknown option/);
  assert.throws(() => parseArgs(['a', 'b']), /Unexpected argument/);
  assert.throws(() => parseArgs(['bad owner!']), /owner must be/);
});

test('toRows drops assigned PRs and drafts, oldest first', () => {
  const rows = toRows(items, { now: NOW });
  assert.deepEqual(rows.map((r) => r.number), [2, 1, 5]);
  assert.equal(rows[0].repository, 'acme/web');
  assert.equal(rows[2].author, 'ghost');
  assert.deepEqual(toRows(items, { includeDrafts: true, now: NOW }).map((r) => r.number), [2, 3, 1, 5]);
});

test('formatTable renders rows and the empty case', () => {
  assert.equal(formatTable([]), 'No unassigned pull requests found.');
  assert.match(formatTable(toRows(items, { now: NOW })), /20d\s+acme\/web\s+#2/);
});

function stub(dir) {
  const file = path.join(dir, 'gh-stub.js');
  fs.writeFileSync(file, `#!/usr/bin/env node
const a = process.argv.slice(2);
if (a[0] === 'api' && a[1] === 'user') { console.log('acme'); process.exit(0); }
if (a[0] === 'api' && a.includes('search/issues')) {
  const q = a.find((x) => x.startsWith('q='));
  if (!q.includes('user:acme') || !q.includes('no:assignee') || a.includes('POST') || a.includes('PATCH')) { console.error('bad query'); process.exit(1); }
  for (const it of ${JSON.stringify(items)}) console.log(JSON.stringify(it));
  process.exit(0);
}
console.error('unexpected args'); process.exit(1);
`);
  fs.chmodSync(file, 0o755);
  return file;
}
const capture = () => { const out = []; const err = []; return { io: { out: (s) => out.push(s), err: (s) => err.push(s) }, out, err }; };

test('main end to end with a stub gh: json, table, fail-if-any, default owner', () => {
  const env = { ...process.env, GH_BIN: stub(fs.mkdtempSync(path.join(os.tmpdir(), 'unassigned-'))) };
  const a = capture();
  assert.equal(main(['acme', '--json', '--fail-if-any'], env, a.io), 1);
  assert.equal(JSON.parse(a.out[0]).length, 3);
  const b = capture();
  assert.equal(main([], env, b.io), 0);
  assert.match(b.out[0], /^OPEN\s+REPOSITORY/);
});

test('main reports errors with exit code 2', () => {
  const a = capture();
  assert.equal(main(['--owner', 'x'], { ...process.env, GH_BIN: '/nonexistent/gh' }, a.io), 2);
  assert.match(a.err.join('\n'), /cli\.github\.com/);
  const b = capture();
  assert.equal(main(['--bogus'], process.env, b.io), 2);
  assert.match(b.err.join('\n'), /Usage:/);
  assert.equal(main(['--help'], process.env, capture().io), 0);
});
