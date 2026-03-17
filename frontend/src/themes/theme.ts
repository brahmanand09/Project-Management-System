import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#94817f', // Muted rose-brown
      light: '#a9aaab',
      dark: '#644d4d',
    },
    secondary: {
      main: '#a9aaab', // Silver gray
      light: '#c5c6c7',
      dark: '#8b8c8d',
    },
    background: {
      default: '#223437', // Deep teal-gray
      paper: '#434142', // Charcoal
    },
    text: {
      primary: '#a9aaab',
      secondary: '#94817f',
    },
    error: {
      main: '#d4756e',
    },
    warning: {
      main: '#d4a373',
    },
    divider: '#644d4d',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", sans-serif',
    h3: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '12px 28px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #94817f 0%, #644d4d 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #a9958f 0%, #75605f 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          backgroundImage: 'none',
          border: '1px solid rgba(169, 170, 171, 0.1)',
        },
        elevation6: {
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
        },
        elevation8: {
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(169, 170, 171, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(169, 170, 171, 0.08)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#94817f',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(169, 170, 171, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#a9aaab',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#a9aaab',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #434142 0%, #223437 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: '8px',
          '&:hover': {
            backgroundColor: 'rgba(169, 170, 171, 0.08)',
          },
        },
      },
    },
  },
});

export default theme;