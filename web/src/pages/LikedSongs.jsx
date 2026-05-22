import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import SongCard from '../components/SongCard';

export default function LikedSongs() {
  const { user } = useAuthStore();
  const { playPlaylist } = usePlayerStore();
  const songs = user?.likes || [];

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-52 h-52 rounded-xl bg-surface2 flex items-center justify-center shrink-0">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-text2 mb-2">Playlist</p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Liked Songs</h1>
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
      {songs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text2">No liked songs yet</p>
          <p className="text-xs text-text2 mt-2">Click the heart icon on any song to save it here</p>
        </div>
      )}
    </div>
  );
}
