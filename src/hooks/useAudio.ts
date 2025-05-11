
import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPingSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audio = new Audio('/ping-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log('Audio playback blocked by browser:', err);
    });
    audioRef.current = audio;
  }, []);

  const playStartSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audio = new Audio('/start-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch((err) => {
      console.log('Audio playback blocked by browser:', err);
    });
    audioRef.current = audio;
  }, []);

  const playCompleteSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audio = new Audio('/complete-sound.mp3');
    audio.volume = 0.4;
    audio.play().catch((err) => {
      console.log('Audio playback blocked by browser:', err);
    });
    audioRef.current = audio;
  }, []);

  return {
    playPingSound,
    playStartSound,
    playCompleteSound
  };
};
