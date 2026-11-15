#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');

const HELP = `unassigned-prs - list open pull requests that have no assignee

Usage:
  unassigned-prs [owner] [--owner <login>] [--limit <n>] [--include-drafts] [--json] [--fail-if-any]

Arguments and options:
  owner              User or organization to scan (or use --owner). Default: the account you are logged in as with gh.
  --limit <n>        Maximum pull requests to list (GitHub search returns at most 1000). Default: 200.
  --include-drafts   Include draft pull requests (skipped by default).
  --json             Print JSON instead of a table.
  --fail-if-any      Exit with code 1 when at least one unassigned pull request is found.
  -h, --help         Show this help.

Requires the GitHub CLI (gh), signed in. Read-only: it only calls "gh api" with GET requests.
Set GH_BIN to use a different gh executable.
`;

function toPositiveInt(value, name) {
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n) || n < 1 || String(n) !== String(value).trim()) {
    throw new Error(`${name} must be a positive whole number`);
  }
  return n;
}

function parseArgs(argv) {
  const opts = { owner: null, limit: 200, includeDrafts: false, json: false, failIfAny: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };
    switch (arg) {
      case '--owner': opts.owner = next(); break;
      case '--limit': opts.limit = toPositiveInt(next(), '--limit'); break;
      case '--include-drafts': opts.includeDrafts = true; break;
      case '--json': opts.json = true; break;
      case '--fail-if-any': opts.failIfAny = true; break;
      case '-h': case '--help': opts.help = true; break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        if (opts.owner) throw new Error(`Unexpected argument: ${arg}`);
        opts.owner = arg;
    }
  }
  if (opts.owner !== null && !/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(opts.owner)) {
    throw new Error('owner must be a GitHub user or organization name');
  }
  return opts;
}

function runGh(args, env = process.env) {
  const bin = env.GH_BIN || 'gh';
  const result = spawnSync(bin, args, { encoding: 'utf8', env, maxBuffer: 64 * 1024 * 1024 });
  if (result.error) {
    throw new Error(`Could not run ${bin}: ${result.error.message}. Install the GitHub CLI from https://cli.github.com`);
  }
  if (result.status !== 0) {
    throw new Error(`gh ${args.slice(0, 2).join(' ')} failed: ${(result.stderr || '').trim() || `exit ${result.status}`}`);
  }
  return result.stdout;
}

/** Turn raw search items (one JSON object per line) into rows. Pure, for tests. */
function toRows(items, { includeDrafts = false, now = Date.now() } = {}) {
  const DAY = 24 * 60 * 60 * 1000;
  return items
    .filter((it) => includeDrafts || !it.draft)
    .filter((it) => !it.assignees || it.assignees.length === 0)
    .map((it) => ({
      repository: String(it.repository_url || '').replace(/^.*\/repos\//, ''),
      number: it.number,
      title: it.title,
      author: it.user ? it.user.login : 'ghost',
      draft: Boolean(it.draft),
      daysOpen: Math.floor((now - Date.parse(it.created_at)) / DAY),
      url: it.html_url,
    }))
    .sort((a, b) => b.daysOpen - a.daysOpen);
}

function formatTable(rows) {
  if (rows.length === 0) return 'No unassigned pull requests found.';
  const header = ['OPEN', 'REPOSITORY', 'PR', 'AUTHOR', 'TITLE'];
  const body = rows.map((r) => [`${r.daysOpen}d`, r.repository, `#${r.number}`, r.author, r.title.length > 60 ? `${r.title.slice(0, 57)}...` : r.title]);
  const widths = header.map((h, i) => Math.max(h.length, ...body.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ').trimEnd();
  return [line(header), ...body.map(line)].join('\n');
}

function fetchItems(owner, limit, env) {
  const q = `is:pr is:open no:assignee user:${owner}`;
  const raw = runGh(
    ['api', '-X', 'GET', 'search/issues', '-f', `q=${q}`, '-f', 'sort=created', '-f', 'order=asc', '-F', 'per_page=100',
      '--paginate', '--jq', '.items[] | tojson'],
    env
  );
  return raw.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)).slice(0, limit);
}

function main(argv, env = process.env, io = { out: (s) => console.log(s), err: (s) => console.error(s) }) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (e) {
    io.err(`${e.message}\n\n${HELP}`);
    return 2;
  }
  if (opts.help) {
    io.out(HELP);
    return 0;
  }
  try {
    const owner = opts.owner || runGh(['api', 'user', '--jq', '.login'], env).trim();
    const rows = toRows(fetchItems(owner, opts.limit, env), { includeDrafts: opts.includeDrafts });
    io.out(opts.json ? JSON.stringify(rows, null, 2) : formatTable(rows));
    return opts.failIfAny && rows.length > 0 ? 1 : 0;
  } catch (e) {
    io.err(e.message);
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { parseArgs, toRows, formatTable, main };
