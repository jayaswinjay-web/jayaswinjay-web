import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';

export default function Library() {
  const { user, setUser } = useAuthStore();
  const [newPlaylist, setNewPlaylist] = useState('');
  const [showNew, setShowNew] = useState(false);
  const navigate = useNavigate();

  const playlists = user?.playlists || [];

  const createPlaylist = async () => {
    if (!newPlaylist.trim()) return;
    try {
      const d = await auth.addPlaylist(newPlaylist.trim());
      setUser({ ...user, playlists: d.playlists });
      setNewPlaylist('');
      setShowNew(false);
    } catch {}
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">Your Library</h1>
        <button
          onClick={() => setShowNew(true)}
          className="bg-accent hover:bg-accent-hover text-white text-sm px-5 py-2 rounded-full transition-colors"
        >
          + New Playlist
        </button>
      </div>

      {showNew && (
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylist}
            onChange={(e) => setNewPlaylist(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
            className="flex-1 bg-surface border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40"
            autoFocus
          />
          <button onClick={createPlaylist} className="bg-accent text-white px-4 rounded-xl text-sm">Create</button>
          <button onClick={() => setShowNew(false)} className="text-text2 px-2 text-sm">Cancel</button>
        </div>
      )}

      <div className="space-y-1">
        <div
          onClick={() => navigate('/app/liked')}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <div className="w-11 h-11 rounded-lg bg-surface2 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Liked Songs</p>
            <p className="text-xs text-text2">{user?.likes?.length || 0} songs</p>
          </div>
        </div>

        {playlists.map(pl => (
          <div
            key={pl.id}
            onClick={() => navigate(`/app/playlist/${pl.id}`)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-surface2 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">{pl.name}</p>
              <p className="text-xs text-text2">{pl.songs?.length || 0} songs</p>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (user?.likes?.length || 0) === 0 && (
        <div className="text-center py-20">
          <p className="text-text2">Your library is empty</p>
          <p className="text-xs text-text2 mt-2">Search for songs to add to your library</p>
        </div>
      )}
    </div>
  );
}
