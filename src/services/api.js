const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
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
