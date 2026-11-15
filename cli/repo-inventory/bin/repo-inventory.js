#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');

const HELP = `repo-inventory - find repositories missing a README, license or description

Usage:
  repo-inventory [owner] [--owner <login>] [--public-only] [--include-forks] [--include-archived] [--all] [--json] [--fail-if-any]

Arguments and options:
  owner               User or organization to scan (or use --owner). Default: the account you are logged in as with gh.
  --public-only       Only look at public repositories (otherwise: everything your gh login can see).
  --include-forks     Include forks (skipped by default).
  --include-archived  Include archived repositories (skipped by default).
  --all               Show every repository, not only the ones with a gap.
  --json              Print JSON instead of a table.
  --fail-if-any       Exit with code 1 when at least one repository has a gap.
  -h, --help          Show this help.

Requires the GitHub CLI (gh), signed in. Read-only: one paginated GraphQL query through "gh api graphql".
Set GH_BIN to use a different gh executable.
`;

function parseArgs(argv) {
  const opts = { owner: null, publicOnly: false, includeForks: false, includeArchived: false, all: false, json: false, failIfAny: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--owner') {
      i += 1;
      if (i >= argv.length) throw new Error('Missing value for --owner');
      opts.owner = argv[i];
    } else if (arg === '--public-only') opts.publicOnly = true;
    else if (arg === '--include-forks') opts.includeForks = true;
    else if (arg === '--include-archived') opts.includeArchived = true;
    else if (arg === '--all') opts.all = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--fail-if-any') opts.failIfAny = true;
    else if (arg === '-h' || arg === '--help') opts.help = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else if (opts.owner) throw new Error(`Unexpected argument: ${arg}`);
    else opts.owner = arg;
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

const QUERY = `query($owner: String!, $endCursor: String) {
  repositoryOwner(login: $owner) {
    repositories(first: 100, after: $endCursor, ownerAffiliations: OWNER, orderBy: {field: NAME, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name nameWithOwner description isPrivate isFork isArchived pushedAt url
        licenseInfo { spdxId }
        root: object(expression: "HEAD:") { ... on Tree { entries { name } } }
      }
    }
  }
}`;

/** Build one inventory row from a GraphQL node. Pure, for tests. */
function inspect(node) {
  const entries = node.root && Array.isArray(node.root.entries) ? node.root.entries.map((e) => e.name) : [];
  const has = (re) => entries.some((n) => re.test(n));
  const hasLicense = Boolean(node.licenseInfo) || has(/^(licen[sc]e|copying)(\..+)?$/i);
  const row = {
    repository: node.nameWithOwner,
    visibility: node.isPrivate ? 'private' : 'public',
    fork: Boolean(node.isFork),
    archived: Boolean(node.isArchived),
    empty: entries.length === 0,
    hasDescription: Boolean(node.description && node.description.trim()),
    hasReadme: has(/^readme(\..+)?$/i),
    hasLicense,
    pushedAt: node.pushedAt || null,
    url: node.url,
  };
  row.missing = [];
  if (!row.hasReadme) row.missing.push('README');
  if (!row.hasLicense) row.missing.push('license');
  if (!row.hasDescription) row.missing.push('description');
  return row;
}

function select(nodes, opts) {
  return nodes
    .filter((n) => !(opts.publicOnly && n.isPrivate))
    .filter((n) => opts.includeForks || !n.isFork)
    .filter((n) => opts.includeArchived || !n.isArchived)
    .map(inspect)
    .filter((r) => opts.all || r.missing.length > 0);
}

function formatTable(rows, total) {
  if (rows.length === 0) return 'Every repository checked has a README, a license and a description.';
  const header = ['REPOSITORY', 'VISIBILITY', 'README', 'LICENSE', 'DESCRIPTION'];
  const mark = (ok) => (ok ? 'ok' : 'MISSING');
  const body = rows.map((r) => [r.repository, r.visibility, mark(r.hasReadme), mark(r.hasLicense), mark(r.hasDescription)]);
  const widths = header.map((h, i) => Math.max(h.length, ...body.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ').trimEnd();
  const withGaps = rows.filter((r) => r.missing.length > 0).length;
  return [line(header), ...body.map(line), '', `${withGaps} repositories with a gap, ${rows.length} shown${total !== undefined ? `, ${total} checked` : ''}.`].join('\n');
}

function fetchNodes(owner, env) {
  const raw = runGh(['api', 'graphql', '--paginate', '-f', `query=${QUERY}`, '-F', `owner=${owner}`,
    '--jq', '.data.repositoryOwner.repositories.nodes[] | tojson'], env);
  return raw.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
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
    const nodes = fetchNodes(owner, env);
    const rows = select(nodes, opts);
    const gaps = rows.filter((r) => r.missing.length > 0).length;
    io.out(opts.json ? JSON.stringify(rows, null, 2) : formatTable(rows));
    return opts.failIfAny && gaps > 0 ? 1 : 0;
  } catch (e) {
    io.err(e.message);
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { parseArgs, inspect, select, formatTable, main };
