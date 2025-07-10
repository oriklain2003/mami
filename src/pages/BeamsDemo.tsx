import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import Beams from '../components/Beams';

const BeamsDemo: React.FC = () => {
  const [beamWidth, setBeamWidth] = useState(2);
  const [beamHeight, setBeamHeight] = useState(28);
  const [beamNumber, setBeamNumber] = useState(12);
  const [lightColor, setLightColor] = useState("#FF69B4");
  const [speed, setSpeed] = useState(0.2);
  const [noiseIntensity, setNoiseIntensity] = useState(1.8);
  const [scale, setScale] = useState(0.56);
  const [rotation, setRotation] = useState(122);
  const [showControls, setShowControls] = useState(true);

  const colorOptions = [
    { value: "#FF69B4", label: "Pink" },
    { value: "#9C27B0", label: "Purple" },
    { value: "#2196F3", label: "Blue" },
    { value: "#4CAF50", label: "Green" },
    { value: "#FF9800", label: "Orange" },
    { value: "#F44336", label: "Red" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FFD700", label: "Gold" }
  ];

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
          beamWidth={beamWidth}
          beamHeight={beamHeight}
          beamNumber={beamNumber}
          lightColor={lightColor}
          speed={speed}
          noiseIntensity={noiseIntensity}
          scale={scale}
          rotation={rotation}
        />
      </Box>
      
      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              mb: 4
            }}
          >
            Animated Beams Background
          </Typography>

          <Grid container spacing={3}>
            {/* Controls Panel */}
            {showControls && (
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      maxHeight: '80vh',
                      overflowY: 'auto'
                    }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Customize Beams
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Beam Width: {beamWidth}</Typography>
                      <Slider
                        value={beamWidth}
                        onChange={(_, value) => setBeamWidth(value as number)}
                        min={0.5}
                        max={5}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Beam Height: {beamHeight}</Typography>
                      <Slider
                        value={beamHeight}
                        onChange={(_, value) => setBeamHeight(value as number)}
                        min={5}
                        max={30}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Number of Beams: {beamNumber}</Typography>
                      <Slider
                        value={beamNumber}
                        onChange={(_, value) => setBeamNumber(value as number)}
                        min={3}
                        max={20}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Speed: {speed}</Typography>
                      <Slider
                        value={speed}
                        onChange={(_, value) => setSpeed(value as number)}
                        min={0.1}
                        max={5}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Noise Intensity: {noiseIntensity}</Typography>
                      <Slider
                        value={noiseIntensity}
                        onChange={(_, value) => setNoiseIntensity(value as number)}
                        min={0}
                        max={3}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Scale: {scale}</Typography>
                      <Slider
                        value={scale}
                        onChange={(_, value) => setScale(value as number)}
                        min={0.01}
                        max={1}
                        step={0.01}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>Rotation: {rotation}°</Typography>
                      <Slider
                        value={rotation}
                        onChange={(_, value) => setRotation(value as number)}
                        min={0}
                        max={360}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <FormControl fullWidth>
                        <InputLabel>Light Color</InputLabel>
                        <Select
                          value={lightColor}
                          label="Light Color"
                          onChange={(e) => setLightColor(e.target.value)}
                        >
                          {colorOptions.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: color.value,
                                    border: '1px solid #ccc'
                                  }}
                                />
                                {color.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={showControls}
                          onChange={(e) => setShowControls(e.target.checked)}
                        />
                      }
                      label="Show Controls"
                    />
                  </Paper>
                </motion.div>
              </Grid>
            )}

            {/* Preview Area */}
            <Grid item xs={12} md={showControls ? 8 : 12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ 
                      height: '70vh', 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'white',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        Interactive Beams Background
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 3,
                mt: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                About This Background
              </Typography>
              <Typography variant="body1" paragraph>
                This animated beams background uses WebGL shaders and Three.js to create a dynamic, 
                interactive visual effect. The beams are generated using noise functions and can be 
                customized in real-time with various parameters.
              </Typography>
              <Typography variant="body1">
                Features include customizable beam dimensions, animation speed, noise intensity, 
                color schemes, and rotation. The effect creates a modern, sci-fi aesthetic that's 
                perfect for creating an immersive user experience.
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BeamsDemo; 