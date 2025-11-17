/**
 * UXercise MUI Dark Theme
 * A dark-only, mobile-first theme with fox-fur orange accent
 * Designed for accessibility (WCAG 2.1 AA compliant) and motivational UX
 */

import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Color palette constants
const FOX_FUR_ORANGE = '#E25822'; // Primary brand color - fox-fur orange
const VERY_DARK_BG = '#050608'; // Background default - almost black
const DARK_PAPER = '#0E1117'; // Background paper - slightly lighter
const OFF_WHITE = '#E8E8E8'; // Text primary - high contrast off-white
const MUTED_GRAY = '#9E9E9E'; // Text secondary - muted gray
const ERROR_RED = '#F44336';
const WARNING_AMBER = '#FFA726';
const SUCCESS_GREEN = '#66BB6A';
const INFO_BLUE = '#42A5F5';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: FOX_FUR_ORANGE,
      light: '#FF7043', // Slightly brighter for hover states
      dark: '#BF360C', // Darker variant
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#424242', // Neutral gray for secondary actions
      light: '#6D6D6D',
      dark: '#1B1B1B',
      contrastText: OFF_WHITE,
    },
    error: {
      main: ERROR_RED,
    },
    warning: {
      main: WARNING_AMBER,
    },
    success: {
      main: SUCCESS_GREEN,
    },
    info: {
      main: INFO_BLUE,
    },
    background: {
      default: VERY_DARK_BG,
      paper: DARK_PAPER,
    },
    text: {
      primary: OFF_WHITE,
      secondary: MUTED_GRAY,
      disabled: '#616161',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none', // No uppercase for buttons (more modern look)
      letterSpacing: '0.02857em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08333em',
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for cards and components
  },
  spacing: 8, // Default MUI spacing unit
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${MUTED_GRAY} ${VERY_DARK_BG}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: MUTED_GRAY,
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: VERY_DARK_BG,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          // Ensure visible focus outline for accessibility
          '&:focus-visible': {
            outline: `2px solid ${FOX_FUR_ORANGE}`,
            outlineOffset: 2,
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 8px rgba(226, 88, 34, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          backgroundImage: 'none', // Remove MUI's default gradient on dark mode
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        },
        elevation3: {
          boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            // Visible focus state
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: FOX_FUR_ORANGE,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Ensure accessible focus state
          '&:focus-visible': {
            outline: `2px solid ${FOX_FUR_ORANGE}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&:focus-visible': {
            outline: `2px solid ${FOX_FUR_ORANGE}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${FOX_FUR_ORANGE}`,
            outlineOffset: 2,
            borderRadius: 4,
          },
        },
      },
    },
  },
};

export const uxerciseTheme = createTheme(themeOptions);
