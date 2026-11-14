# repo-health-mcp

A minimal [Model Context Protocol](https://modelcontextprotocol.io) server with **one read-only tool**, `repo_health`. Ask your AI assistant "is this repository in good shape?" and get a score plus the individual checks.

- Read-only: it only makes `GET` requests to the GitHub API.
- No dependencies, no telemetry. It talks to GitHub and to your assistant over stdio, nothing else.
- Works without a token for public repositories (GitHub's low anonymous rate limit applies). To raise the limit or read your private repositories, set `GITHUB_TOKEN` yourself. The token is only sent to GitHub as a header and is never logged or returned.

## What it checks

Eight equally weighted checks give a 0 to 100 score: description, README, license, contributing guide, security policy, a push within the last 180 days, not archived, and fewer than 30 open pull requests.

## Usage

Add it to your MCP client. For example, in a client that uses a JSON config:

```json
{
  "mcpServers": {
    "repo-health": {
      "command": "node",
      "args": ["/absolute/path/to/github-free-toolkit/mcp/repo-health/server.js"],
      "env": { "GITHUB_TOKEN": "set-your-own-read-only-token-here" }
    }
  }
}
```

The `env` block is optional. Then ask: "Check the health of octocat/hello-world."

Try it by hand from a terminal:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"repo_health","arguments":{"owner":"octocat","repo":"hello-world"}}}' \
  | node mcp/repo-health/server.js
```

## Tool

| Tool | Arguments | Returns |
| --- | --- | --- |
| `repo_health` | `owner`, `repo` | JSON text: `score`, `passed`, `total`, `daysSinceLastPush`, `openPullRequests` and a `checks` list |

Set `GITHUB_API_URL` to point at GitHub Enterprise Server. The default is `https://api.github.com`.

## Test locally

The tests use an injected fetch and a local fake API, so they need no network or token:

```bash
npm test
```
