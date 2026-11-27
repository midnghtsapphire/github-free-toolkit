# Paid Dev Tools Tracker

Living record of paid developer tools, official free tiers, honest FOSS alternatives, and whether we should keep, stay on the free tier, or replace them. Researched 21 November 2026 from official vendor pages.

This repository is public. This file lists plan names, free-tier limits, FOSS alternatives, and verdicts only. It does not include account emails, invoices, or private amounts. A private Page, [Paid Dev Tools Tracker](https://cursor.com/canvas/store-5dff67e0-0da3-409d-8060-69c6f8a2be81/38e34522-5552-4bf1-85ce-73fd939a4854), holds list prices and any receipt amounts.

Purchases, domain buys, and paid plan upgrades still need an explicit yes. This file only recommends.

Git-Master will refresh official pricing pages, new GitHub releases of the FOSS list, and receipt mail each day, then update this file (tiers and alternatives) and the Page (amounts).

## Verdicts

| Tool | Status in this fleet | Free tier | FOSS alternatives | Just as good? | Verdict |
| --- | --- | --- | --- | --- | --- |
| mabl | Interested in free local runs | 14-day trial. Local Desktop, CLI, and CI Runner runs consume zero credits and are unlimited. Cloud runs spend plan credits. No forever-free self-serve plan. | [Playwright](https://github.com/microsoft/playwright) (100,730 stars, Apache-2.0, v1.65.1, 13 Nov 2026). [Selenium](https://github.com/SeleniumHQ/selenium) (34,603 stars, Apache-2.0, 4.53.0). [Cypress](https://github.com/cypress-io/cypress) (51,035 stars, MIT, v16.3.0). | No, not at no-code AI authoring and self-healing. Yes as a owned, rerunnable test suite for a fleet that already writes tests. | Use local/CLI/CI runs if an account or trial exists. Prefer Playwright in CircleCI for the long-term suite. |
| Octopus Deploy | Likes the free 10 targets; paid looks very expensive | Forever free: 10 projects, 10 tenants, 10 machines, 10 users, 5 concurrent tasks. Cloud Free needs a deploy or runbook every 60 days. | [Kamal](https://github.com/basecamp/kamal) (14,751 stars, MIT, v2.12.0). [Argo CD](https://github.com/argoproj/argo-cd) (24,670 stars, Apache-2.0, v3.6.2). [Flux](https://github.com/fluxcd/flux2) (8,537 stars, Apache-2.0, v2.10.1). | Not a drop-in for Octopus's target model. Kamal is simpler app deploy. Argo and Flux are Kubernetes-native. Fine if we stay inside the free 10. | Stay on the Free tier. Do not buy Cloud. If more than 10 machines are ever required, self-host Octopus Server (no Cloud platform fee) or use Kamal/scripts. |
| Devin | Reviews pull requests | Free plan: limited usage plus Devin Review. Self-serve paid plans are Pro, Max, Teams, and Enterprise. SWE-2 is free on Desktop and CLI for self-serve plans through 30 Nov 2026. | [OpenHands](https://github.com/OpenHands/OpenHands) (93,961 stars, MIT, v1.43.0, 20 Nov 2026). [Aider](https://github.com/Aider-AI/aider) (50,211 stars, Apache-2.0, last release 9 Aug 2025, last push 22 May 2026). [Continue](https://github.com/continuedev/continue) (36,536 stars, Apache-2.0). | OpenHands is the closest coding agent. It is not just as good as Devin Review or Devin cloud sessions. Aider is less actively released. | Use Free / do not buy Max. Keep Devin Review only while it is useful; the owner is more into testing than creating apps. |
| Bito | Paid for code review (early Nov 2026) | 14-day Professional trial, then paid. Team and Professional are per-seat plans with a pooled lines-of-code quota and overages. | [PR-Agent](https://github.com/The-PR-Agent/pr-agent) (16,527 stars, MIT, v0.50.0). [Kodus](https://github.com/kodustech/kodus-ai) (1,643 stars, AGPLv3, v2.2.17). | Good self-hosted reviewers, not as polished as Bito. Overlaps Gitar, cubic, and Devin Review. | Keep the paid Team plan for now. Revisit once overlap with other reviewers is pruned. |
| Gitar | In use on pull requests; automatic reviews paused this billing period after included processing ran out | 14-day Pro trial. PR summaries stay free. Core and Pro have a processing budget and can pause automatic reviews. Enterprise is exempt. Vetted open-source projects can get Pro features. | PR-Agent and Kodus, same as Bito, plus the other paid reviewers already on these pull requests. | Not a reason to buy a higher tier. The gap is overlap and a usage cap, not a missing feature. | Do not pay a higher Gitar tier. If already on Pro, Enterprise would lift the cap and is not worth stacking. If on Core, Pro's CircleCI analysis is the only relevant self-serve extra, and still not worth buying while Bito, cubic, Devin Review, and SonarCloud cover the same PRs. |
| SonarCloud | Keep Sonar, with a free Semgrep/Qlty backup in CircleCI. Highest paid tier before Enterprise was reported; analysis limits run out fast. | Free forever: 50k private LOC, plus an OSS plan for public projects. Team is LOC-tiered up to 1.9M private LOC. Enterprise is unlimited LOC and custom. Billing is by private LOC, not by how often the same code is analyzed. | [Semgrep](https://github.com/semgrep/semgrep) (17,879 stars, LGPL-2.1, v1.186.0). [Qlty](https://github.com/qltysh/qlty) (3,228 stars, Business Source License 1.1 until 10 Dec 2028, v0.672.0) is fine in our own CI, not OSI-open yet. | Strong backup, not a full Sonar replacement. | Keep Sonar, as requested, and keep the Semgrep/Qlty CircleCI backup. |
| CircleCI | Performance plan (welcome mail mid-November 2026). Required because GitHub-hosted Actions are billing-locked. | Free: included monthly credits, 5 users, limited concurrency. Too small for this fleet. | [Woodpecker CI](https://github.com/woodpecker-ci/woodpecker) (8,263 stars, Apache-2.0, v3.20.1) or self-hosted runners. | Not as convenient as CircleCI Performance for this fleet. | Keep Performance. Watch credit auto-refills. Do not add GitHub-hosted Actions. |
| cubic | Team plan | Starter: 20 PR reviews a month. Free for public repositories. Team includes a reviewed-line allowance; Pro and Max raise that allowance. Reviews pause when the allowance runs out unless flex capacity is turned on. | PR-Agent / Kodus. | Same as Bito: good enough as a backup, not a reason to buy Pro or Max on top of the other reviewers. | Keep Team. Do not upgrade to Pro or Max. |
| GitGuardian | In the review/secrets stack | Starter is free: up to 25 developers, unlimited real-time scanning, limited historical scans and API calls. Growth and Enterprise are sales-quoted. | [Gitleaks](https://github.com/gitleaks/gitleaks) (31,241 stars, MIT, v8.30.1; still pushed 28 Oct 2026) already runs in CircleCI. [detect-secrets](https://github.com/Yelp/detect-secrets) (4,682 stars, Apache-2.0). | Not just as good at incident workflow. Enough together with Gitleaks on the free Starter tier. | Use the free Starter tier unless a paid plan is already in place. |

## Gitar, one line

Do not pay a higher Gitar tier: automatic reviews are already paused on the included budget, and Bito, cubic, Devin Review, and SonarCloud already cover the pull requests.

## Octopus licensing note

The expensive jump is the Cloud platform fee (priced by concurrent task cap), not "20 machines." Sales described a new licensing model (projects, tenants, and machines, plus that Cloud fee). The 2026 product line also tightened the REST API (scoped keys, rate limits, removed deprecated endpoints). Stay on Free. If more than 10 machines are ever required, prefer self-hosted Octopus Server or Kamal rather than Cloud.

## Build our own

Assemble these in this repository and run them on CircleCI, not GitHub-hosted Actions. No new paid plan is required to start.

1. **Self-hosted pull-request reviewer.** Run PR-Agent in CircleCI, pointed at the revvel-standards model chain and review rules, as a backup or later replacement for overlapping Gitar, Bito, and cubic comments.
2. **Playwright pack for mabl-style tests.** Browser, API, and accessibility checks that run locally and in CircleCI, so cloud test credits stay optional.
3. **Quality and secrets backup already started.** Keep Semgrep, Qlty, Trivy, and Gitleaks in CircleCI as the free backup to SonarCloud and GitGuardian. Qlty's Business Source license is fine for our own CI until it becomes GPL-3.0 on 10 December 2028.
4. **Keep Octopus on 10 machines.** Use Kamal or simple deploy scripts for anything that would force an 11th target.

## Daily scan

Each day:

1. Recheck the official pricing pages listed below.
2. Check new GitHub releases for the FOSS alternatives in the table.
3. Look for new or overlapping tools, and for receipt mail from vendor domains.
4. Update this file with tiers and alternatives only. Put any amounts on the private Page.
5. Do not buy or upgrade anything without an explicit yes.

## Official sources

Checked 21 November 2026:

- [mabl pricing](https://www.mabl.com/pricing)
- [How mabl usage is measured](https://help.mabl.com/hc/en-us/articles/46951187139860-How-usage-is-measured-in-mabl) (updated 17 Nov 2026)
- [Octopus pricing overview](https://octopus.com/pricing/overview)
- [Octopus licensing FAQ](https://octopus.com/pricing/faq)
- [Devin self-serve plans](https://docs.devin.ai/admin/billing/self-serve)
- [Bito pricing](https://bito.ai/pricing/)
- [Gitar pricing](https://www.sonarsource.com/plans-and-pricing/gitar/)
- [SonarQube Cloud plans](https://www.sonarsource.com/plans-and-pricing/)
- [CircleCI pricing](https://circleci.com/pricing/)
- [cubic pricing](https://www.cubic.dev/pricing-plans)
- [GitGuardian pricing](https://www.gitguardian.com/pricing)

## 2026-11-26 — Daily scan (Git-Master)

Changes since the 21 November 2026 entry. Official pages rechecked on 26 November 2026; GitHub data pulled the same day.

### Tools we track

| Tool | What changed since 21 Nov | Verdict |
| --- | --- | --- |
| mabl | No change seen. Local, CLI, and CI Runner runs still use no credits; the 14-day trial is still listed. | Unchanged |
| Octopus Deploy | No change to the Free tier (10 projects, 10 tenants, 10 machines, 10 users, 5 concurrent tasks). Sales closed the licensing conversation on 25 Nov 2026 with no plan change. | Stay on Free |
| Devin | The self-serve page now describes a **Free mode** on the Teams plan: each member can run up to 2 cloud sessions at a time on SWE-2 at no cost. The 21 Nov entry noted SWE-2 free on Desktop and CLI through 30 Nov 2026; that end date is no longer on the page. Plan names and list structure are unchanged. | Unchanged. Recheck after 30 Nov |
| Bito | The pricing page now leads with two newer products, **Governor** (usage-based model router and context engine for coding agents) and **AI Architect** (contact sales). AI Code Review Team and Professional plans and their line allowance are unchanged. Professional lists a self-hosted add-on. | Unchanged. Governor is not needed |
| Gitar | No pricing change. Automatic reviews are still paused on the included processing budget (bot notes on pull requests on 26 Nov 2026). | Still do not pay a higher tier |
| SonarCloud | No change. Free 50k private LOC; Team still priced by LOC. | Unchanged |
| CircleCI | No change to Free or Performance terms. | Unchanged |
| cubic | No change. Team, Pro, Max, Starter (20 PR reviews a month), free for public repos; flex capacity still optional. | Unchanged |
| GitGuardian | No change. Starter is still free: 25 developers, unlimited real-time scanning, 500 historical scans, 10,000 API calls a month. | Unchanged |

### FOSS alternatives, new releases

| Project | Stars | License | Latest release |
| --- | --- | --- | --- |
| [Playwright](https://github.com/microsoft/playwright) | 101,116 | Apache-2.0 | v1.65.1 (13 Nov 2026, unchanged) |
| [Cypress](https://github.com/cypress-io/cypress) | 51,042 | MIT | v16.4.0 (25 Nov 2026, new) |
| [OpenHands](https://github.com/OpenHands/OpenHands) | 94,400 | MIT | v1.46.0 (25 Nov 2026, new) |
| [PR-Agent](https://github.com/The-PR-Agent/pr-agent) | 16,685 | MIT | v0.50.0 (unchanged) |
| [Semgrep](https://github.com/semgrep/semgrep) | 17,980 | LGPL-2.1 | v1.187.0 (24 Nov 2026, new) |
| [Qlty](https://github.com/qltysh/qlty) | 3,235 | Business Source License 1.1 | v0.674.0 (24 Nov 2026, new) |
| [Woodpecker CI](https://github.com/woodpecker-ci/woodpecker) | 8,289 | Apache-2.0 | v3.21.0 (25 Nov 2026, new) |
| [Gitleaks](https://github.com/gitleaks/gitleaks) | 31,363 | MIT | v8.30.1 (unchanged) |
| [Kamal](https://github.com/basecamp/kamal) | 14,759 | MIT | v2.12.0 (unchanged) |

None of these changes is a reason to drop a paid tool today.

### New or trending, worth watching

- [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre): open-source agent for CI/CD reliability. 15,715 stars, Apache-2.0, release v0.1.2026.11.26 (26 Nov 2026). On GitHub trending today. Watch only; not evaluated.
- [interfere-inc/landmines](https://github.com/interfere-inc/landmines): Oxlint rules aimed at AI-written code (fake implementations, masked flaky tests). 822 stars, MIT, created 28 Oct 2026. Could join the CircleCI lint backup; not evaluated.
- [pierridotite/mobile-agent-testers](https://github.com/pierridotite/mobile-agent-testers): parallel AI testers on phone simulators. 2,468 stars, MIT, created 16 Nov 2026. It runs on GitHub-hosted runners, which this fleet does not use, so it would need porting to CircleCI.
- [xcodebeast/flashwright](https://github.com/xcodebeast/flashwright): says it is a faster drop-in replacement for Playwright. 372 stars, Apache-2.0, created 8 Oct 2026. Too young to trust; keep Playwright.
- Security news to be aware of: [1Password update on a November 2026 security incident](https://1password.com/blog/update-on-nov-2026-security-incident) and a [GitHub incident on degraded experiences across products](https://www.githubstatus.com/incidents/qn8mfv6q5hlx). Not checked against our accounts.

### Not checked

- Product Hunt was not checked today.
- The Bito and cubic pricing pages returned a bot-check page to a plain download and were read through a second fetch. All nine official pages were read.

## 2026-11-27 — Daily scan (Git-Master)

Changes since the 26 November 2026 entry. Official pages rechecked on 27 November 2026 (word-level compare against the 26 November copies); GitHub data pulled the same day.

### Tools we track

| Tool | What changed since 26 Nov | Verdict |
| --- | --- | --- |
| mabl | No change. | Unchanged |
| Octopus Deploy | No change. | Stay on Free |
| Devin | No change. Free mode on Teams and the Free, Pro, Max, and Teams plan list are the same. | Unchanged. Recheck after 30 Nov |
| Bito | No change. Governor and AI Architect still lead the page; AI Code Review Team and Professional are unchanged. | Unchanged |
| Gitar | No pricing change. Automatic reviews are still paused on the included budget (bot notes on pull requests on 26 Nov 2026, Mountain Time). | Still do not pay a higher tier |
| SonarCloud | No change. | Unchanged |
| CircleCI | No change. | Unchanged |
| cubic | No change. Team, Pro, Max, and optional flex capacity are the same. | Unchanged |
| GitGuardian | No change. | Unchanged |

### FOSS alternatives, new releases

| Project | Stars | License | Latest release |
| --- | --- | --- | --- |
| [Playwright](https://github.com/microsoft/playwright) | 101,187 | Apache-2.0 | v1.65.1 (unchanged) |
| [Cypress](https://github.com/cypress-io/cypress) | 51,041 | MIT | v16.4.0 (unchanged) |
| [OpenHands](https://github.com/OpenHands/OpenHands) | 94,455 | MIT | v1.46.0 (unchanged) |
| [PR-Agent](https://github.com/The-PR-Agent/pr-agent) | 16,719 | MIT | v0.50.0 (unchanged) |
| [Kodus](https://github.com/kodustech/kodus-ai) | 1,663 | AGPLv3 (GitHub shows NOASSERTION) | selfhosted-2.2.12 (22 Nov 2026) |
| [Semgrep](https://github.com/semgrep/semgrep) | 18,010 | LGPL-2.1 | v1.187.0 (unchanged) |
| [Qlty](https://github.com/qltysh/qlty) | 3,236 | Business Source License 1.1 | v0.674.0 (unchanged) |
| [Woodpecker CI](https://github.com/woodpecker-ci/woodpecker) | 8,294 | Apache-2.0 | v3.21.0 (unchanged) |
| [Gitleaks](https://github.com/gitleaks/gitleaks) | 31,389 | MIT | v8.30.1 (unchanged) |
| [Kamal](https://github.com/basecamp/kamal) | 14,765 | MIT | v2.12.0 (unchanged) |
| [Argo CD](https://github.com/argoproj/argo-cd) | 24,709 | Apache-2.0 | v3.6.3 (24 Nov 2026, new since 21 Nov) |

None of these is a reason to drop a paid tool today.

### New or trending, worth watching

- [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre): still on GitHub trending. 16,031 stars, Apache-2.0, release v0.1.2026.11.27 (26 Nov 2026, Mountain Time). Watch only.
- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter): Claude Code skill bundle for bug hunting and red-team work. 25,624 stars, MIT, top of GitHub trending today. Security research skills, not a replacement for GitGuardian or Sonar. Not evaluated.
- [interfere-inc/landmines](https://github.com/interfere-inc/landmines): new release @interfere/landmines@0.3.2 (25 Nov 2026, Mountain Time). 823 stars, MIT. Still a candidate for the CircleCI lint backup; not evaluated.
- Security news to be aware of: a Hacker News thread reports that [Notion's official MCP server put hidden upsell instructions into agent context](https://news.ycombinator.com/item?id=50658093) (source post on Reddit). Not verified. Relevant to the fleet's prompt-injection work and to any bot using a Notion connector.

### Not checked

- Product Hunt was not checked today.
- Bito and cubic again returned a bot-check page to a plain download; Bito was read through a second fetch, and cubic loaded on the second try. All nine official pages were read.
