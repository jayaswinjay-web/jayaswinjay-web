import { usePlayerStore } from '../store/playerStore';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function Player() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, volume, setVolume, progress, duration, isShuffled, toggleShuffle, repeatMode, cycleRepeat } = usePlayerStore();

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/[0.04] px-4 py-3 z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <p className="text-sm text-text2">Select a song to play</p>
        </div>
      </div>
    );
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/[0.04] px-3 md:px-4 py-2.5 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <div className="flex items-center gap-3 md:w-72 shrink-0">
          <img
            src={currentSong.thumbnail}
            alt=""
            className="w-10 h-10 md:w-11 md:h-11 rounded object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-text2 truncate">{currentSong.artist}</p>
          </div>
          {currentSong.isHiRes && (
            <span className="text-[10px] font-medium text-accent border border-accent/30 rounded px-1 py-0.5 shrink-0 hidden md:inline">Hi-Res</span>
          )}
        </div>

        <div className="flex-1 max-w-xl mx-auto w-full md:w-auto">
          <div className="flex items-center justify-center gap-3 mb-0.5">
            <button onClick={toggleShuffle} className={`text-xs transition-colors ${isShuffled ? 'text-accent' : 'text-text2 hover:text-text'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
            </button>
            <button onClick={prevSong} className="text-text2 hover:text-text transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button onClick={togglePlay} className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-text text-bg flex items-center justify-center active:scale-95 transition-transform">
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>
            <button onClick={nextSong} className="text-text2 hover:text-text transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
            <button onClick={cycleRepeat} className={`text-xs transition-colors ${repeatMode !== 'off' ? 'text-accent' : 'text-text2 hover:text-text'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-[11px] text-text2 w-8 text-right tabular-nums">{formatTime(progress)}</span>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={(e) => {
                  const audio = document.querySelector('audio');
                  if (audio) audio.currentTime = Number(e.target.value);
                }}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #3B82F6 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`
                }}
              />
            </div>
            <span className="text-[10px] md:text-[11px] text-text2 w-8 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden md:flex w-36 shrink-0 items-center justify-end gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20"
            style={{ background: `linear-gradient(to right, #3B82F6 ${volume * 100}%, rgba(255,255,255,0.08) ${volume * 100}%)` }}
          />
        </div>
      </div>
    </div>
  );
}
