# Contributing

Thank you for helping. This toolkit stays useful by staying small.

## Ground rules

- **One tool, one problem.** If a change makes a tool do two jobs, it probably belongs in a second tool.
- **Read-only by default.** A tool that writes to GitHub (labels, comments, branches) must be opt-in and say so at the top of its README.
- **No telemetry, analytics, tracking or affiliate code.** Pull requests that add any are closed.
- **No secrets.** Never commit tokens, keys or private repository names. Tools read credentials from the user's own `gh` login or an environment variable the user sets.
- **Zero runtime dependencies** unless there is a strong reason. Use Node.js 18 or newer and the `gh` CLI.
- **Tests that run locally.** Every tool has tests that run with `node --test`, with no network and no credentials.

## Adding a tool

1. Pick a row in the README catalog, or open an issue describing the one problem your tool solves.
2. Create the tool in `actions/`, `mcp/` or `cli/` with its own folder, a README that has a usage example, and tests next to the code.
3. Run `npm test` from the repository root. It must pass without network access.
4. Update the catalog row from **Planned** to **Starter** in your pull request.

## Pull requests

- Keep a pull request to one tool or one fix.
- Describe the problem the change solves and how you tested it.
- Assign a reviewer if you can, and write a real description. The `pr-hygiene-check` action in this repository exists because pull requests without one cost reviewers time.

## Continuous integration

This repository does not ship GitHub-hosted workflow files. Checks run on CircleCI using `.circleci/config.yml`. You can run the same checks locally with `npm test`.

## Code of conduct

Be kind and be specific. Disagree with the code, not the person.
