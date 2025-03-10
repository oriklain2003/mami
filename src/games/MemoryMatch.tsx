import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Refresh } from '@mui/icons-material';

interface Card {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Replace these with your actual image paths
  const images = [
    '/images/ali1.png',
    '/images/food1.png',
    '/images/mirror1.png',
    '/images/balconey.png',
    '/images/baby1.png',
    '/images/baby2.png',
  ];

  const initializeGame = () => {
    const duplicatedImages = [...images, ...images];
    const shuffledCards = duplicatedImages
      .map((imageUrl, index) => ({
        id: index,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const timer = setTimeout(() => {
        checkMatch(firstCard, secondCard);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedCards]);

  const checkMatch = (firstId: number, secondId: number) => {
    const firstCard = cards.find(card => card.id === firstId);
    const secondCard = cards.find(card => card.id === secondId);

    if (!firstCard || !secondCard) return;

    let updatedCards;
    if (firstCard.imageUrl === secondCard.imageUrl && firstId !== secondId) {
      // Cards match - mark them as matched and keep them flipped
      updatedCards = cards.map(card =>
        card.id === firstId || card.id === secondId
          ? { ...card, isMatched: true, isFlipped: true }
          : card
      );
    } else {
      // Cards don't match - flip them back
      updatedCards = cards.map(card =>
        card.id === firstId || card.id === secondId
          ? { ...card, isFlipped: false }
          : card
      );
    }

    setCards(updatedCards);
    setFlippedCards([]);
    setMoves(prev => prev + 1);

    // Check if all cards are matched
    const allMatched = updatedCards.every(card => card.isMatched);
    if (allMatched) {
      setIsComplete(true);
    }
  };

  const handleCardClick = (cardId: number) => {
    // Prevent clicking if two cards are already flipped or card is already matched/flipped
    const card = cards.find(c => c.id === cardId);
    if (
      !card ||
      flippedCards.length === 2 ||
      card.isMatched ||
      card.isFlipped ||
      flippedCards.includes(cardId)
    ) {
      return;
    }

    // Flip the card
    const updatedCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // If this is the second card, check for a match
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkMatch(newFlippedCards[0], newFlippedCards[1]);
      }, 1000);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Memory Match
        </Typography>
        <Typography variant="body1" gutterBottom>
          Moves: {moves}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 2,
              width: '100%',
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                onClick={() => handleCardClick(card.id)}
              >
                <Paper
                  elevation={2}
                  sx={{
                    aspectRatio: '1',
                    cursor: card.isMatched ? 'default' : 'pointer',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                    transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.light',
                      borderRadius: 2,
                      color: 'white',
                      fontSize: '2rem',
                    }}
                  >
                    ❤️
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundImage: `url(${card.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 2,
                      opacity: card.isMatched ? 0.7 : 1,
                    }}
                  />
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Paper>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography variant="h5" color="primary" gutterBottom>
              Congratulations! 🎉
            </Typography>
            <Typography variant="body1" gutterBottom>
              You completed the game in {moves} moves!
            </Typography>
          </motion.div>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={initializeGame}
          sx={{ mt: 2 }}
        >
          New Game
        </Button>
      </Box>
    </Container>
  );
};

export default MemoryMatch; 