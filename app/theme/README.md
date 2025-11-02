# سیستم تم پروژه

این پروژه از سیستم تم Material-UI با پشتیبانی RTL و فونت فارسی استفاده می‌کند.

## ساختار فایل‌ها

```
app/theme/
├── theme.ts          # تعریف تم اصلی با تنظیمات رنگ و RTL
├── ThemeProvider.tsx # کامپ-وننت ارائه‌دهنده تم
└── index.ts          # فایل export اصلی
```

## ویژگی‌های تم

### RTL Support
- پشتیبانی کامل از راست به چپ
- استفاده از `stylis-plugin-rtl` برای تبدیل خودکار CSS
- تنظیم `direction: 'rtl'` در تم

### فونت فارسی
- فونت اصلی: `YekanBakh`
- fallback فونت‌ها: `Arial`, `sans-serif`

### پالت رنگی
- **Primary**: `#6C5CE7`
- **Secondary**: `#00CEC9`
- **Accent**: `#FDA7DC`
- **Background**: `#F8F9FB`
- **Surface**: `#FFFFFF`
- **Text Primary**: `#2D3436`
- **Text Secondary**: `#636E72`
- **Success**: `#00B894`
- **Warning**: `#FDCB6E`
- **Error**: `#D63031`
- **Info**: `#0984E3`
- **Gradient**: `linear-gradient(135deg, #6C5CE7, #A29BFE)`

### تنظیمات Typography
- `textTransform: 'none'` برای دکمه‌ها (حذف حروف بزرگ خودکار)
- اندازه‌های مختلف برای h1 تا h6
- line-height و font-weight مناسب برای متن‌های فارسی

### کامپوننت‌های سفارشی شده
- **Button**: `borderRadius: 12px`, `textTransform: 'none'`
- **Card**: `borderRadius: 12px`
- **TextField**: `borderRadius: 12px`
- **Select**: `borderRadius: 12px`
- **ListItemButton**: استایل خاص برای آیتم‌های انتخاب شده
- **CssBaseline**: تنظیمات پایه برای RTL

## نحوه استفاده

### ۱. در کامپوننت‌ها:
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

### ۲. دسترسی به رنگ‌ها:
```tsx
// استفاده از palette
sx={{ color: 'primary.main' }}
sx={{ backgroundColor: 'background.paper' }}
sx={{ color: 'text.secondary' }}
```

### ۳. responsive breakpoints:
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
