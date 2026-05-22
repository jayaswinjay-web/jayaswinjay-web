import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import SongCard from '../components/SongCard';

export default function Playlist() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { playPlaylist } = usePlayerStore();

  const playlists = user?.playlists || [];
  const playlist = playlists.find(p => p.id === id);
  const songs = playlist?.songs || [];

  return (
    <div className="p-6 animate-fadeIn">
      {playlist ? (
        <>
          <div className="flex items-end gap-6 mb-8">
            <div className="w-52 h-52 rounded-xl bg-surface2 flex items-center justify-center shrink-0">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text3">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text2 mb-2">Playlist</p>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{playlist.name}</h1>
              <p className="text-sm text-text2">{songs.length} songs</p>
              {songs.length > 0 && (
                <button
                  onClick={() => playPlaylist(songs, 0)}
                  className="mt-4 bg-accent hover:bg-accent-hover text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  Play All
                </button>
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            {songs.map((song, i) => (
              <SongCard key={song.id + i} song={song} queue={songs} showAddToPlaylist={false} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-text2">Playlist not found</p>
        </div>
      )}
    </div>
  );
}
