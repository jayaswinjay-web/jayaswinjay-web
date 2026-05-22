function getBase() {
  if (typeof window !== 'undefined' && window.Capacitor?.isNative) {
    return 'http://122.178.15.98:70';
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:70';
  }
  return `${window.location.protocol}//${window.location.host}`;
}

const BASE = getBase();
const API = `${BASE}/api`;

export async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function streamUrl(id) {
  return `${BASE}/api/stream/${id}`;
}

export const auth = {
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  addPlaylist: (name) => request('/auth/playlists', { method: 'POST', body: JSON.stringify({ name }) }),
  addToPlaylist: (id, song) => request(`/auth/playlists/${id}/songs`, { method: 'POST', body: JSON.stringify({ song }) }),
  removeFromPlaylist: (id, songId) => request(`/auth/playlists/${id}/songs/${songId}`, { method: 'DELETE' }),
  likeSong: (song) => request('/auth/likes', { method: 'POST', body: JSON.stringify({ song }) }),
  unlikeSong: (songId) => request(`/auth/likes/${songId}`, { method: 'DELETE' })
};

export const search = {
  query: (q, next) => request(`/search?q=${encodeURIComponent(q)}${next ? `&next=${next}` : ''}`),
  suggestions: (q) => request(`/search/suggestions?q=${encodeURIComponent(q)}`),
  songInfo: (id) => request(`/search/song/${id}`)
};


