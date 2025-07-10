import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { Favorite, LocationOn, Directions } from '@mui/icons-material';
import Beams from '../components/Beams';

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const mamiLocations = [
    {
      name: 'Ori',
      coordinates: '32°14\'44.1"N 34°55\'21.1"E',
      description: 'Ori\'s location',
      color: '#FF69B4'
    },
    {
      name: 'Shaked',
      coordinates: '31.919246285167333, 35.00602855642542',
      description: 'Shaked\'s location',
      color: '#9C27B0'
    }
  ];

  const openWazeDirections = (coordinates: string) => {
    // Convert coordinates to Waze format
    let wazeCoords = coordinates;
    
    // If coordinates are in DMS format (Ori), convert to decimal
    if (coordinates.includes('°')) {
      // Parse DMS format: 32°14'44.1"N 34°55'21.1"E
      const match = coordinates.match(/(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/);
      if (match) {
        const [, latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir] = match;
        const lat = (parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600) * (latDir === 'N' ? 1 : -1);
        const lon = (parseInt(lonDeg) + parseInt(lonMin) / 60 + parseFloat(lonSec) / 3600) * (lonDir === 'E' ? 1 : -1);
        wazeCoords = `${lat},${lon}`;
      }
    }
    
    // Open Waze with directions
    const wazeUrl = `https://waze.com/ul?ll=${wazeCoords}&navigate=yes`;
    window.open(wazeUrl, '_blank');
    setDialogOpen(false);
  };

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
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
        >
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 4
          }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2
              }}
            >
              Welcome, Shakedi
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(15px)',
                maxWidth: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.4)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{
                  background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                }}
              >
                To My Special Mami baby <Favorite sx={{ verticalAlign: 'middle', color: '#FF69B4' }} />
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  color: '#FF69B4',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  opacity: 0.9
                }}
              >
                Welcome to our special corner of the internet, a place where our love story comes to life.
                Here you'll find memories we've shared, games about us, and little surprises
                that remind you how much you mean to me.
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  color: '#E91E63',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  opacity: 0.9
                }}
              >
                Explore our gallery of memories, challenge yourself with our relationship quizzes,
                and discover the special messages I've hidden just for you.
              </Typography>
            </Paper>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<LocationOn />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E91E63, #7B1FA2)',
                    boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
                  }
                }}
              >
                Get to Mami
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Favorite
              sx={{
                fontSize: '4rem',
                color: '#FF69B4',
                filter: 'drop-shadow(0 0 10px rgba(255,105,180,0.5))'
              }}
            />
          </motion.div>
        </Box>
      </motion.div>

      {/* Mami Selection Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              Which Mami to visit?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose your destination and get directions
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mamiLocations.map((mami, index) => (
                <motion.div
                  key={mami.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                    onClick={() => openWazeDirections(mami.coordinates)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${mami.color}, ${mami.color}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}
                        >
                          {mami.name.charAt(0)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {mami.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {mami.description}
                          </Typography>
                        </Box>
                        <Directions sx={{ color: mami.color }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
      </Container>
    </Box>
  );
};

export default Home; 