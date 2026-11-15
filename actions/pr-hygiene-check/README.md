# pr-hygiene-check

A composite GitHub Action that checks a pull request for two things reviewers always ask about: **an assignee** and **a real description**.

- Read-only. It never edits, labels or comments on your pull request.
- No network calls and no token needed. It reads the pull request event that GitHub already gives your workflow.
- An untouched pull request template does not count as a description (HTML comments are ignored).

## Usage

Add this to a workflow in your own repository:

```yaml
name: PR hygiene
on:
  pull_request:
    types: [opened, edited, reopened, assigned, unassigned, ready_for_review]

jobs:
  hygiene:
    runs-on: ubuntu-latest
    steps:
      - uses: midnghtsapphire/github-free-toolkit/actions/pr-hygiene-check@main
        with:
          require-assignee: "true"
          min-description-length: "20"
          fail-on-problem: "true"
```

For production use, replace `@main` with a full commit SHA.

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `require-assignee` | `true` | Require at least one assignee. |
| `min-description-length` | `20` | Minimum visible characters in the description. `0` turns the check off. |
| `fail-on-problem` | `true` | Fail the step on a problem. `false` only prints warnings. |

## Outputs

| Output | Meaning |
| --- | --- |
| `passed` | `true` when every enabled check passed. |
| `problems` | Number of problems found. |

## Test locally

```bash
node --test actions/pr-hygiene-check
```

The action reads the pull request from the webhook payload at `GITHUB_EVENT_PATH`. Try it against a fake event:

```bash
echo '{"pull_request":{"number":42,"assignees":[],"body":""}}' > /tmp/event.json
GITHUB_EVENT_PATH=/tmp/event.json node actions/pr-hygiene-check/check.js
```

Or set the values directly:

```bash
PR_ASSIGNEES='[]' PR_BODY='' node actions/pr-hygiene-check/check.js
```

Expected output: two `::error` lines and exit code 1.
