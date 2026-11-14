'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { visibleDescription, parseAssignees, evaluate, main } = require('./check.js');

const quiet = { log() {} };

test('visibleDescription ignores HTML comments and whitespace', () => {
  assert.equal(visibleDescription('<!-- fill me in -->\n\n  '), '');
  assert.equal(visibleDescription('Fixes the login bug <!-- note -->'), 'Fixes the login bug');
  assert.equal(visibleDescription(null), '');
});

test('parseAssignees handles empty, null and bad JSON', () => {
  assert.deepEqual(parseAssignees('[]'), []);
  assert.deepEqual(parseAssignees('null'), []);
  assert.deepEqual(parseAssignees(''), []);
  assert.deepEqual(parseAssignees('{oops'), []);
  assert.equal(parseAssignees('[{"login":"a"}]').length, 1);
});

test('evaluate flags a missing assignee and a short description', () => {
  const { problems } = evaluate({ assignees: [], body: 'short', requireAssignee: true, minLength: 20 });
  assert.equal(problems.length, 2);
});

test('evaluate passes with an assignee and a real description', () => {
  const { problems } = evaluate({
    assignees: [{ login: 'a' }],
    body: 'Adds retry logic to the uploader because it drops files on slow links.',
    minLength: 20,
  });
  assert.deepEqual(problems, []);
});

test('evaluate can turn each check off', () => {
  assert.deepEqual(evaluate({ assignees: [], body: '', requireAssignee: false, minLength: 0 }).problems, []);
});

test('main exits 1 on a problem, 0 when fail-on-problem is false', () => {
  const base = { PR_ASSIGNEES: '[]', PR_BODY: '', PR_NUMBER: '7' };
  assert.equal(main({ ...base }, quiet), 1);
  assert.equal(main({ ...base, INPUT_FAIL_ON_PROBLEM: 'false' }, quiet), 0);
});

test('main writes outputs and a step summary, and never prints the body', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-hygiene-'));
  const out = path.join(dir, 'output');
  const summary = path.join(dir, 'summary');
  const lines = [];
  const code = main(
    {
      PR_ASSIGNEES: '[{"login":"someone"}]',
      PR_BODY: 'A long enough description of the change, with a secret-looking word: hunter2hunter2.',
      PR_NUMBER: '3',
      GITHUB_OUTPUT: out,
      GITHUB_STEP_SUMMARY: summary,
    },
    { log: (l) => lines.push(l) }
  );
  assert.equal(code, 0);
  assert.match(fs.readFileSync(out, 'utf8'), /passed=true\nproblems=0/);
  assert.match(fs.readFileSync(summary, 'utf8'), /Passed/);
  assert.ok(!lines.join('\n').includes('hunter2'));
});

test('main treats a null pull request (not a PR event) as failing both checks', () => {
  assert.equal(main({ PR_ASSIGNEES: 'null', PR_BODY: '' }, quiet), 1);
});
