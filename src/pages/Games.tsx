import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Extension, Favorite, PhotoLibrary } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Games: React.FC = () => {
  const games = [
    {
      title: 'Photo Puzzle',
      description: 'Piece together our special moments in this sliding puzzle game.',
      icon: <PhotoLibrary sx={{ fontSize: 40 }} />,
      path: '/games/photo-puzzle',
      color: '#FF69B4',
    },
    {
      title: 'Love Quiz',
      description: 'Test your knowledge about our relationship and memories together.',
      icon: <Favorite sx={{ fontSize: 40 }} />,
      path: '/games/quiz',
      color: '#9C27B0',
    },
    {
      title: 'Memory Match',
      description: 'Find matching pairs of our photos in this memory card game.',
      icon: <Extension sx={{ fontSize: 40 }} />,
      path: '/games/memory',
      color: '#FF1493',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
          Fun & Games
        </Typography>

        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.title}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 2,
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {React.cloneElement(game.icon, {
                        sx: { ...game.icon.props.sx, color: game.color }
                      })}
                    </motion.div>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {game.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {game.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={game.path}
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 'auto',
                        borderRadius: 25,
                        textTransform: 'none',
                      }}
                    >
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Games; 