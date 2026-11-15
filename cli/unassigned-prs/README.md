# unassigned-prs

Lists **open pull requests that have no assignee**, across every repository of a user or organization, oldest first. A pull request nobody owns is a pull request nobody merges.

- Read-only. It only makes `gh api -X GET search/issues` calls (plus `gh api user` when you give no owner).
- No dependencies, no telemetry, nothing is written anywhere.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer
- The [GitHub CLI](https://cli.github.com), signed in (`gh auth login`)

## Usage

```bash
# Everything unassigned for the account you are signed in as
node cli/unassigned-prs/bin/unassigned-prs.js

# A user or organization (positional or --owner), JSON output
node cli/unassigned-prs/bin/unassigned-prs.js my-org --json

# Include drafts; exit 1 if anything is found (handy in a cron job or CI)
node cli/unassigned-prs/bin/unassigned-prs.js my-org --include-drafts --fail-if-any
```

Example output:

```text
OPEN  REPOSITORY  PR   AUTHOR  TITLE
20d   acme/web    #2   ann     A change
5d    acme/api    #1   ann     A change
```

| Option | Default | Meaning |
| --- | --- | --- |
| `owner` / `--owner <login>` | the signed-in account | User or organization to scan |
| `--limit <n>` | `200` | Maximum pull requests to list (GitHub search returns at most 1000) |
| `--include-drafts` | off | Include draft pull requests |
| `--json` | off | JSON instead of a table |
| `--fail-if-any` | off | Exit 1 when at least one is found |

Exit codes: `0` success, `1` found with `--fail-if-any`, `2` usage or `gh` error. Private repositories appear only if your `gh` login can see them.

## Test locally

```bash
node --test cli/unassigned-prs
```
