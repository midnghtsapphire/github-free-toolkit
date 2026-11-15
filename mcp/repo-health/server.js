#!/usr/bin/env node
'use strict';

/**
 * Minimal MCP server over stdio (newline-delimited JSON-RPC 2.0).
 * One read-only tool: repo_health. No dependencies, no telemetry.
 */

const readline = require('node:readline');
const { repoHealth } = require('./health.js');

const SERVER_INFO = { name: 'repo-health-mcp', version: '0.1.0' };
const SUPPORTED = ['2025-06-18', '2025-03-26', '2024-11-05'];

const TOOLS = [
  {
    name: 'repo_health',
    description:
      'Read-only health check of a GitHub repository: description, README, license, contributing guide, security policy, recent activity, archived state and open pull request count. Returns a 0-100 score and the individual checks.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string', description: 'User or organization, for example "octocat".' },
        repo: { type: 'string', description: 'Repository name, for example "hello-world".' },
      },
      required: ['owner', 'repo'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
];

function result(id, value) {
  return { jsonrpc: '2.0', id, result: value };
}
function error(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

/** Handle one parsed message. Returns a response object, or null for notifications. */
async function handle(message, env = process.env, deps = {}) {
  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return error(message && message.id !== undefined ? message.id : null, -32600, 'Invalid Request');
  }
  const { id, method, params } = message;
  const isNotification = id === undefined;

  switch (method) {
    case 'initialize': {
      const wanted = params && params.protocolVersion;
      return result(id, {
        protocolVersion: SUPPORTED.includes(wanted) ? wanted : SUPPORTED[0],
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
    }
    case 'ping':
      return isNotification ? null : result(id, {});
    case 'tools/list':
      return result(id, { tools: TOOLS });
    case 'tools/call': {
      if (!params || params.name !== 'repo_health') {
        return error(id, -32602, `Unknown tool: ${params && params.name}`);
      }
      try {
        const base = (env.GITHUB_API_URL || 'https://api.github.com').replace(/\/$/, '');
        const out = await repoHealth(params.arguments || {}, { base, token: env.GITHUB_TOKEN, ...deps });
        return result(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] });
      } catch (e) {
        return result(id, { isError: true, content: [{ type: 'text', text: e.message }] });
      }
    }
    default:
      if (method.startsWith('notifications/') || isNotification) return null;
      return error(id, -32601, `Method not found: ${method}`);
  }
}

function serve(input = process.stdin, output = process.stdout, env = process.env) {
  const rl = readline.createInterface({ input });
  const pending = new Set();
  rl.on('line', (line) => {
    if (!line.trim()) return;
    const work = (async () => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        output.write(`${JSON.stringify(error(null, -32700, 'Parse error'))}\n`);
        return;
      }
      const response = await handle(message, env);
      if (response) output.write(`${JSON.stringify(response)}\n`);
    })();
    pending.add(work);
    work.finally(() => pending.delete(work));
  });
  rl.on('close', () => Promise.all([...pending]).then(() => output.end && output !== process.stdout && output.end()));
}

if (require.main === module) {
  serve();
}

module.exports = { handle, serve, TOOLS };
