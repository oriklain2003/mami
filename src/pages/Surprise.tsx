import React, { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Favorite } from '@mui/icons-material';
import Confetti from 'react-confetti';
import PasswordProtection from '../components/PasswordProtection';

const Surprise: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const letterContent = {
    greeting: "My Baby Mami",
    paragraphs: [
      "אני יודע שזה קצת באיחור אבל חשוב לי שתדעי כמה אני אוהב אותך.",
      "כל יום אני חושב עלייך ואיך אני יכול לעשות אותך שמחה גם כשאני שוכח לכתוב בוקר טוב, בדקות הפנויות שיש לי ביום אני מתגעגע אלייך ומתכנן את השבוע שלנו ביחד ורק חושב מתי אני אספיק לישון איתך ולהירגע ביחד איתך.",
      "אני אוהב אותך בגלל מלא סיבות, כי את מכילה אותי, כי את מקשיבה לי בצורה הכי אמיתית שפגשתי, כי את אמיתית ותמיד נוכחת, כי את מקסימה כל מי שאת פוגשת, כי לקח לי פחות מ5 שניות להתאהב בעיניים הנוצצות שלך(כנראה הן נצצו בגלל שישבת מתחת לתאורה אבל עדיין).",
      "את חלק גדול מהחיים שלי ועברתי איתך שינוי שלא ידעתי שאני יכול לעבור ו״קפצתי איתך למים״ שפחדתי לקפוץ אליהם לבד."
    ],
    closing: "❤️אני אוהב אותך מאמי עד לירח ובחזרה",
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              textAlign: 'center',
              background: 'linear-gradient(45deg, #FF69B4, #9C27B0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            A Special Surprise
          </Typography>
        </motion.div>

        {!isUnlocked ? (
          <PasswordProtection onCorrectPassword={handleUnlock} />
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: 600,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    color="primary"
                    gutterBottom
                    sx={{ textAlign: 'center', mb: 3 }}
                  >
                    {letterContent.greeting}
                  </Typography>

                  {letterContent.paragraphs.map((paragraph, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{
                          lineHeight: 1.8,
                          textAlign: 'right',
                          mb: 2,
                          direction: 'rtl'
                        }}
                      >
                        {paragraph}
                      </Typography>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: 'right',
                        mt: 4,
                        color: 'primary.main'
                      }}
                    >
                      {letterContent.closing}
                    </Typography>
                  </motion.div>
                </motion.div>

                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    transform: 'rotate(45deg)',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Favorite
                      sx={{
                        fontSize: 60,
                        color: 'rgba(255,105,180,0.2)'
                      }}
                    />
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>
    </Container>
  );
};

export default Surprise; 