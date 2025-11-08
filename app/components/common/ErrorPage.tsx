import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import AnimatedIllustration from './AnimatedIllustration';

interface ErrorPageProps {
  errorCode?: number;
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  illustrationType?: 'search' | 'broken' | 'empty';
  onRefresh?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode,
  title,
  subtitle,
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = false,
  illustrationType = 'search',
  onRefresh,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const getDefaultContent = () => {
    switch (errorCode) {
      case 404:
        return {
          title: 'صفحه یافت نشد',
          subtitle: 'متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.',
          illustrationType: 'search' as const,
        };
      case 500:
        return {
          title: 'خطای سرور',
          subtitle: 'متأسفانه خطای داخلی سرور رخ داده است. لطفاً دوباره تلاش کنید.',
          illustrationType: 'broken' as const,
        };
      case 403:
        return {
          title: 'دسترسی مجاز نیست',
          subtitle: 'شما مجوز دسترسی به این صفحه را ندارید.',
          illustrationType: 'empty' as const,
        };
      default:
        return {
          title: title || 'خطایی رخ داده است',
          subtitle: subtitle || 'متأسفانه مشکلی پیش آمده است.',
          illustrationType: illustrationType,
        };
    }
  };

  const content = getDefaultContent();
  const finalTitle = title || content.title;
  const finalSubtitle = subtitle || content.subtitle;
  const finalIllustrationType = illustrationType || content.illustrationType;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: 'calc(100vh - 200px)',
          justifyContent: 'center',
        }}
      >
        {/* Illustration */}
        <Box sx={{ mb: 4 }}>
          <AnimatedIllustration 
            size={120} 
            type={finalIllustrationType} 
          />
        </Box>

        {/* Error Code */}
        {errorCode && (
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Vazirmatn',
            }}
          >
            {errorCode.toLocaleString('fa-IR')}
          </Typography>
        )}

        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 2,
            fontFamily: 'Vazirmatn',
          }}
        >
          {finalTitle}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 500,
            lineHeight: 1.6,
            fontFamily: 'Vazirmatn',
          }}
        >
          {finalSubtitle}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
        >
          {showHomeButton && (
            <Button
              variant="contained"
              size="large"
              onClick={handleGoHome}
              startIcon={<HomeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontFamily: 'Vazirmatn',
                minWidth: 150,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
              }}
            >
              بازگشت به خانه
            </Button>
          )}

          {showRefreshButton && (
            <Button
              variant="outlined"
              size="large"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontFamily: 'Vazirmatn',
                minWidth: 150,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
                transition: 'all 0.3s ease',
              }}
            >
              تلاش مجدد
            </Button>
          )}

          {showBackButton && (
            <Button
              variant="text"
              size="large"
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontFamily: 'Vazirmatn',
                minWidth: 150,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              بازگشت
            </Button>
          )}
        </Box>

        {/* Additional Help Text */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 4,
            opacity: 0.7,
            fontFamily: 'Vazirmatn',
          }}
        >
          در صورت تکرار این خطا، لطفاً با پشتیبانی تماس بگیرید.
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;