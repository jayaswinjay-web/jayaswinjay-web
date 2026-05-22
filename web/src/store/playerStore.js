import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 'off',
  audioElement: null,

  setAudioElement: (el) => set({ audioElement: el }),

  playSong: (song, queue = []) => {
    const newQueue = queue.length > 0 ? queue : [song];
    const idx = newQueue.findIndex(s => s.id === song.id);
    set({ currentSong: song, queue: newQueue, queueIndex: idx >= 0 ? idx : 0, isPlaying: true, progress: 0, duration: 0 });
  },

  playPlaylist: (songs, index = 0) => {
    set({ currentSong: songs[index], queue: songs, queueIndex: index, isPlaying: true, progress: 0, duration: 0 });
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (v) => set({ isPlaying: v }),
  setProgress: (p) => set({ progress: p }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),

  nextSong: () => {
    const { queue, queueIndex, isShuffled, repeatMode } = get();
    if (queue.length === 0) return;
    let nextIdx;
    if (repeatMode === 'one') {
      set({ progress: 0 });
      return;
    }
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') nextIdx = 0;
        else { set({ isPlaying: false }); return; }
      }
    }
    set({ currentSong: queue[nextIdx], queueIndex: nextIdx, progress: 0, duration: 0 });
  },

  prevSong: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    const prevIdx = queueIndex - 1 >= 0 ? queueIndex - 1 : queue.length - 1;
    set({ currentSong: queue[prevIdx], queueIndex: prevIdx, progress: 0, duration: 0 });
  },

  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),
  cycleRepeat: () => set((s) => {
    const modes = ['off', 'all', 'one'];
    const idx = modes.indexOf(s.repeatMode);
    return { repeatMode: modes[(idx + 1) % modes.length] };
  }),

  addToQueue: (song) => set((s) => ({ queue: [...s.queue, song] })),
  removeFromQueue: (idx) => set((s) => ({ queue: s.queue.filter((_, i) => i !== idx) }))
}));
