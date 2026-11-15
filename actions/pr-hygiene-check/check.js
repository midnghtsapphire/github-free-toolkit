#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

/**
 * Remove HTML comments (pull request templates are full of them) and trim,
 * so an untouched template does not count as a description.
 */
function visibleDescription(body) {
  return String(body || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

function isTrue(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  return String(value).trim().toLowerCase() === 'true';
}

function parseAssignees(raw) {
  if (!raw || String(raw).trim() === '' || String(raw).trim() === 'null') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Pure check. Returns { problems: string[] }.
 */
function evaluate({ assignees, body, requireAssignee = true, minLength = 20 }) {
  const problems = [];
  if (requireAssignee && assignees.length === 0) {
    problems.push('This pull request has no assignee. Assign someone who is responsible for it.');
  }
  if (minLength > 0) {
    const length = visibleDescription(body).length;
    if (length < minLength) {
      problems.push(
        `The description has ${length} visible characters; at least ${minLength} are required. Say what changed and why.`
      );
    }
  }
  return { problems };
}

function appendFile(path, text) {
  if (path) fs.appendFileSync(path, text);
}

/**
 * Read the pull request from the webhook payload GitHub writes to GITHUB_EVENT_PATH.
 * Explicit PR_ASSIGNEES / PR_BODY / PR_NUMBER environment variables win when they are set (used by tests).
 */
function loadEvent(env) {
  if (!env.GITHUB_EVENT_PATH) return {};
  try {
    const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    const pr = event.pull_request || {};
    return {
      PR_ASSIGNEES: JSON.stringify(pr.assignees || []),
      PR_BODY: pr.body,
      PR_NUMBER: pr.number === undefined ? undefined : String(pr.number),
    };
  } catch {
    return {};
  }
}

function main(rawEnv = process.env, stdout = console) {
  const fromEvent = loadEvent(rawEnv);
  const env = { ...rawEnv };
  for (const key of ['PR_ASSIGNEES', 'PR_BODY', 'PR_NUMBER']) {
    if (env[key] === undefined && fromEvent[key] !== undefined) env[key] = fromEvent[key];
  }
  const minParsed = Number.parseInt(env.INPUT_MIN_DESCRIPTION_LENGTH ?? '20', 10);
  const minLength = Number.isNaN(minParsed) ? 20 : minParsed;
  const { problems } = evaluate({
    assignees: parseAssignees(env.PR_ASSIGNEES),
    body: env.PR_BODY,
    requireAssignee: isTrue(env.INPUT_REQUIRE_ASSIGNEE, true),
    minLength,
  });
  const failOnProblem = isTrue(env.INPUT_FAIL_ON_PROBLEM, true);
  const passed = problems.length === 0;
  const label = env.PR_NUMBER ? `PR #${env.PR_NUMBER}` : 'This pull request';

  for (const problem of problems) {
    const level = failOnProblem ? 'error' : 'warning';
    stdout.log(`::${level} title=PR hygiene::${problem}`);
  }
  if (passed) stdout.log(`${label}: hygiene check passed.`);

  appendFile(env.GITHUB_OUTPUT, `passed=${passed}\nproblems=${problems.length}\n`);
  const summary = passed
    ? `### PR hygiene\n\nPassed.\n`
    : `### PR hygiene\n\n${problems.map((p) => `- ${p}`).join('\n')}\n`;
  appendFile(env.GITHUB_STEP_SUMMARY, summary);

  return !passed && failOnProblem ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { visibleDescription, parseAssignees, evaluate, loadEvent, main };
