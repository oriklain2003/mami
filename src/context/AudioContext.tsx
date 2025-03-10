import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  currentSongName: string;
  progress: number;
  duration: number;
  seek: (position: number) => void;
}

// List of songs to play
const songs = [
  { name: "Smoke", src: "/music/s2.mp3" },
  { name: "Mami Song", src: "/music/s1.mp3" },
  { name: "About You", src: "/music/s3.mp3" }
];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    if (sound && isPlaying) {
      progressInterval = setInterval(() => {
        const currentTime = sound.seek() as number;
        setProgress(currentTime);
      }, 1000);
    }
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [sound, isPlaying]);

  const loadSong = useCallback((index: number) => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    const newSound = new Howl({
      src: [songs[index].src],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(newSound.duration());
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        // Automatically play next song when current one ends
        nextSong();
      }
    });

    setSound(newSound);
    return newSound;
  }, []);

  const seek = useCallback((position: number) => {
    if (sound) {
      sound.seek(position);
      setProgress(position);
    }
  }, [sound]);

  useEffect(() => {
    const newSound = loadSong(currentSongIndex);
    return () => {
      if (newSound) {
        newSound.stop();
        newSound.unload();
      }
    };
  }, [currentSongIndex, loadSong]);

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  const toggleMusic = useCallback(() => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  }, [sound, isPlaying]);

  const nextSong = useCallback(() => {
    if (sound) {
      sound.stop();
      sound.unload();
    }
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    
    // Small timeout to ensure proper cleanup before starting new song
    setTimeout(() => {
      const newSound = loadSong(nextIndex);
      newSound.play();
    }, 50);
  }, [currentSongIndex, sound, loadSong]);

  return (
    <AudioContext.Provider 
      value={{ 
        isPlaying, 
        toggleMusic, 
        volume, 
        setVolume, 
        nextSong,
        currentSongName: songs[currentSongIndex].name,
        progress,
        duration,
        seek
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 