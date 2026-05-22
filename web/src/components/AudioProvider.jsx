import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { streamUrl } from '../lib/api';

export default function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const { currentSong, isPlaying, volume, setAudioElement, setProgress, setDuration, nextSong, setPlaying } = usePlayerStore();
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    setAudioElement(audioRef.current);
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    setProgress(0);
    setDuration(0);
    streamUrl(currentSong.id).then(url => { audio.src = url; audio.load(); });
  }, [currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      const play = () => {
        const p = audio.play();
        if (p) p.catch(() => {
          audio.addEventListener('canplay', () => {
            if (isPlayingRef.current) audio.play().catch(() => {});
          }, { once: true });
        });
      };
      play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => nextSong();
    const onError = () => { setPlaying(false); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      {children}
    </>
  );
}
