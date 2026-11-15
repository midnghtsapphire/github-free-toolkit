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
| [`pr-hygiene-check`](actions/pr-hygiene-check) | Pull requests opened with no assignee or no description | Starter |
| `stale-pr-label` | Open pull requests nobody has touched for weeks | Planned |
| `pr-title-check` | Pull request titles that do not follow your convention | Planned |
| `large-pr-warning` | Pull requests too big to review well | Planned |
| `secret-pattern-hint` | Obvious key-shaped strings in a diff, before review | Planned |

### MCP servers

| Tool | Problem it solves | Status |
| --- | --- | --- |
| [`repo-health`](mcp/repo-health) | "Is this repository in good shape?" in one read-only call | Starter |
| `pr-queue` | A summary of open pull requests for an assistant to read | Planned |
| `ci-status` | The latest check results for a branch or pull request | Planned |
| `issue-digest` | A short digest of new and unanswered issues | Planned |

### CLIs

| Tool | Problem it solves | Status |
| --- | --- | --- |
| [`stale-prs`](cli/stale-prs) | Finding stale open pull requests across all of your repositories | Starter |
| [`repo-inventory`](cli/repo-inventory) | Repositories missing a README, license or description | Starter |
| [`unassigned-prs`](cli/unassigned-prs) | Open pull requests with no assignee | Starter |
| `branch-report` | Branches that look merged or abandoned (report only, never deletes) | Planned |

One starter in each family is in the repository today. Open each tool's README for a usage example. The rest of the table is updated as each one lands.

## Quick start

```bash
git clone https://github.com/midnghtsapphire/github-free-toolkit.git
cd github-free-toolkit
npm test            # runs every tool's tests locally, no network or credentials needed
```

| Try this | Command |
| --- | --- |
| List stale pull requests across your repositories | `node cli/stale-prs/bin/stale-prs.js --days 14` |
| List open pull requests nobody is assigned to | `node cli/unassigned-prs/bin/unassigned-prs.js` |
| Find repositories missing a README, license or description | `node cli/repo-inventory/bin/repo-inventory.js --public-only` |
| Score a repository's health (MCP server, over stdio) | see [`mcp/repo-health`](mcp/repo-health) |
| Check pull requests for an assignee and a description | see [`actions/pr-hygiene-check`](actions/pr-hygiene-check) |

## Support / Pro Pack

Everything in this repository is free and MIT licensed, and always will be. If it saves you time and you want to support the project, the **Pro Pack** is a one-time download: all of the tools bundled together with a Setup & Playbook guide (install each tool, a weekly stale-PR report on cron, wiring `repo-health` into Claude or Cursor, a PR-hygiene policy template, and troubleshooting).

Get the Pro Pack: [Gumroad ($9+, pay what you want)](https://angelreporter.gumroad.com/l/fpxeyn) or [Whop ($19)](https://whop.com/kdp-agent-fleet/github-free-toolkit-pro-pack/).

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a tool. Report vulnerabilities privately through the repository's Security tab; see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE).

Maintained by Audrey Evans ([@midnghtsapphire](https://github.com/midnghtsapphire)).
