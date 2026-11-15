'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { validateName, scoreRepo, repoHealth } = require('../health.js');
const { handle } = require('../server.js');

const NOW = Date.parse('2026-01-31T00:00:00Z');

const goodRepo = {
  full_name: 'acme/api',
  description: 'The API',
  license: { spdx_id: 'MIT' },
  archived: false,
  pushed_at: '2026-01-20T00:00:00Z',
};
const goodCommunity = { files: { readme: {}, contributing: {}, license: {}, security_policy: {} } };

test('validateName accepts normal names and rejects path tricks', () => {
  assert.equal(validateName('octocat', 'owner'), 'octocat');
  for (const bad of ['', '..', '.', 'a/b', 'a b', 'x'.repeat(101), 5, null]) {
    assert.throws(() => validateName(bad, 'owner'));
  }
});

test('scoreRepo gives 100 for a healthy repository', () => {
  const out = scoreRepo(goodRepo, goodCommunity, [], NOW);
  assert.equal(out.score, 100);
  assert.equal(out.daysSinceLastPush, 11);
});

test('scoreRepo reports failing checks for a neglected repository', () => {
  const out = scoreRepo(
    { full_name: 'acme/old', description: '', license: null, archived: true, pushed_at: '2024-01-01T00:00:00Z' },
    { files: {} },
    new Array(40).fill({}),
    NOW
  );
  assert.equal(out.passed, 0);
  assert.equal(out.score, 0);
  assert.ok(out.checks.every((c) => c.ok === false));
});

test('repoHealth works against an injected fetch and sends the token only as a header', async () => {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, auth: init.headers.Authorization });
    const body = url.endsWith('/community/profile') ? goodCommunity : url.includes('/pulls') ? [] : goodRepo;
    return { ok: true, status: 200, json: async () => body };
  };
  const out = await repoHealth({ owner: 'acme', repo: 'api' }, { fetchImpl, token: 'test-token', now: NOW });
  assert.equal(out.score, 100);
  assert.equal(seen.length, 3);
  assert.ok(seen.every((s) => s.auth === 'Bearer test-token' && !s.url.includes('test-token')));
  assert.ok(!JSON.stringify(out).includes('test-token'));
});

test('repoHealth explains a 404 and rejects bad input before any request', async () => {
  const fetchImpl = async () => ({ ok: false, status: 404, json: async () => ({}) });
  await assert.rejects(repoHealth({ owner: 'acme', repo: 'nope' }, { fetchImpl }), /not found/);
  let called = false;
  await assert.rejects(
    repoHealth({ owner: '../etc', repo: 'x' }, { fetchImpl: async () => { called = true; } }),
    /owner must be/
  );
  assert.equal(called, false);
});

test('handle: initialize, tools/list, unknown tool, unknown method, notification', async () => {
  const init = await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } });
  assert.equal(init.result.protocolVersion, '2025-03-26');
  assert.deepEqual(init.result.capabilities, { tools: {} });
  const list = await handle({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  assert.equal(list.result.tools[0].name, 'repo_health');
  assert.equal(list.result.tools[0].annotations.readOnlyHint, true);
  const bad = await handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'delete_repo' } });
  assert.equal(bad.error.code, -32602);
  const nope = await handle({ jsonrpc: '2.0', id: 4, method: 'resources/list' });
  assert.equal(nope.error.code, -32601);
  assert.equal(await handle({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  assert.equal((await handle({ foo: 1 })).error.code, -32600);
});

test('stdio end to end against a local fake GitHub API', async () => {
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    if (req.url === '/repos/acme/api') return res.end(JSON.stringify({ ...goodRepo, pushed_at: new Date().toISOString() }));
    if (req.url === '/repos/acme/api/community/profile') return res.end(JSON.stringify(goodCommunity));
    if (req.url.startsWith('/repos/acme/api/pulls')) return res.end('[]');
    res.statusCode = 404;
    res.end('{}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  const child = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
    env: { ...process.env, GITHUB_API_URL: `http://127.0.0.1:${port}`, GITHUB_TOKEN: '' },
    stdio: ['pipe', 'pipe', 'inherit'],
  });
  const lines = [];
  const done = new Promise((resolve) => {
    let buffer = '';
    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      let i;
      while ((i = buffer.indexOf('\n')) >= 0) {
        lines.push(JSON.parse(buffer.slice(0, i)));
        buffer = buffer.slice(i + 1);
      }
    });
    child.on('close', resolve);
  });
  const send = (m) => child.stdin.write(`${JSON.stringify(m)}\n`);
  send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } });
  send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'repo_health', arguments: { owner: 'acme', repo: 'api' } } });
  send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'repo_health', arguments: { owner: 'acme', repo: 'missing' } } });
  child.stdin.end();
  await done;
  server.close();

  const byId = Object.fromEntries(lines.map((l) => [l.id, l]));
  assert.equal(byId[1].result.serverInfo.name, 'repo-health-mcp');
  const ok = JSON.parse(byId[2].result.content[0].text);
  assert.equal(ok.repository, 'acme/api');
  assert.equal(ok.score, 100);
  assert.equal(byId[3].result.isError, true);
  assert.match(byId[3].result.content[0].text, /not found/);
});
