# سیستم تم پروژه

این پروژه از سیستم تم Material-UI با پشتیبانی RTL و فونت فارسی استفاده می‌کند.

## ساختار فایل‌ها

```
app/theme/
├── theme.ts          # تعریف تم اصلی با تنظیمات رنگ و RTL
├── ThemeProvider.tsx # کامپوننت ارائه‌دهنده تم
└── index.ts          # فایل export اصلی
```

## ویژگی‌های تم

### RTL Support
- پشتیبانی کامل از راست به چپ
- استفاده از `stylis-plugin-rtl` برای تبدیل خودکار CSS
- تنظیم `direction: 'rtl'` در تم

### فونت فارسی
- فونت اصلی: `Vazirmatn` از Google Fonts
- fallback فونت‌ها: `Roboto`, `Arial`, `sans-serif`

### رنگ‌های پیش‌فرض
- **Primary**: `#1976d2` (آبی Material)
- **Secondary**: `#9c27b0` (بنفش Material)
- **Background**: `#fafafa` (خاکستری روشن)
- **Paper**: `#ffffff` (سفید)

### تنظیمات Typography
- `textTransform: 'none'` برای دکمه‌ها (حذف حروف بزرگ خودکار)
- اندازه‌های مختلف برای h1 تا h6
- line-height و font-weight مناسب برای متن‌های فارسی

### کامپوننت‌های سفارشی شده
- **Button**: `borderRadius: 8px`, `textTransform: 'none'`
- **Card**: `borderRadius: 8px`
- **ListItemButton**: استایل خاص برای آیتم‌های انتخاب شده
- **CssBaseline**: تنظیمات پایه برای RTL

## نحوه استفاده

### 1. در کامپوننت‌ها:
```tsx
import { useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary 
    }}>
      محتوا
    </Box>
  );
};
```

### 2. دسترسی به رنگ‌ها:
```tsx
// استفاده از palette
sx={{ color: 'primary.main' }}
sx={{ backgroundColor: 'background.paper' }}
sx={{ color: 'text.secondary' }}
```

### 3. responsive breakpoints:
```tsx
sx={{ 
  display: { xs: 'block', sm: 'none' },
  width: { sm: '280px', md: '320px' }
}}
```

## تنظیمات اضافی

برای اضافه کردن رنگ‌های جدید، فایل `theme.ts` را ویرایش کنید:

```ts
const palette = {
  // رنگ‌های موجود...
  custom: {
    main: '#ff5722',
    light: '#ff8a65',
    dark: '#d84315',
  }
};
```

## نصب وابستگی‌ها

```bash
npm install stylis-plugin-rtl
```

وابستگی‌های موجود:
- `@mui/material`
- `@mui/icons-material` 
- `@emotion/react`
- `@emotion/styled`