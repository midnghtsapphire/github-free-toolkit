# stale-prs

A tiny command-line tool that lists **stale open pull requests across all of a user's (or organization's) repositories**, oldest first. It is a thin wrapper around the GitHub CLI.

- Read-only. It only runs `gh search prs` and, when you do not pass `--owner`, `gh api user`.
- No dependencies, no network calls of its own, no telemetry.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer
- The [GitHub CLI](https://cli.github.com), signed in (`gh auth login`)

## Usage

```bash
# Stale = no update for 14 days (the default), across the account you are signed in as
node cli/stale-prs/bin/stale-prs.js

# A different owner, 30 days, include drafts
node cli/stale-prs/bin/stale-prs.js --owner my-org --days 30 --include-drafts

# JSON for scripts, and a non-zero exit code when anything is stale
node cli/stale-prs/bin/stale-prs.js --json --fail-if-any
```

Example output:

```text
IDLE  REPOSITORY   PR   AUTHOR  TITLE
40d   acme/api     #1   ann     Old one
14d   acme/cli     #4   cy      Exactly on the line
```

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `--owner <login>` | the signed-in account | User or organization to scan |
| `--days <n>` | `14` | Days without an update before a pull request counts as stale |
| `--limit <n>` | `200` | Maximum open pull requests to fetch |
| `--include-drafts` | off | Include draft pull requests |
| `--json` | off | Print JSON instead of a table |
| `--fail-if-any` | off | Exit with code 1 when at least one stale pull request is found |

Exit codes: `0` success, `1` stale pull requests found with `--fail-if-any`, `2` usage or `gh` error.

## Test locally

The tests use a stub `gh`, so they need no login and no network:

```bash
npm test
```
