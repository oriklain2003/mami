import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Collapse,
} from '@mui/material';
import { Visibility, VisibilityOff, Favorite, Help } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordProtectionProps {
  onCorrectPassword: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onCorrectPassword }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'escaperoom' || password.toLowerCase() === 'escape room') {
      setError(false);
      onCorrectPassword();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Favorite
              sx={{
                fontSize: 60,
                color: 'primary.main',
                animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
                '@keyframes shake': {
                  '10%, 90%': {
                    transform: 'translate3d(-1px, 0, 0)',
                  },
                  '20%, 80%': {
                    transform: 'translate3d(2px, 0, 0)',
                  },
                  '30%, 50%, 70%': {
                    transform: 'translate3d(-4px, 0, 0)',
                  },
                  '40%, 60%': {
                    transform: 'translate3d(4px, 0, 0)',
                  },
                },
              }}
            />

            <Typography variant="h5" component="h2" color="primary" textAlign="center">
              Enter Secret Password
            </Typography>

            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{ width: '100%' }}
            >
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                error={error}
                helperText={error ? 'Incorrect password' : ' '}
                placeholder="Enter password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 105, 180, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </motion.div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                borderRadius: 25,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Unlock Our Special Surprise
            </Button>

            <Box sx={{ width: '100%', mt: 1 }}>
              <Button
                startIcon={<Help />}
                onClick={() => setShowHint(!showHint)}
                color="secondary"
                size="small"
                sx={{
                  textTransform: 'none',
                }}
              >
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </Button>
              <Collapse in={showHint}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: 'rgba(255,192,203,0.1)',
                    borderRadius: 2,
                    border: '1px dashed rgba(255,105,180,0.3)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Hint: What's the first thing we did together? Think about that room... 
                  </Typography>
                </Paper>
              </Collapse>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default PasswordProtection; 