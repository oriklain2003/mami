import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import Navigation from './components/Navigation';
import MusicControl from './components/MusicControl';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Games from './pages/Games';
import Gallery from './pages/Gallery';
import Surprise from './pages/Surprise';
import PhotoPuzzle from './games/PhotoPuzzle';
import LoveQuiz from './games/LoveQuiz';
import MemoryMatch from './games/MemoryMatch';
import Music from './pages/Music';
import { Box } from '@mui/material';
import { AudioProvider } from './context/AudioContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AudioProvider>
        <Router>
          <ScrollToTop>
            <Box sx={{ 
              minHeight: '100vh',
              background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #FFE6F3 100%)`,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Navigation />
              <Box 
                component="main" 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  flex: 1,
                  mb: { xs: '120px', sm: '140px' },
                  overflow: 'auto',
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/games/photo-puzzle" element={<PhotoPuzzle />} />
                  <Route path="/games/quiz" element={<LoveQuiz />} />
                  <Route path="/games/memory" element={<MemoryMatch />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/surprise" element={<Surprise />} />
                  <Route path="/music" element={<Music />} />
                </Routes>
              </Box>
              <MusicControl />
            </Box>
          </ScrollToTop>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  );
};

export default App;
