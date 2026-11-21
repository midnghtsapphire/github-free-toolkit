# Changelog

All notable changes to this project. Append-only, newest first. Each entry: date, agent, what changed.

## 2026-11-21 — Git-Master — Paid dev tools tracker

- Added `Library/paid-tools-tracker.md`: official free tiers, plan names, FOSS alternatives, and keep / free-tier / replace verdicts for mabl, Octopus Deploy, Devin, Bito, Gitar, SonarCloud, CircleCI, cubic, and GitGuardian.
- This public copy has no account emails, invoices, or private amounts. Listed the document in `Library/README.md`.

## 2026-11-14 — Git-Master — Pro Pack buy links

- Replaced the `PRO_PACK_URL` placeholder in `README.md` with the Gumroad and Whop links, and added a "Get the Pro Pack" line to each tool's README. No code changed.

## 2026-11-14 — Git-Master — Starters 4 and 5, project files, Pro Pack hooks

- Added `cli/unassigned-prs` (open pull requests with no assignee) and `cli/repo-inventory` (repositories missing a README, license or description), each with tests and a README. Both are read-only, use `gh api`, accept an owner argument and support `--json`.
- `actions/pr-hygiene-check` now reads the pull request from the webhook payload at `GITHUB_EVENT_PATH` (explicit `PR_*` variables still win); added tests and a README example.
- `mcp/repo-health` now uses your `gh` login (read-only `gh api -X GET`) when no `GITHUB_TOKEN` is set; added tests.
- README: catalog statuses moved to Starter for `unassigned-prs` and `repo-inventory`, quick-start rows added, and a "Support / Pro Pack" section with the `PRO_PACK_URL` placeholder.
- Added `CHANGELOG.md`, `LEDGER.md` and `Library/README.md` per revvel-standards; `.gitignore` now excludes `dist/` (Pro Pack build output is not committed).
- Builds on the starter commit `f3d0595` by TriageChief (`stale-prs`, `pr-hygiene-check`, `repo-health`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, CircleCI config), which is kept as it was.

## 2026-11-14 — TriageChief — First starters

- Added `actions/pr-hygiene-check`, `cli/stale-prs` and `mcp/repo-health` with tests, plus `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md` and `.circleci/config.yml` (commit `f3d0595`, PR #2).

## 2026-11-14 — Audrey Evans — Repository created

- Initial README with the tool catalog (all Planned).
