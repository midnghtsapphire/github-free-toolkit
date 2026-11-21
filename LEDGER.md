# LEDGER — github-free-toolkit

Play-by-play record per revvel-standards. Append-only. Newest first.

## 2026-11-21 — Git-Master session — Paid dev tools tracker

- **Actor:** Git-Master (GitHub orchestrator)
- **Requested by:** Audrey Evans, 2026-11-21 (asked to track paid apps, check free tiers and FOSS alternatives, and use what was found to make our own)
- **Role:** executed
- **Files:** `Library/paid-tools-tracker.md`, `Library/README.md`, `CHANGELOG.md`, `LEDGER.md`
- **What was done:** Added a public tracker of official free tiers, plan names, FOSS alternatives, and verdicts for mabl, Octopus Deploy, Devin, Bito, Gitar, SonarCloud, CircleCI, cubic, and GitGuardian. Opened a PR into `daily/2026-11-21`. Did not merge it.
- **Decisions:** This public repository must not contain account emails, invoices, or private amounts; those stay on the private Page. Official public list prices also stay off this copy so the file is tiers and alternatives only. Purchases still need an explicit yes, so the file only recommends. No GitHub-hosted Actions were added. Qlty is recorded as Business Source (not OSI-open) until 10 Dec 2028, still usable in our own CI.
- **Open / handoff:** PRs are not self-merged. Daily refreshes should update this file (tiers and alternatives) and the private Page (amounts).

## 2026-11-14 — Git-Master session — Pro Pack buy links

- **Actor:** Git-Master (GitHub orchestrator)
- **Requested by:** Audrey Evans, 2026-11-14 ("I need it launched stop waiting for me figure it out and launch it")
- **Role:** executed
- **Files:** `README.md`, `cli/*/README.md`, `actions/pr-hygiene-check/README.md`, `mcp/repo-health/README.md`, `CHANGELOG.md`, `LEDGER.md`
- **What was done:** Replaced the `PRO_PACK_URL` placeholder with the live listings (Gumroad https://angelreporter.gumroad.com/l/fpxeyn, Whop https://whop.com/kdp-agent-fleet/github-free-toolkit-pro-pack/) and linked them from each tool README. Repository homepage and topics were set with `gh repo edit`; visibility was not changed.
- **Decisions:** Links are plain, with no tracking or affiliate parameters. Tools remain free and MIT licensed.

## 2026-11-14 — Git-Master session — Launch starters and Pro Pack

- **Actor:** Git-Master (GitHub orchestrator)
- **Requested by:** Audrey Evans, 2026-11-14 ("Yes please but I need it launched stop waiting for me figure it out and launch it"; "im pretty desperate to get something monetized")
- **Role:** executed
- **Files:** `cli/unassigned-prs/`, `cli/repo-inventory/`, `actions/pr-hygiene-check/{check.js,action.yml,README.md,check.test.js}`, `mcp/repo-health/{health.js,README.md,test/gh-transport.test.js}`, `README.md`, `CHANGELOG.md`, `LEDGER.md`, `Library/README.md`, `.gitignore`
- **What was done:** Completed the first set of working starters (two more CLIs, `GITHUB_EVENT_PATH` support in the Action, `gh` login support in the MCP server), documented them, and added a Support / Pro Pack section with a `PRO_PACK_URL` placeholder. The paid Pro Pack zip and cover image are built locally under `dist/` and are deliberately not committed.
- **Decisions:** Built on top of TriageChief's open starter branch (`feat/starters-and-project-files`, PR #2) instead of duplicating it, so the two efforts do not conflict. Did not add any `.github/workflows` file (Audrey does not use GitHub-hosted Actions); an example workflow is in the tool README only. No telemetry, tracking, analytics or affiliate code.
- **Open / handoff:** Git-Master replaces `PRO_PACK_URL` in `README.md` with the Gumroad link once the listing exists. The Pro Pack guide source lives in `dist/pro-pack-src/` (not in git); keep a private copy. PRs are not self-merged; Audrey decides.

## 2026-11-14 — TriageChief — First starters

- **Actor:** TriageChief
- **Requested by:** Audrey Evans, 2026-11-14
- **Role:** executed
- **Files:** `actions/pr-hygiene-check/`, `cli/stale-prs/`, `mcp/repo-health/`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `.circleci/config.yml`, `README.md`
- **What was done:** First working starter in each family, license, contributing and security notes, CircleCI test config (commit `f3d0595`, PR #2).
