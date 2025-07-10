import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress,
  Alert,
  Fab,
  Paper,
} from '@mui/material';
import { 
  Close, 
  NavigateBefore, 
  NavigateNext, 
  PlayArrow, 
  Add as AddIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, GalleryImage } from '../services/api';
import Beams from '../components/Beams';

interface MediaItem {
  src: string;
  title: string;
  type: 'image' | 'video';
  filename?: string;
  isDeleting?: boolean;
}

const Gallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; index: number | null; filename: string | null }>({
    show: false,
    index: null,
    filename: null
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const images = await apiService.getGalleryImages();
      
      const mediaItems: MediaItem[] = images.map((image, index) => ({
        src: image.url, // This is now base64 data
        title: `Memory ${index + 1}`,
        type: 'image' as const,
        filename: image.filename,
      }));
      
      setMedia(mediaItems);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const invalidFiles = Array.from(files).filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select only image files');
      return;
    }

    // Check file count limit
    if (files.length > 10) {
      setError('Maximum 10 files allowed at once');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const uploadedImages = await apiService.uploadMultipleImages(Array.from(files));
      if (uploadedImages.length > 0) {
        // Add new images to the list
        const newMediaItems: MediaItem[] = uploadedImages.map((image, index) => ({
          src: image.url,
          title: `New Memory ${media.length + index + 1}`,
          type: 'image',
          filename: image.filename,
        }));
        
        setMedia(prev => [...prev, ...newMediaItems]);
      } else {
        setError('Failed to upload images');
      }
    } catch (err) {
      setError('Failed to upload images');
      console.error('Error uploading images:', err);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle image deletion confirmation
  const handleDeleteClick = (filename: string, index: number) => {
    setDeleteConfirm({
      show: true,
      index,
      filename
    });
  };

  // Handle confirmed image deletion
  const handleDeleteImage = async () => {
    if (!deleteConfirm.filename || deleteConfirm.index === null) return;
    
    const index = deleteConfirm.index; // Extract to avoid null checks
    
    try {
      const success = await apiService.deleteImage(deleteConfirm.filename);
      if (success) {
        // Animate the deletion
        const updatedMedia = [...media];
        updatedMedia[index] = { ...updatedMedia[index], isDeleting: true };
        setMedia(updatedMedia);
        
        // Wait for animation to complete before removing from state
        setTimeout(() => {
          setMedia(prev => prev.filter((_, i) => i !== index));
          if (selectedItem === index) {
            setSelectedItem(null);
          } else if (selectedItem !== null && selectedItem > index) {
            setSelectedItem(selectedItem - 1);
          }
        }, 500); // Match animation duration
      } else {
        setError('Failed to delete image');
      }
    } catch (err) {
      setError('Failed to delete image');
      console.error('Error deleting image:', err);
    } finally {
      setDeleteConfirm({ show: false, index: null, filename: null });
    }
  };

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

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Beams Background */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0 
        }}>
          <Beams
            beamWidth={2}
            beamHeight={28}
            beamNumber={12}
            lightColor="#FF69B4"
            speed={0.2}
            noiseIntensity={1.8}
            scale={0.56}
            rotation={122}
          />
        </Box>
        
        {/* Loading Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: 4, mb: 4, textAlign: 'center' }}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              display: 'inline-block'
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
              Loading memories...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Beams Background */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0 
      }}>
        <Beams
          beamWidth={2}
          beamHeight={28}
          beamNumber={12}
          lightColor="#FF69B4"
          speed={0.2}
          noiseIntensity={1.8}
          scale={0.56}
          rotation={122}
        />
      </Box>
      
      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 3,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Our Memories
          </Typography>
        </Paper>

        {error && (
          <Paper
            elevation={8}
            sx={{
              p: 2,
              mb: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Paper>
        )}

        {media.length === 0 ? (
          <Paper
            elevation={8}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No memories yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload your first image to start building your gallery!
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={8}
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}
          >
            <ImageList
              variant="masonry"
              cols={isMobile ? 1 : 3}
              gap={16}
            >
            {media.map((item, index) => (
              <ImageListItem
                key={item.filename || item.src}
                onClick={() => handleOpen(index)}
                sx={{ cursor: 'pointer', position: 'relative' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ 
                    opacity: item.isDeleting ? 0 : 1, 
                    scale: item.isDeleting ? 0 : 1, 
                    rotate: item.isDeleting ? 180 : 0,
                    y: item.isDeleting ? -100 : 0,
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0, 
                    rotate: 180,
                    y: -100,
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.1 // Staggered animation for new items
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
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
                    <Box sx={{ position: 'relative' }}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
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
                      </motion.div>
                      
                      {item.filename && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.filename!, index);
                            }}
                            sx={{
                              bgcolor: 'rgba(255, 0, 0, 0.8)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(255, 0, 0, 0.9)',
                              },
                            }}
                            size="small"
                          >
                            <motion.div
                              animate={{ 
                                rotate: item.isDeleting ? 360 : 0,
                                scale: item.isDeleting ? 1.5 : 1,
                              }}
                              transition={{ 
                                duration: 0.5,
                                ease: "easeInOut"
                              }}
                            >
                              <DeleteIcon />
                            </motion.div>
                          </IconButton>
                        </motion.div>
                      )}
                    </Box>
                  )}
                </motion.div>
              </ImageListItem>
            ))}
          </ImageList>
          </Paper>
        )}

        {/* Upload FAB */}
        <Fab
          color="primary"
          aria-label="add photos"
          sx={{
            position: 'fixed',
            bottom: 120, // Changed from 16 to 120 to move it higher
            right: 16,
          }}
          disabled={uploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
        </Fab>

        {/* Hidden file input */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

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
                      zIndex: 1,
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

        {/* Delete Confirmation Dialog */}
        <Modal
          open={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, index: null, filename: null })}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 4,
                maxWidth: 400,
                textAlign: 'center',
                boxShadow: 24,
                outline: 'none',
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <DeleteIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'error.main',
                    mb: 2
                  }} 
                />
              </motion.div>
              
              <Typography variant="h5" component="h2" gutterBottom>
                Delete Photo?
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                This action cannot be undone. The photo will be permanently deleted.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setDeleteConfirm({ show: false, index: null, filename: null })}
                    sx={{ minWidth: 100 }}
                  >
                    Cancel
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteImage}
                    sx={{ minWidth: 100 }}
                  >
                    Delete
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Modal>
      </motion.div>
      </Container>
    </Box>
  );
};

export default Gallery;