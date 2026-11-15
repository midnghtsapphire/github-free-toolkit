'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ghFetch } = require('../health.js');

function stub() {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gh-transport-')), 'gh-stub.js');
  fs.writeFileSync(file, `#!/usr/bin/env node
const a = process.argv.slice(2);
if (a[0] !== 'api' || a[1] !== '-X' || a[2] !== 'GET') { console.error('only GET via gh api is allowed'); process.exit(1); }
if (a[3] === 'repos/acme/ok') { console.log('{"full_name":"acme/ok"}'); process.exit(0); }
console.error('gh: Not Found (HTTP 404)'); process.exit(1);
`);
  fs.chmodSync(file, 0o755);
  return file;
}

test('ghFetch uses read-only "gh api" and maps errors to HTTP statuses', async () => {
  const env = { ...process.env, GH_BIN: stub() };
  const ok = await ghFetch('https://api.github.com/repos/acme/ok', {}, { env });
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { full_name: 'acme/ok' });
  const missing = await ghFetch('https://api.github.com/repos/acme/nope', {}, { env });
  assert.equal(missing.status, 404);
  const none = await ghFetch('https://api.github.com/repos/acme/ok', {}, { env: { ...process.env, GH_BIN: '/nonexistent/gh' } });
  assert.equal(none.ok, false);
});
