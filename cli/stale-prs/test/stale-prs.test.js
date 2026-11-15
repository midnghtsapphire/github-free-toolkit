'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseArgs, findStale, formatTable, main } = require('../bin/stale-prs.js');

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-01-31T00:00:00Z');
const iso = (daysAgo) => new Date(NOW - daysAgo * DAY).toISOString();

const sample = [
  { repository: { nameWithOwner: 'acme/api' }, number: 1, title: 'Old one', author: { login: 'ann' }, isDraft: false, updatedAt: iso(40), url: 'https://github.com/acme/api/pull/1' },
  { repository: { nameWithOwner: 'acme/web' }, number: 2, title: 'Fresh one', author: { login: 'bo' }, isDraft: false, updatedAt: iso(2), url: 'https://github.com/acme/web/pull/2' },
  { repository: { nameWithOwner: 'acme/web' }, number: 3, title: 'Old draft', author: null, isDraft: true, updatedAt: iso(30), url: 'https://github.com/acme/web/pull/3' },
  { repository: { nameWithOwner: 'acme/cli' }, number: 4, title: 'Exactly on the line', author: { login: 'cy' }, isDraft: false, updatedAt: iso(14), url: 'https://github.com/acme/cli/pull/4' },
];

test('parseArgs reads options and rejects bad ones', () => {
  assert.deepEqual(parseArgs(['--owner', 'acme', '--days', '30', '--json', '--fail-if-any']), {
    owner: 'acme', days: 30, limit: 200, includeDrafts: false, json: true, failIfAny: true, help: false,
  });
  assert.throws(() => parseArgs(['--days', 'abc']), /positive whole number/);
  assert.throws(() => parseArgs(['--days']), /Missing value/);
  assert.throws(() => parseArgs(['--nope']), /Unknown option/);
});

test('findStale keeps old PRs, skips drafts by default, sorts oldest first', () => {
  const rows = findStale(sample, { days: 14, now: NOW });
  assert.deepEqual(rows.map((r) => r.number), [1, 4]);
  assert.equal(rows[0].daysIdle, 40);
});

test('findStale can include drafts and handles a deleted author', () => {
  const rows = findStale(sample, { days: 14, includeDrafts: true, now: NOW });
  assert.deepEqual(rows.map((r) => r.number), [1, 3, 4]);
  assert.equal(rows.find((r) => r.number === 3).author, 'ghost');
});

test('formatTable renders rows and the empty case', () => {
  assert.equal(formatTable([]), 'No stale pull requests found.');
  const text = formatTable(findStale(sample, { days: 14, now: NOW }));
  assert.match(text, /^IDLE\s+REPOSITORY\s+PR\s+AUTHOR\s+TITLE/);
  assert.match(text, /40d\s+acme\/api\s+#1\s+ann\s+Old one/);
});

// End to end with a stub "gh" so no network or login is needed.
function makeStubGh(dir, prsJson) {
  const file = path.join(dir, 'gh-stub.js');
  fs.writeFileSync(
    file,
    `#!/usr/bin/env node
const a = process.argv.slice(2);
if (a[0] === 'api' && a[1] === 'user') { console.log('acme'); process.exit(0); }
if (a[0] === 'search' && a[1] === 'prs') {
  if (!a.includes('--owner') || a[a.indexOf('--owner') + 1] !== 'acme') { console.error('wrong owner'); process.exit(1); }
  console.log(${JSON.stringify(JSON.stringify(prsJson))}); process.exit(0);
}
console.error('unexpected args'); process.exit(1);
`
  );
  fs.chmodSync(file, 0o755);
  return file;
}

function capture() {
  const out = [];
  const err = [];
  return { io: { out: (s) => out.push(s), err: (s) => err.push(s) }, out, err };
}

test('main end to end: table output, --fail-if-any exit code, default owner from gh', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stale-prs-'));
  const old = sample.map((p) => ({ ...p, updatedAt: new Date(Date.now() - (NOW - Date.parse(p.updatedAt)) - 1000).toISOString() }));
  const env = { ...process.env, GH_BIN: makeStubGh(dir, old) };
  const a = capture();
  assert.equal(main(['--days', '14', '--fail-if-any'], env, a.io), 1);
  assert.match(a.out.join('\n'), /acme\/api/);
  const b = capture();
  assert.equal(main(['--days', '9999'], env, b.io), 0);
  assert.equal(b.out[0], 'No stale pull requests found.');
});

test('main reports gh failures with exit code 2 and unknown options with usage', () => {
  const c = capture();
  assert.equal(main(['--owner', 'someone-else'], { ...process.env, GH_BIN: makeStubGh(os.tmpdir(), []) }, c.io), 2);
  assert.match(c.err.join('\n'), /gh search prs failed/);
  const d = capture();
  assert.equal(main(['--bogus'], process.env, d.io), 2);
  assert.match(d.err.join('\n'), /Usage:/);
  const e = capture();
  assert.equal(main(['--help'], process.env, e.io), 0);
});

test('main says how to install gh when it is missing', () => {
  const f = capture();
  assert.equal(main(['--owner', 'x'], { ...process.env, GH_BIN: '/nonexistent/gh' }, f.io), 2);
  assert.match(f.err.join('\n'), /cli\.github\.com/);
});
