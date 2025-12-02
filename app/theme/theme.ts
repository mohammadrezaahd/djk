import { createTheme } from "@mui/material/styles";

// تعریف رنگ‌های پیش‌فرض
const palette = {
  primary: {
    main: "#6C5CE7",
    light: "#A29BFE",
    dark: "#4C3BCF",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#00CEC9",
    contrastText: "#2D3436",
  },
  accent: {
    main: "#FDA7DC",
  },
  error: {
    main: "#D63031",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#FDCB6E",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0984E3",
    contrastText: "#ffffff",
  },
  success: {
    main: "#00B894",
    contrastText: "#ffffff",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  background: {
    default: "#F8F9FB",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#2D3436",
    secondary: "#636E72",
    disabled: "#919EAB",
  },
  gradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
};

// تنظیمات typography با فونت یکان بخ
const typography = {
  fontFamily: ["YekanBakhFaNum", "YekanBakh", "Arial", "sans-serif"].join(","),
  h1: {
    fontSize: "2.125rem",
    fontWeight: 300,
    lineHeight: 1.167,
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: 400,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: "1.25rem",
    fontWeight: 400,
    lineHeight: 1.167,
  },
  h4: {
    fontSize: "1.125rem",
    fontWeight: 400,
    lineHeight: 1.235,
  },
  h5: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.334,
  },
  h6: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.43,
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: "none" as const,
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.66,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 2.66,
    textTransform: "uppercase" as const,
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
  direction: "rtl",
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
          direction: "rtl",
        },
        body: {
          direction: "rtl",
          fontFamily: typography.fontFamily,
        },
        "*": {
          boxSizing: "border-box",
          // مخفی کردن scrollbar برای تمام المنت‌ها
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&": {
            msOverflowStyle: "none", // IE and Edge
            scrollbarWidth: "none", // Firefox
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // کاهش از shape.borderRadius به 8
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          boxShadow: `0 8px 16px 0 rgba(0,0,0,0.24)`,
        },
        containedSecondary: {
          backgroundColor: palette.grey[300],
          color: palette.text.primary,
          "&:hover": {
            backgroundColor: palette.grey[400],
          },
        },
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

    MuiPaper: {
      styleOverrides: {
        root: {
          // حداکثر radius برای جلوگیری از گرد شدن بیش از حد
          '&.MuiMenu-paper, &.MuiSelect-paper, &.MuiPopover-paper': {
            borderRadius: '6px !important',
            maxHeight: 240,
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: palette.background.paper,
        },
      },
      defaultProps: {
        MenuProps: {
          disablePortal: false,
          PaperProps: {
            sx: {
              borderRadius: 6, // تطبیق با borderRadius فیلدها
              boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
              mt: 1,
              maxHeight: 240,
              '&.MuiPaper-root': {
                borderRadius: '6px !important', // اجبار به استفاده از radius مشخص
              }
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
                backgroundColor: "transparent",
              },
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6, // کاهش از shape.borderRadius / 2 به 6
          margin: "2px 8px",
          "&:hover": {
            backgroundColor: palette.grey[100],
          },
          "&.Mui-selected": {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '6px !important',
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
          maxHeight: 240,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          '&[role="listbox"], &[role="menu"]': {
            borderRadius: '6px !important',
            maxHeight: 240,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6, // کاهش از shape.borderRadius / 1.5 به 6
          backgroundColor: palette.grey[200],
          padding: "4px 8px", // اضافه کردن padding مناسب
          height: "auto", // حذف محدودیت ارتفاع
        },
        label: {
          padding: "2px 4px", // افزودن padding برای label
          fontSize: "0.75rem", // اندازه فونت مناسب
          lineHeight: 1.2,
        },
        icon: {
          margin: "0 4px 0 -4px", // فاصله مناسب برای آیکن
          fontSize: "0.875rem",
        },
        sizeSmall: {
          height: 24,
          fontSize: "0.6875rem",
          "& .MuiChip-label": {
            padding: "0 4px",
          },
          "& .MuiChip-icon": {
            margin: "0 2px 0 -2px",
            fontSize: "0.75rem",
          },
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
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
            "& .MuiListItemIcon-root": {
              color: palette.primary.contrastText,
            },
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "&.MuiModal-root": {
            zIndex: 1300,
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          "&.MuiSelect-backdrop": {
            backgroundColor: "transparent",
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
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          direction: "rtl",
          "& .MuiAutocomplete-endAdornment": {
            left: 8,
            right: "auto",
            top: "50%",
            transform: "translateY(-50%) scaleX(-1)",
          },
        },
        inputRoot: {
          "&.MuiOutlinedInput-root": {
            cursor: "pointer",
          },
        },
        input: {
          cursor: "pointer",
        },
      },
      defaultProps: {
        openOnFocus: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          direction: "rtl",
          "& .MuiInputLabel-root": {
            right: 30,
            left: "auto",
            transformOrigin: "right top",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(15px, -9px) scale(0.75)",
          },
          "& .MuiOutlinedInput-root": {
            direction: "rtl",
            borderRadius: 8, // کاهش از shape.borderRadius به 8
            backgroundColor: palette.background.paper,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.grey[300],
              textAlign: "right",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.grey[500],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.primary.main,
              borderWidth: 2,
            },
            "& legend": {
              textAlign: "right",
            },
          },
          "& input": {
            textAlign: "right",
          },
        },
      },
    },
  },
});

export default theme;
