# GitHub Free Toolkit

Small, free, open tools that each solve one real problem in GitHub. Built for people who run real repositories and want a clean pull-request queue without buying another platform.

**Three families, one rule: do one job, read before you write.**

| Family | What it is | Folder |
| --- | --- | --- |
| GitHub Actions | Drop-in checks for your pull requests | `actions/` |
| MCP servers | Read-only tools your AI assistant can call | `mcp/` |
| CLIs | Terminal commands built on the `gh` CLI | `cli/` |

## Why this exists

Pull requests go stale, land without an owner, or arrive with no description. Each of those costs a reviewer time. These tools find the problem and tell you about it. They are lighter versions of larger internal tooling, kept small on purpose so you can read the whole source in a few minutes.

## Principles

- **One tool, one problem.** No framework, no platform.
- **Read-only by default.** Anything that could change your repositories is opt-in and says so in its README.
- **No telemetry, no analytics, no tracking, no affiliate links.** Nothing phones home.
- **No secrets in this repo, and none required to try a tool.** Tools that call GitHub use your own `gh` login or a token you provide.
- **Zero runtime dependencies.** Plain Node.js (18 or newer) and the `gh` CLI where noted.
- **MIT licensed.**

## Catalog

Status: **Starter** means a working first version is in the repository. **Planned** means it is on the roadmap with no delivery date.

### GitHub Actions

| Tool | Problem it solves | Status |
| --- | --- | --- |
| `pr-hygiene-check` | Pull requests opened with no assignee or no description | Planned |
| `stale-pr-label` | Open pull requests nobody has touched for weeks | Planned |
| `pr-title-check` | Pull request titles that do not follow your convention | Planned |
| `large-pr-warning` | Pull requests too big to review well | Planned |
| `secret-pattern-hint` | Obvious key-shaped strings in a diff, before review | Planned |

### MCP servers

| Tool | Problem it solves | Status |
| --- | --- | --- |
| `repo-health` | "Is this repository in good shape?" in one read-only call | Planned |
| `pr-queue` | A summary of open pull requests for an assistant to read | Planned |
| `ci-status` | The latest check results for a branch or pull request | Planned |
| `issue-digest` | A short digest of new and unanswered issues | Planned |

### CLIs

| Tool | Problem it solves | Status |
| --- | --- | --- |
| `stale-prs` | Finding stale open pull requests across all of your repositories | Planned |
| `repo-inventory` | Repositories missing a README, license or description | Planned |
| `unassigned-prs` | Open pull requests with no assignee | Planned |
| `branch-report` | Branches that look merged or abandoned (report only, never deletes) | Planned |

The first working starter in each family arrives in the first pull request. This table is updated as each one lands.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) once the first pull request is merged, and report vulnerabilities privately through the repository's Security tab.

Maintained by Audrey Evans ([@midnghtsapphire](https://github.com/midnghtsapphire)).
