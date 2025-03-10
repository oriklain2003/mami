import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4', // Pink
      light: '#FFA6D5',
      dark: '#D4478B',
    },
    secondary: {
      main: '#9C27B0', // Purple
      light: '#BA68C8',
      dark: '#7B1FA2',
    },
    background: {
      default: '#FFF0F5', // Lavender blush
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
      color: '#FF69B4',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#9C27B0',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
}); 