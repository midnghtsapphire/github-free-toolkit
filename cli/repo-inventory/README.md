# repo-inventory

Finds repositories that are **missing a README, a license or a description**. It makes one paginated, read-only GraphQL query through `gh api graphql` and prints a clean table.

- Read-only. It never edits a repository.
- No dependencies, no telemetry.
- Forks and archived repositories are skipped unless you ask for them.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer
- The [GitHub CLI](https://cli.github.com), signed in (`gh auth login`)

## Usage

```bash
# Repositories with a gap, for the account you are signed in as
node cli/repo-inventory/bin/repo-inventory.js

# A user or organization, public repositories only (safe to paste into a public issue)
node cli/repo-inventory/bin/repo-inventory.js my-org --public-only

# Everything, as JSON; exit 1 if any repository has a gap
node cli/repo-inventory/bin/repo-inventory.js my-org --all --json --fail-if-any
```

Example output:

```text
REPOSITORY      VISIBILITY  README   LICENSE  DESCRIPTION
acme/notes      public      ok       MISSING  MISSING
acme/scratch    public      MISSING  ok       ok

2 repositories with a gap, 2 shown.
```

| Option | Meaning |
| --- | --- |
| `owner` / `--owner <login>` | User or organization (default: the signed-in account) |
| `--public-only` | Skip private repositories |
| `--include-forks` / `--include-archived` | Include them (skipped by default) |
| `--all` | Show every repository, not only ones with a gap |
| `--json` | JSON instead of a table |
| `--fail-if-any` | Exit 1 when at least one repository has a gap |

A README or license counts if a file named like `README*` / `LICENSE*` / `COPYING*` sits in the repository root, or GitHub detected a license. Exit codes: `0` success, `1` gaps found with `--fail-if-any`, `2` usage or `gh` error.

## Test locally

```bash
node --test cli/repo-inventory
```
