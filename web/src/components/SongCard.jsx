import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';

export default function SongCard({ song, queue = [] }) {
  const { playSong, currentSong, isPlaying, togglePlay, addToQueue } = usePlayerStore();
  const { user, setUser } = useAuthStore();
  const isCurrent = currentSong?.id === song.id;
  const isLiked = user?.likes?.some(s => s.id === song.id);

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playSong(song, queue);
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        const d = await auth.unlikeSong(song.id);
        setUser({ ...user, likes: d.likes });
      } else {
        const d = await auth.likeSong(song);
        setUser({ ...user, likes: d.likes });
      }
    } catch {}
  };

  return (
    <div onClick={handlePlay} className={`group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer ${isCurrent ? 'bg-white/[0.04]' : ''}`}>
      <div className="relative shrink-0">
        <img src={song.thumbnail} alt="" className="w-11 h-11 rounded object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
          {isCurrent && isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isCurrent ? 'text-accent' : ''}`}>{song.title}</p>
        <p className="text-xs text-text2 truncate">{song.artist}</p>
      </div>
      {song.isHiRes && (
        <span className="text-[10px] font-medium text-accent border border-accent/30 rounded px-1 py-0.5 shrink-0">Hi-Res</span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); toggleLike(); }} className={`p-1.5 rounded transition-colors ${isLiked ? 'text-accent' : 'text-text2 hover:text-text'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); addToQueue(song); }} className="p-1.5 rounded text-text2 hover:text-text transition-colors" title="Add to queue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  );
}
