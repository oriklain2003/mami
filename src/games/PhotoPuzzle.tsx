import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Refresh } from '@mui/icons-material';

interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
  row: number;
  col: number;
}

const PhotoPuzzle: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const gridSize = 3; // 3x3 grid
  const imageUrl = '/images/pazzele.png'; // Replace with your image

  const initializePuzzle = () => {
    const newTiles: Tile[] = [];
    const totalTiles = gridSize * gridSize;

    // Create 9 tiles (3x3 grid) and add a tile for the empty space
    for (let i = 0; i < totalTiles - 1; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      newTiles.push({
        id: i,
        currentPos: i,
        correctPos: i,
        row,
        col,
      });
    }

    // Add the empty tile at the last position (this will be the missing piece)
    newTiles.push({
      id: totalTiles - 1,
      currentPos: totalTiles - 1,
      correctPos: totalTiles - 1,
      row: gridSize - 1,
      col: gridSize - 1,
    });

    // Shuffle the tiles (except for the empty tile)
    for (let i = newTiles.length - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newTiles[i].currentPos;
      newTiles[i].currentPos = newTiles[j].currentPos;
      newTiles[j].currentPos = temp;
    }

    setTiles(newTiles);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  const checkCompletion = (updatedTiles: Tile[]) => {
    const isComplete = updatedTiles.every(tile => tile.currentPos === tile.correctPos);
    setIsComplete(isComplete);
    return isComplete;
  };

  const handleTileClick = (clickedTile: Tile) => {
    if (isComplete) return;

    const emptyTile = tiles.find(tile => tile.id === tiles.length - 1);
    if (!emptyTile) return;

    const clickedPos = clickedTile.currentPos;
    const emptyPos = emptyTile.currentPos;

    // Check if the clicked tile is adjacent to the empty tile
    const isAdjacent = (
      Math.abs(Math.floor(clickedPos / gridSize) - Math.floor(emptyPos / gridSize)) +
      Math.abs((clickedPos % gridSize) - (emptyPos % gridSize))
    ) === 1;

    if (isAdjacent) {
      const updatedTiles = tiles.map(tile => {
        if (tile.id === clickedTile.id) {
          return { ...tile, currentPos: emptyPos };
        }
        if (tile.id === emptyTile.id) {
          return { ...tile, currentPos: clickedPos };
        }
        return tile;
      });

      setTiles(updatedTiles);
      setMoves(moves + 1);
      checkCompletion(updatedTiles);
    }
  };

  const getTileStyle = (tile: Tile) => {
    if (tile.id === tiles.length - 1) {
      return { opacity: 0 }; // Empty tile, hidden
    }

    const row = Math.floor(tile.correctPos / gridSize);
    const col = tile.correctPos % gridSize;

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${gridSize * 100}%`,
      backgroundPosition: `-${col * 100}% -${row * 100}%`,
    };
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Photo Puzzle
        </Typography>
        <Typography variant="body1" gutterBottom>
          Moves: {moves}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: '100%',
            aspectRatio: '1/1',
            p: 2,
            mb: 2,
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: 1,
              width: '100%',
              height: '100%',
            }}
          >
            {tiles.sort((a, b) => a.currentPos - b.currentPos).map((tile) => (
              <motion.div
                key={tile.id}
                whileHover={{ scale: isComplete ? 1 : 1.05 }}
                whileTap={{ scale: isComplete ? 1 : 0.95 }}
                onClick={() => handleTileClick(tile)}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: isComplete ? 'default' : 'pointer',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    ...getTileStyle(tile),
                  }}
                />
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
              You completed the puzzle in {moves} moves!
            </Typography>
          </motion.div>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={initializePuzzle}
          sx={{ mt: 2 }}
        >
          New Game
        </Button>
      </Box>
    </Container>
  );
};

export default PhotoPuzzle;
