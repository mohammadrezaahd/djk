import { createTheme } from '@mui/material/styles';

// تعریف رنگ‌های پیش‌فرض
const palette = {
  primary: {
    main: '#212B36',
    light: '#454F5B',
    dark: '#161C24',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#919EAB',
    light: '#C4CDD5',
    dark: '#637381',
    contrastText: '#212B36',
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
    default: '#F4F6F8',
    paper: '#ffffff',
  },
  text: {
    primary: '#212B36',
    secondary: '#637381',
    disabled: '#919EAB',
  },
};

// تنظیمات typography با فونت یکان بخ
const typography = {
  fontFamily: [
    'YekanBakh',
    'YekanBakhFaNum',
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
  borderRadius: 12,
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
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
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
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        },
        containedPrimary: {
          boxShadow: `0 8px 16px 0 rgba(0,0,0,0.24)`,
        },
        containedSecondary: {
            backgroundColor: palette.grey[300],
            color: palette.text.primary,
            '&:hover': {
                backgroundColor: palette.grey[400],
            }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: shape.borderRadius,
                    backgroundColor: palette.background.paper,
                }
            }
        }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          backgroundColor: palette.background.paper,
        },
      },
      defaultProps: {
        MenuProps: {
          disablePortal: false,
          PaperProps: {
            sx: {
              borderRadius: shape.borderRadius,
              boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
              mt: 1,
              maxHeight: 240,
            },
          },
          MenuListProps: {
            sx: {
              py: 1,
            },
          },
          slotProps: {
            backdrop: {
              sx: {
                backgroundColor: 'transparent',
              },
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius / 2,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: palette.grey[100],
          },
          '&.Mui-selected': {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
          },
        },
      },
    },
    MuiAutocomplete: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    padding: '9px',
                }
            },
            paper: {
                borderRadius: shape.borderRadius,
                boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius / 1.5,
                backgroundColor: palette.grey[200],
            }
        }
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
    MuiModal: {
      styleOverrides: {
        root: {
          '&.MuiModal-root': {
            zIndex: 1300,
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          '&.MuiSelect-backdrop': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          zIndex: 1400,
        },
      },
    },
  },
});

export default theme;