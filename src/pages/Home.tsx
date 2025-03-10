import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Favorite } from '@mui/icons-material';

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);

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

  return (
    <Container maxWidth="md">
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
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                maxWidth: 600
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                To My Special Mami baby <Favorite sx={{ verticalAlign: 'middle' }} />
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to our special corner of the internet, a place where our love story comes to life.
                Here you'll find memories we've shared, games about us, and little surprises
                that remind you how much you mean to me.
              </Typography>
              <Typography variant="body1">
                Explore our gallery of memories, challenge yourself with our relationship quizzes,
                and discover the special messages I've hidden just for you.
              </Typography>
            </Paper>
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
    </Container>
  );
};

export default Home; 