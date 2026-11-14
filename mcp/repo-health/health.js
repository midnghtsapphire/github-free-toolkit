'use strict';

const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/;

function validateName(value, label) {
  if (typeof value !== 'string' || !NAME_RE.test(value) || value === '.' || value === '..') {
    throw new Error(`${label} must be 1-100 characters: letters, digits, dot, underscore or hyphen`);
  }
  return value;
}

/** Ask GitHub (read-only GETs). `token` is optional and only used as a bearer header. */
async function getJson(fetchImpl, base, path, token) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'github-free-toolkit-repo-health' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchImpl(`${base}${path}`, { headers });
  if (res.status === 404) throw new Error('Repository not found (or it is private and no token was provided).');
  if (res.status === 403 || res.status === 429) throw new Error('GitHub refused the request (rate limit or permissions). Set GITHUB_TOKEN to raise the limit.');
  if (!res.ok) throw new Error(`GitHub returned HTTP ${res.status}.`);
  return res.json();
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Pure scoring. Each check is worth the same; score = passed / total * 100.
 * `now` is injectable for tests.
 */
function scoreRepo(repo, community, openPulls, now = Date.now()) {
  const files = (community && community.files) || {};
  const daysSincePush = repo.pushed_at ? Math.floor((now - Date.parse(repo.pushed_at)) / DAY) : null;
  const checks = [
    { id: 'description', ok: Boolean(repo.description && repo.description.trim()), detail: 'Has a repository description' },
    { id: 'readme', ok: Boolean(files.readme), detail: 'Has a README' },
    { id: 'license', ok: Boolean(repo.license || files.license), detail: 'Has a license' },
    { id: 'contributing', ok: Boolean(files.contributing), detail: 'Has contributing guidelines' },
    { id: 'security-policy', ok: Boolean(files.security_policy || (community && community.security_policy)), detail: 'Has a security policy' },
    { id: 'recent-activity', ok: daysSincePush !== null && daysSincePush <= 180, detail: 'Pushed to within the last 180 days' },
    { id: 'not-archived', ok: !repo.archived, detail: 'Is not archived' },
    { id: 'pr-queue', ok: openPulls.length < 30, detail: 'Fewer than 30 open pull requests' },
  ];
  const passed = checks.filter((c) => c.ok).length;
  return {
    repository: repo.full_name,
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    daysSinceLastPush: daysSincePush,
    openPullRequests: openPulls.length,
    openPullRequestsCapped: openPulls.length >= 100,
    checks,
  };
}

async function repoHealth({ owner, repo }, { fetchImpl = fetch, base = 'https://api.github.com', token, now } = {}) {
  validateName(owner, 'owner');
  validateName(repo, 'repo');
  const root = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const repoData = await getJson(fetchImpl, base, root, token);
  const [community, pulls] = await Promise.all([
    getJson(fetchImpl, base, `${root}/community/profile`, token).catch(() => ({})),
    getJson(fetchImpl, base, `${root}/pulls?state=open&per_page=100`, token).catch(() => []),
  ]);
  return scoreRepo(repoData, community, Array.isArray(pulls) ? pulls : [], now);
}

module.exports = { validateName, scoreRepo, repoHealth };
