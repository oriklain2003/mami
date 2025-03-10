import React, { useState } from 'react';
import {
  Container,
  ImageList,
  ImageListItem,
  Modal,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext, PlayArrow } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Replace these with your actual images and video
const media = [
  {
    src: '/images/wine1.jpg',
    title: 'Our First Date',
    type: 'image'
  },
  {
    src: '/images/crash1.jpg', 
    title: 'Beach Day',
    type: 'image'
  },
  {
    src: '/images/mami3.jpg',
    title: 'Movie Night',
    type: 'image'
  },
  {
    src: '/images/ali1.png',
    title: 'Dinner Date',
    type: 'image'
  },
  {
    src: '/images/food1.png',
    title: 'Cooking Together',
    type: 'image'
  },
  {
    src: '/images/mirror1.png',
    title: 'Mirror Selfie',
    type: 'image'
  },
  {
    src: '/images/balconey.png',
    title: 'Balcony Views',
    type: 'image'
  },
  {
    src: '/images/baby1.png',
    title: 'Sweet Moments',
    type: 'image'
  },
  {
    src: '/images/baby2.png',
    title: 'Together Forever',
    type: 'image'
  }
];

const Gallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (index: number) => {
    setSelectedItem(index);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handlePrevious = () => {
    setSelectedItem((prev) => (prev !== null ? (prev - 1 + media.length) % media.length : null));
  };

  const handleNext = () => {
    setSelectedItem((prev) => (prev !== null ? (prev + 1) % media.length : null));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Our Memories
        </Typography>

        <ImageList
          variant="masonry"
          cols={isMobile ? 1 : 3}
          gap={16}
        >
          {media.map((item, index) => (
            <ImageListItem
              key={item.src}
              onClick={() => handleOpen(index)}
              sx={{ cursor: 'pointer', position: 'relative' }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.type === 'video' ? (
                  <Box sx={{ position: 'relative' }}>
                    <video
                      style={{
                        borderRadius: 8,
                        width: '100%',
                        height: 'auto',
                      }}
                      muted
                      loop
                      autoPlay
                      playsInline
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        p: 1
                      }}
                    >
                      <PlayArrow sx={{ color: 'white', fontSize: 40 }} />
                    </Box>
                  </Box>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                )}
              </motion.div>
            </ImageListItem>
          ))}
        </ImageList>

        <Modal
          open={selectedItem !== null}
          onClose={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence>
            {selectedItem !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 2,
                    outline: 'none',
                  }}
                >
                  <IconButton
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: 'primary.main',
                    }}
                  >
                    <Close />
                  </IconButton>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <IconButton onClick={handlePrevious} color="primary">
                      <NavigateBefore />
                    </IconButton>

                    <Box
                      sx={{
                        position: 'relative',
                        width: isMobile ? '80vw' : '60vw',
                        height: isMobile ? '60vh' : '70vh',
                      }}
                    >
                      {media[selectedItem].type === 'video' ? (
                        <video
                          autoPlay
                          controls
                          loop
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        >
                          <source src={media[selectedItem].src} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={media[selectedItem].src}
                          alt={media[selectedItem].title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      )}
                    </Box>

                    <IconButton onClick={handleNext} color="primary">
                      <NavigateNext />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    align="center"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    {media[selectedItem].title}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default Gallery;