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

function main(env = process.env, stdout = console) {
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

module.exports = { visibleDescription, parseAssignees, evaluate, main };
