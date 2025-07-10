import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Fab,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  Add as AddIcon,
  Edit as EditIcon,
  AccessTime,
  PhotoCamera,
  MyLocation,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

interface LocationData {
  id: string;
  person: 'ori' | 'shaked';
  location: string;
  description: string;
  photo?: string;
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const WhereImAt: React.FC = () => {
  const [oriLocation, setOriLocation] = useState<LocationData | null>(null);
  const [shakedLocation, setShakedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<'ori' | 'shaked' | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    photo: null as File | null,
  });
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Fetch location data
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [oriData, shakedData] = await Promise.all([
        apiService.getLocation('ori'),
        apiService.getLocation('shaked'),
      ]);
      
      setOriLocation(oriData);
      setShakedLocation(shakedData);
    } catch (err) {
      setError('Failed to load location data');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!editingPerson || !formData.location || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const updatedLocation = await apiService.updateLocation(
        editingPerson,
        formData.location,
        formData.description,
        formData.photo || undefined,
        currentCoordinates || undefined
      );

      if (updatedLocation) {
        if (editingPerson === 'ori') {
          setOriLocation(updatedLocation);
        } else {
          setShakedLocation(updatedLocation);
        }
        setDialogOpen(false);
        resetForm();
      } else {
        setError('Failed to update location');
      }
    } catch (err) {
      setError('Failed to update location');
      console.error('Error updating location:', err);
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      location: '',
      description: '',
      photo: null,
    });
    setCurrentCoordinates(null);
    setEditingPerson(null);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  // Get current location from browser
  const getCurrentLocation = () => {
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Store coordinates for later use
        setCurrentCoordinates({ lat: latitude, lng: longitude });
        
        // Use reverse geocoding to get location name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.display_name || `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setFormData(prev => ({
              ...prev,
              location: locationName,
            }));
            setGettingLocation(false);
          })
          .catch(() => {
            // Fallback to coordinates if geocoding fails
            setFormData(prev => ({
              ...prev,
              location: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            }));
            setGettingLocation(false);
          });
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access was denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while getting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Open edit dialog
  const openEditDialog = (person: 'ori' | 'shaked') => {
    const currentLocation = person === 'ori' ? oriLocation : shakedLocation;
    setEditingPerson(person);
    setFormData({
      location: currentLocation?.location || '',
      description: currentLocation?.description || '',
      photo: null,
    });
    setDialogOpen(true);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ p: 0, height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Ori's Side - Blue */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 900,
                mb: 4,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '0.1em',
              }}
            >
              Ori
            </Typography>

            {oriLocation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card
                  sx={{
                    maxWidth: { xs: 320, md: 400 },
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {oriLocation.photo && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={oriLocation.photo}
                      alt={oriLocation.location}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1976d2',
                        mb: 2,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {oriLocation.location}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      paragraph
                      sx={{ 
                        lineHeight: 1.6,
                        mb: 2.5,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {oriLocation.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        {formatTimestamp(oriLocation.timestamp)}
                      </Typography>
                    </Box>
                    <Tooltip title="Click to open in Google Maps" arrow>
                      <Chip
                        icon={<LocationOn />}
                        label={oriLocation.location}
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                          if (oriLocation.coordinates) {
                            // Open with coordinates if available
                            window.open(
                              `https://www.google.com/maps?q=${oriLocation.coordinates.lat},${oriLocation.coordinates.lng}`,
                              '_blank'
                            );
                          } else {
                            // Open with location name as search query
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(oriLocation.location)}`,
                              '_blank'
                            );
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                          height: { xs: 32, md: 36 },
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                          },
                        }}
                      />
                    </Tooltip>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: { xs: 320, md: 400 },
                    width: '100%',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    No location set
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                    Ori hasn't shared their location yet
                  </Typography>
                </Paper>
              </motion.div>
            )}

          </motion.div>

          {/* Edit Button for Ori */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ position: 'absolute', bottom: 20, right: 20 }}
          >
            <Fab
              color="primary"
              aria-label="edit ori location"
              onClick={() => openEditDialog('ori')}
              sx={{
                bgcolor: 'white',
                color: '#1976d2',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <EditIcon />
            </Fab>
          </motion.div>
        </Box>

        {/* Shaked's Side - Pink */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #e91e63 0%, #f48fb1 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 900,
                mb: 4,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '0.1em',
              }}
            >
              Shaked
            </Typography>

            {shakedLocation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card
                  sx={{
                    maxWidth: { xs: 320, md: 400 },
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {shakedLocation.photo && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={shakedLocation.photo}
                      alt={shakedLocation.location}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        color: '#e91e63',
                        mb: 2,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {shakedLocation.location}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      paragraph
                      sx={{ 
                        lineHeight: 1.6,
                        mb: 2.5,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {shakedLocation.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        {formatTimestamp(shakedLocation.timestamp)}
                      </Typography>
                    </Box>
                    <Tooltip title="Click to open in Google Maps" arrow>
                      <Chip
                        icon={<LocationOn />}
                        label={shakedLocation.location}
                        color="secondary"
                        variant="outlined"
                        onClick={() => {
                          if (shakedLocation.coordinates) {
                            // Open with coordinates if available
                            window.open(
                              `https://www.google.com/maps?q=${shakedLocation.coordinates.lat},${shakedLocation.coordinates.lng}`,
                              '_blank'
                            );
                          } else {
                            // Open with location name as search query
                            window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(shakedLocation.location)}`,
                              '_blank'
                            );
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                          height: { xs: 32, md: 36 },
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: '0 4px 8px rgba(233, 30, 99, 0.3)',
                          },
                        }}
                      />
                    </Tooltip>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: { xs: 320, md: 400 },
                    width: '100%',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    No location set
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                    Shaked hasn't shared their location yet
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </motion.div>

          {/* Edit Button for Shaked */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ position: 'absolute', bottom: 20, left: 20 }}
          >
            <Fab
              color="secondary"
              aria-label="edit shaked location"
              onClick={() => openEditDialog('shaked')}
              sx={{
                bgcolor: 'white',
                color: '#e91e63',
                boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 35px rgba(233, 30, 99, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <EditIcon />
            </Fab>
          </motion.div>
        </Box>
      </Box>

      {/* Edit Location Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <Typography variant="h5" component="div" sx={{ 
              fontWeight: 700,
              color: '#333',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}>
              Update {editingPerson ? editingPerson.charAt(0).toUpperCase() + editingPerson.slice(1) : ''}'s Location
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                  <Button
                    variant="outlined"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    startIcon={gettingLocation ? <CircularProgress size={16} /> : <MyLocation />}
                    sx={{ minWidth: 'auto', px: 2 }}
                    title="Get current location"
                  >
                    {gettingLocation ? '' : 'GPS'}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {formData.photo ? formData.photo.name : 'Add Photo (Optional)'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={uploading || !formData.location || !formData.description}
              startIcon={uploading ? <CircularProgress size={16} /> : <AddIcon />}
            >
              {uploading ? 'Updating...' : 'Update Location'}
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    </Container>
  );
};

export default WhereImAt; 