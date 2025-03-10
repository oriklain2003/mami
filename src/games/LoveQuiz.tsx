import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Favorite, NavigateNext, Refresh } from '@mui/icons-material';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Replace these with your own questions about your relationship
const questions: Question[] = [
  {
    id: 1,
    question: "Where did we have our first date?",
    options: [
      "At the park",
      "At a restaurant",
      "At the movies",
      "At a coffee shop"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "What's my favorite food that you cook?",
    options: [
      "Pasta",
      "Pizza",
      "Steak",
      "Salad"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What's our song?",
    options: [
      "Perfect - Ed Sheeran",
      "All of Me - John Legend",
      "Just the Way You Are - Bruno Mars",
      "Can't Help Falling in Love - Elvis Presley"
    ],
    correctAnswer: 0
  },
  // Add more questions here
];

const LoveQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Love Quiz
        </Typography>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    mb: 2,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                {questions[currentQuestion].question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
                <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FormControlLabel
                        value={index}
                        control={<Radio />}
                        label={option}
                        sx={{
                          display: 'block',
                          my: 1,
                          p: 1,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255,105,180,0.1)',
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                endIcon={<NavigateNext />}
                onClick={handleNext}
                disabled={selectedAnswer === null}
                fullWidth
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <AnimatePresence>
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
                }}
              >
                <Favorite
                  sx={{
                    fontSize: 60,
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" gutterBottom color="primary">
                  Quiz Complete! 🎉
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Your Score: {score}/{questions.length}
                </Typography>
                <Typography variant="body1" paragraph>
                  {score === questions.length
                    ? "Perfect score! You know me so well! 💕"
                    : score >= questions.length / 2
                    ? "Great job! You know me pretty well! 💖"
                    : "Let's spend more time together and get to know each other better! 💝"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={resetQuiz}
                  sx={{ mt: 2 }}
                >
                  Try Again
                </Button>
              </Paper>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>
    </Container>
  );
};

export default LoveQuiz; 