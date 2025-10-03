// client/src/api.js
const BASE = '/api';

// small helper returning { ok, data, error }
async function api(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Accept: 'application/json' },
      ...options,
    });
    const ct = res.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await res.json() : null;
    return res.ok
      ? { ok: true, data: body, error: null }
      : { ok: false, data: null, error: (body && body.error) || res.statusText };
  } catch (e) {
    return { ok: false, data: null, error: String(e) };
  }
}

// --- calls the UI uses ---
export async function searchUsers(q) {
  return api(`/search/users?q=${encodeURIComponent(q)}`);
}

export async function getUser(username) {
  return api(`/user/${encodeURIComponent(username)}`);
}

export async function getUserRepos(username) {
  return api(`/user/${encodeURIComponent(username)}/repos`);
}

export async function getRepo(owner, name) {
  return api(`/repo/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`);
}

export async function getRepoCommits(owner, name, limit = 5) {
  return api(`/repo/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/commits?limit=${limit}`);
}

export default api;
