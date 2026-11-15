#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');

const HELP = `stale-prs - list stale open pull requests across a user's or organization's repositories

Usage:
  stale-prs [--owner <login>] [--days <n>] [--limit <n>] [--include-drafts] [--json] [--fail-if-any]

Options:
  --owner <login>    User or organization to scan. Default: the account you are logged in as with gh.
  --days <n>         A pull request is stale when it has had no update for this many days. Default: 14.
  --limit <n>        Maximum open pull requests to fetch. Default: 200.
  --include-drafts   Include draft pull requests (skipped by default).
  --json             Print JSON instead of a table.
  --fail-if-any      Exit with code 1 when at least one stale pull request is found.
  -h, --help         Show this help.

Requires the GitHub CLI (gh), signed in. Read-only: it only searches pull requests.
Set GH_BIN to use a different gh executable.
`;

function parseArgs(argv) {
  const opts = { owner: null, days: 14, limit: 200, includeDrafts: false, json: false, failIfAny: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };
    switch (arg) {
      case '--owner': opts.owner = next(); break;
      case '--days': opts.days = toPositiveInt(next(), '--days'); break;
      case '--limit': opts.limit = toPositiveInt(next(), '--limit'); break;
      case '--include-drafts': opts.includeDrafts = true; break;
      case '--json': opts.json = true; break;
      case '--fail-if-any': opts.failIfAny = true; break;
      case '-h': case '--help': opts.help = true; break;
      default: throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

function toPositiveInt(value, name) {
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n) || n < 1 || String(n) !== String(value).trim()) {
    throw new Error(`${name} must be a positive whole number`);
  }
  return n;
}

function runGh(args, env = process.env) {
  const bin = env.GH_BIN || 'gh';
  const result = spawnSync(bin, args, { encoding: 'utf8', env });
  if (result.error) {
    throw new Error(`Could not run ${bin}: ${result.error.message}. Install the GitHub CLI from https://cli.github.com`);
  }
  if (result.status !== 0) {
    throw new Error(`gh ${args.slice(0, 2).join(' ')} failed: ${(result.stderr || '').trim() || `exit ${result.status}`}`);
  }
  return result.stdout;
}

/** Keep only PRs idle for at least `days`, oldest first. `now` is injectable for tests. */
function findStale(prs, { days, includeDrafts = false, now = Date.now() }) {
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return prs
    .filter((pr) => includeDrafts || !pr.isDraft)
    .filter((pr) => Date.parse(pr.updatedAt) <= cutoff)
    .map((pr) => ({
      repository: pr.repository.nameWithOwner,
      number: pr.number,
      title: pr.title,
      author: pr.author ? pr.author.login : 'ghost',
      draft: Boolean(pr.isDraft),
      daysIdle: Math.floor((now - Date.parse(pr.updatedAt)) / (24 * 60 * 60 * 1000)),
      url: pr.url,
    }))
    .sort((a, b) => b.daysIdle - a.daysIdle);
}

function formatTable(rows) {
  if (rows.length === 0) return 'No stale pull requests found.';
  const header = ['IDLE', 'REPOSITORY', 'PR', 'AUTHOR', 'TITLE'];
  const body = rows.map((r) => [`${r.daysIdle}d`, r.repository, `#${r.number}`, r.author, r.title.length > 60 ? `${r.title.slice(0, 57)}...` : r.title]);
  const widths = header.map((h, i) => Math.max(h.length, ...body.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ').trimEnd();
  return [line(header), ...body.map(line)].join('\n');
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
    const raw = runGh(
      ['search', 'prs', '--owner', owner, '--state', 'open', '--limit', String(opts.limit),
        '--json', 'repository,number,title,author,isDraft,updatedAt,url'],
      env
    );
    const stale = findStale(JSON.parse(raw), { days: opts.days, includeDrafts: opts.includeDrafts });
    io.out(opts.json ? JSON.stringify(stale, null, 2) : formatTable(stale));
    return opts.failIfAny && stale.length > 0 ? 1 : 0;
  } catch (e) {
    io.err(e.message);
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { parseArgs, findStale, formatTable, main };
