import React from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { VolumeUp, PlayArrow, Pause, SkipNext, MusicNote } from '@mui/icons-material';
import { useAudio } from '../context/AudioContext';
import { motion } from 'framer-motion';

const MusicControl: React.FC = () => {
  const { 
    isPlaying, 
    toggleMusic, 
    volume, 
    setVolume,
    nextSong,
    currentSongName
  } = useAudio();

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: { xs: 'calc(100% - 40px)', sm: 'auto' },
        minWidth: { sm: '300px' },
        zIndex: 9999, // Ensure it's always on top
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <MusicNote color="primary" fontSize="small" />
          <Typography
            variant="body2"
            color="primary"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentSongName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={toggleMusic}
              color="primary"
              size="small"
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={nextSong}
              color="primary"
              size="small"
            >
              <SkipNext />
            </IconButton>
          </motion.div>

          <Box sx={{ display: 'flex', alignItems: 'center', width: 100 }}>
            <VolumeUp color="primary" sx={{ mr: 1 }} fontSize="small" />
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
              min={0}
              max={1}
              step={0.1}
              size="small"
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(255, 105, 180, 0.16)',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MusicControl; 