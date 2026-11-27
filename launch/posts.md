# Launch post drafts — DRAFTS ONLY, nothing has been posted

Links used everywhere (plain, no tracking or affiliate parameters):
- Free repo (MIT): https://github.com/midnghtsapphire/github-free-toolkit
- Pro Pack, Gumroad ($9+ pay what you want, $19 suggested): https://angelreporter.gumroad.com/l/fpxeyn
- Pro Pack, Whop ($19): https://whop.com/kdp-agent-fleet/github-free-toolkit-pro-pack/

**Before posting anything:**
1. The tools are on branch `feat/gft-starters-2026-11-14` (PR #3, stacked on PR #2). `main` still has only the README until those are merged by Audrey. Do not post the repo link before the tools are on `main`, or visitors will find an empty catalog.
2. Whop buyers don't receive the zip until it is uploaded to the Files app in the Whop dashboard. Prefer the Gumroad link until then.
3. Everything below is written in Audrey's voice and discloses that she is the author. Post it only from her accounts, and only after she has read it.
4. Don't post the same text in several places on the same day; the versions below are deliberately different.

---

## 1. X — single post (under 280 characters)

```
I made 5 small, free MIT-licensed tools for keeping a GitHub PR queue clean: stale-PR report, unassigned-PR report, repo inventory, a PR-hygiene Action, and a read-only MCP server. Node + gh, zero deps, no telemetry.

https://github.com/midnghtsapphire/github-free-toolkit
```

(Counted at 241 characters with the URL as 23, as X counts it.)

## 2. X — 4-post thread

(Each post is under 280 characters counting URLs as 23: 238, 251, 269 and 276 for posts 1–4, plus about 2 more for the thread emoji in post 1.)

**1/4**
```
Pull requests go stale, land with no owner, or arrive with no description. I got tired of finding out the hard way, so I wrote five small tools for it. All free, MIT, zero dependencies (Node 18+ and the gh CLI). 🧵

https://github.com/midnghtsapphire/github-free-toolkit
```

**2/4**
```
What's in it:
• stale-prs: open PRs nobody has touched in N days, across all your repos
• unassigned-prs: open PRs with no assignee
• repo-inventory: repos missing a README, license or description
All read-only, all have --json, and an owner argument.
```

**3/4**
```
• pr-hygiene-check: a GitHub Action that fails or warns when a PR has no assignee or an empty description
• repo-health: a tiny stdio MCP server so Claude/Cursor/Codex can ask "is this repo in good shape?" and get a score
No telemetry, no tracking, nothing phones home.
```

**4/4**
```
If you want the setup written down, I also put together a Pro Pack: the tools plus a 13-page playbook (weekly stale-PR report on cron, wiring the MCP server into your assistant, a PR-hygiene policy template, troubleshooting). Pay what you want from $9: https://angelreporter.gumroad.com/l/fpxeyn
```

## 3. Show HN

**Title** (limit 80 characters):

```
Show HN: Small free tools to keep a GitHub PR queue clean (Node + gh, MIT)
```

**Body** (HN has no markdown; this is plain text, to be posted as the first comment or in the text field. Use either the URL field with the repo link, or text, not both with duplicate content):

```
Repo: https://github.com/midnghtsapphire/github-free-toolkit

I run a lot of repositories and kept finding pull requests that had gone stale, had no assignee, or had no description. I wrote a handful of small tools for it and put them under MIT. Each one does a single job and is short enough to read in a few minutes.

- stale-prs: lists open PRs idle for N days across a user's or org's repos
- unassigned-prs: lists open PRs with no assignee
- repo-inventory: lists repos missing a README, license or description
- pr-hygiene-check: a composite GitHub Action that fails or warns when a PR has no assignee or an empty description (reads GITHUB_EVENT_PATH, no network, no token)
- repo-health: a minimal stdio MCP server with one read-only tool, repo_health(owner, repo), that scores a repo on eight simple checks

Design rules I held myself to: read-only by default, plain Node 18+ and the gh CLI with no npm dependencies, no telemetry or analytics of any kind, and your own gh login is the only credential. The tests (35 of them) use a stub gh, so they run without network or a token.

These are first versions ("starters"). The scoring in repo-health is deliberately simple and opinionated, and I'd like to hear which checks you'd change. Issues and PRs welcome.

Disclosure: I'm the author. I also sell a paid "Pro Pack" (the same tools plus a setup/playbook PDF and templates) for people who'd rather not piece it together; it is pay-what-you-want from $9: https://angelreporter.gumroad.com/l/fpxeyn . The tools themselves are and will stay free.
```

## 4. Reddit

Reddit blocks automated fetching of its rules pages (HTTP 403 from the box, and WebFetch timed out), so the notes below come from search results that quote each subreddit's rules text. **Read each sub's live rules page and sidebar before posting; moderators can change them.**

### r/github — rules: self-promotion allowed ONLY in the pinned self-promotion megathread
Rule 4 ("Promote your projects in the pinned megathread") is reported as strictly enforced, and rule 1/2 say a bare repo link is low-effort. **Do not make a standalone post.** Reply in the current megathread with:

```
Disclosure: I'm the author.

github-free-toolkit — small, free (MIT) tools for keeping a PR queue clean: stale-prs, unassigned-prs and repo-inventory CLIs built on the gh CLI, a PR-hygiene GitHub Action (fails/warns on no assignee or empty description), and a read-only MCP server (repo-health). Node 18+ and gh, no dependencies, no telemetry.

https://github.com/midnghtsapphire/github-free-toolkit

They're first versions; feedback on what's missing is welcome. (There's also an optional paid bundle with a setup guide, linked from the README. The tools are free regardless.)
```

### r/devops — rules: self-promotion goes in the weekly self-promotion thread; disclose affiliation at the top; posts should be self-contained; AI-looking content gets removed
**Do not make a standalone post.** Use the weekly self-promotion thread, and write it in your own words rather than pasting this verbatim (rule 5 removes LLM-sounding posts):

```
Disclosure: I'm the author of this.

I kept losing track of stale and unowned pull requests across a lot of repos, so I wrote a few small read-only scripts on top of the gh CLI: one lists PRs idle for N days, one lists PRs with no assignee, one lists repos missing a README/license/description. There's also a tiny Action that fails a PR with no assignee or an empty description, and a weekly cron recipe that writes the three reports to a Markdown file.

MIT, Node 18+ and gh, no dependencies, no telemetry. https://github.com/midnghtsapphire/github-free-toolkit

Curious how other teams define "stale" — I used 14 days of no updates, and I'm not sure that's right for slower repos.
```

(Ending with a real question helps the thread work as discussion. The paid Pro Pack is left out of r/devops on purpose: the rules say not to funnel traffic and to avoid being a vendor post.)

### r/mcp — rules: no waitlists, no AI-generated slop, no astroturfing (disclose), use the "showcase" flair
A showcase post is allowed for a finished server. Use the **showcase** flair and disclose authorship. Keep it short and written in your own words:

Title: `[showcase] repo-health: a tiny read-only MCP server that scores a GitHub repo (zero deps, uses your gh login)`

```
I built this, so flagging that up front.

repo-health is a minimal stdio MCP server in plain Node (no npm dependencies) with one read-only tool, repo_health(owner, repo). It returns a 0–100 score from eight simple checks (description, README, license, contributing guide, security policy, recent push, not archived, PR queue size) plus the individual results. It uses your existing gh login, so there's no token in your MCP config, and it validates repo names before any request.

Repo (MIT): https://github.com/midnghtsapphire/github-free-toolkit  (folder mcp/repo-health)

It's a starter, so the checks are simple and opinionated. What would you want it to report that it doesn't?
```

### r/ClaudeAI (optional, only if Audrey wants it)
Search results say r/ClaudeAI welcomes projects built with or for Claude if the post says what it does and how Claude helped, and people can try it for free. Not drafted here because the Claude-specific angle is only the MCP server; reuse the r/mcp text, say whether Claude helped write it, and read the sub's current rules first.

## 5. LinkedIn post

```
Pull requests that nobody owns, nobody described, or nobody has touched for a month are quietly expensive. Every reviewer pays for them.

I've published a small set of free, MIT-licensed tools for this problem:

• stale-prs, unassigned-prs and repo-inventory: read-only command-line reports across all of your repositories
• pr-hygiene-check: a GitHub Action that flags a pull request with no assignee or an empty description
• repo-health: a minimal MCP server so an AI assistant like Claude or Cursor can answer "is this repository in good shape?"

They're built on Node and the GitHub CLI, have no dependencies, and collect no telemetry. Each is short enough to read in a few minutes before you run it.

Repo: https://github.com/midnghtsapphire/github-free-toolkit

These are first versions. If you maintain a busy repo or manage a team's PR queue, I'd value your feedback on what a "healthy" queue should look like.

For anyone who wants the setup written down, there's also a Pro Pack with a 13-page playbook and templates (pay what you want from $9): https://angelreporter.gumroad.com/l/fpxeyn

#GitHub #DeveloperTools #CodeReview #OpenSource #MCP
```

## 6. dev.to / Hashnode — short article outline

**Title:** What a healthy pull-request queue looks like (and five tiny tools to check yours)

1. **The problem (150 words).** Stale PRs, no assignee, empty descriptions; the real cost is reviewer attention, not storage.
2. **Define "healthy" in three rules.** Every PR has an owner; every PR says what and why; nothing sits untouched for 30 days (nudge at 14).
3. **Measure it in 60 seconds.** Run `stale-prs`, `unassigned-prs` and `repo-inventory` against your own account (show real example output with a fake owner). Explain `--json` and `--fail-if-any` for scripts.
4. **Enforce the two rules that can be automated.** The `pr-hygiene-check` Action, why it strips HTML comments (templates), warn-first rollout, and how to run the same check without GitHub-hosted Actions.
5. **Make it a habit.** A weekly cron job writing a Markdown report (short script, the PATH/keyring gotcha with cron and gh).
6. **Let your assistant answer "is this repo okay?"** What an MCP server is in two sentences; the `repo_health` tool; config snippets for Claude Code and Cursor; why using your gh login beats a token in a config file.
7. **Design choices.** Read-only, zero dependencies, no telemetry, tests with a stub `gh`; what I'd change and an invitation for feedback.
8. **Links and disclosure.** Free repo first, then one sentence: "I also sell a Pro Pack with the full playbook if you'd rather not assemble it yourself" with the Gumroad link. Tags: `github`, `devops`, `productivity`, `opensource`.

*Length target: 900–1,200 words. Include one terminal screenshot per CLI and a cron snippet.*
