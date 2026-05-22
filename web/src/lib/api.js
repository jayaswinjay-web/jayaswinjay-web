let cachedBase = null;

async function discoverBase() {
  if (typeof window !== 'undefined' && window.Capacitor?.isNative) {
    const candidates = ['http://122.178.15.98:70', 'http://192.168.1.2:70', 'http://localhost:70'];
    for (const url of candidates) {
      try {
        const res = await fetch(`${url}/api/auth/me`, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
        if (res.ok || res.status === 401) return url;
      } catch {}
    }
    return candidates[0];
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:70';
  }
  return `${window.location.protocol}//${window.location.host}`;
}

async function getBase() {
  if (!cachedBase) cachedBase = await discoverBase();
  return cachedBase;
}

export async function request(path, options = {}) {
  const base = await getBase();
  const res = await fetch(`${base}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function streamUrl(id) {
  const base = await getBase();
  return `${base}/api/stream/${id}`;
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


