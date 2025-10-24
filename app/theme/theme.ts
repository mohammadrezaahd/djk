import { createTheme } from '@mui/material/styles';

// تعریف رنگ‌های پیش‌فرض
const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// تنظیمات typography با فونت فارسی
const typography = {
  fontFamily: [
    'Vazirmatn',
    'Roboto',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.125rem',
    fontWeight: 300,
    lineHeight: 1.167,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.167,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.235,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.334,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    textTransform: 'uppercase' as const,
  },
};

// تنظیمات spacing
const spacing = 8;

// تنظیمات shape (گوشه‌ها)
const shape = {
  borderRadius: 8,
};

// تنظیمات breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// ایجاد theme اصلی
export const theme = createTheme({
  direction: 'rtl',
  palette,
  typography,
  spacing,
  shape,
  breakpoints,
  components: {
    // تنظیمات کامپوننت‌ها
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          direction: 'rtl',
        },
        body: {
          direction: 'rtl',
          fontFamily: typography.fontFamily,
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          elevation: 2,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
            '& .MuiListItemIcon-root': {
              color: palette.primary.contrastText,
            },
          },
        },
      },
    },
  },
});

export default theme;