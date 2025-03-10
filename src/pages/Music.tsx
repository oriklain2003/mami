import React from 'react';
import { Box, Container, Typography, IconButton, Paper, Slider } from '@mui/material';
import { PlayArrow, Pause, SkipNext, MusicNote } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Music: React.FC = () => {
  const { isPlaying, toggleMusic, nextSong, currentSongName, progress, duration, seek } = useAudio();

  const handleProgressChange = (_event: Event, newValue: number | number[]) => {
    seek(newValue as number);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        textAlign: 'center', 
        my: 4,
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Now Playing
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: 400,
            mt: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}>
              {/* Spinning Music Icon */}
              <Box
                component={motion.div}
                animate={{
                  rotate: isPlaying ? 360 : 0
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }}
                sx={{
                  width: { xs: 150, sm: 200 },
                  height: { xs: 150, sm: 200 },
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #FFB6C1, #FFC0CB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MusicNote sx={{ fontSize: 80, color: 'white' }} />
              </Box>

              {/* Song Name */}
              <Typography 
                variant="h5" 
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}
              >
                {currentSongName}
              </Typography>

              {/* Progress Bar */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Slider
                  value={progress}
                  onChange={handleProgressChange}
                  min={0}
                  max={duration}
                  sx={{
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px rgba(255, 105, 180, 0.16)`,
                      },
                      '&.Mui-active': {
                        width: 20,
                        height: 20,
                      },
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.28,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(progress)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>

              {/* Controls */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={toggleMusic}
                    color="primary"
                    size="large"
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: 'rgba(255,192,203,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,192,203,0.2)',
                      }
                    }}
                  >
                    {isPlaying ? <Pause sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
                  </IconButton>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={nextSong}
                    color="primary"
                    size="large"
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: 'rgba(255,192,203,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,192,203,0.2)',
                      }
                    }}
                  >
                    <SkipNext sx={{ fontSize: 32 }} />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Paper>
      </Box>
    </Container>
  );
};

export default Music; 