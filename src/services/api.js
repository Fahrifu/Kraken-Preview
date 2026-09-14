const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 5000);

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const data = await response.json();
        message = data.error || message;
      } catch {}
      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Kraken API request timed out after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  getTeams: () => request('/teams'),
  getPlayers: () => request('/players'),
  getMatches: () => request('/matches'),
  getMatch: (id) => request(`/matches/${id}`),
  getRosterHistory: (team) => request(`/roster-history${team ? `?team=${encodeURIComponent(team)}` : ''}`),
  getNews: () => request('/news'),
  getSponsors: () => request('/sponsors'),
  getStaff: () => request('/staff'),
  getAchievements: () => request('/achievements'),
  getTournaments: () => request('/tournaments'),
  getOpponents: () => request('/opponents'),
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  syncProviders: (token) => request('/admin/sync/providers', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  syncRuns: (token) => request('/admin/sync/runs', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  syncTeam: (teamId, token) => request(`/admin/sync/teams/${teamId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  }),
  adminOverview: (token) => request('/admin/overview', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  adminList: (resource, token) => request(`/admin/${resource}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  adminCreate: (resource, data, token) => request(`/admin/${resource}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  adminUpdate: (resource, id, data, token) => request(`/admin/${resource}/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  }),
  adminDelete: (resource, id, token) => request(`/admin/${resource}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
};
