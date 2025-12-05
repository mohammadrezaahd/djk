import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  alpha,
  Paper,
  Chip,
} from "@mui/material";

import {
  HomeIcon,
  AngleLeftIcon,
  BlockIcon,
  RefreshIcon,
  WarningIcon,
  ErrorIcon,
} from "../icons/IconComponents";

import { useNavigate } from "react-router";

interface ErrorPageProps {
  errorCode?: number;
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode,
  title,
  subtitle,
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = false,
  onRefresh,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate("/");
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
          title: "صفحه یافت نشد",
          subtitle:
            "متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.",
          icon: <ErrorIcon style={{ fontSize: 80, color: "white" }} />,
          color: theme.palette.warning.main,
          badge: "خطای 404",
        };
      case 500:
        return {
          title: "خطای سرور",
          subtitle:
            "متأسفانه خطای داخلی سرور رخ داده است. لطفاً دوباره تلاش کنید.",
          icon: <WarningIcon style={{ fontSize: 80, color: "white" }} />,
          color: theme.palette.error.main,
          badge: "خطای 500",
        };
      case 403:
        return {
          title: "دسترسی مجاز نیست",
          subtitle: "شما مجوز دسترسی به این صفحه را ندارید.",
          icon: <BlockIcon style={{ fontSize: 80, color: "white" }} />,
          color: theme.palette.error.main,
          badge: "خطای 403",
        };
      default:
        return {
          title: title || "خطایی رخ داده است",
          subtitle:
            subtitle || "متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.",
          icon: <ErrorIcon style={{ fontSize: 80, color: "white" }} />,
          color: theme.palette.error.main,
          badge: "خطا",
        };
    }
  };

  const content = getDefaultContent();
  const finalTitle = title || content.title;
  const finalSubtitle = subtitle || content.subtitle;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(content.color, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "600px",
          height: "600px",
          background: alpha(content.color, 0.08),
          borderRadius: "50%",
          top: "-300px",
          right: "-300px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background: alpha(content.color, 0.05),
          borderRadius: "50%",
          bottom: "-200px",
          left: "-200px",
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={12}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(content.color, 0.1)}`,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${content.color} 0%, ${alpha(content.color, 0.7)} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
              boxShadow: `0 8px 32px ${alpha(content.color, 0.3)}`,
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": {
                  transform: "translateY(0px)",
                },
                "50%": {
                  transform: "translateY(-20px)",
                },
              },
            }}
          >
            {content.icon}
          </Box>

          {/* Badge */}
          <Chip
            label={content.badge}
            sx={{
              mb: 3,
              fontWeight: "bold",
              fontSize: "0.9rem",
              px: 2,
              backgroundColor: alpha(content.color, 0.1),
              color: content.color,
              border: `2px solid ${alpha(content.color, 0.3)}`,
            }}
          />

          {/* Error Code */}
          {errorCode && (
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "5rem", md: "7rem" },
                fontWeight: "bold",
                mb: 2,
                background: `linear-gradient(135deg, ${content.color} 0%, ${alpha(content.color, 0.6)} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}
            >
              {errorCode.toLocaleString("fa-IR")}
            </Typography>
          )}

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
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
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            {finalSubtitle}
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: "50%",
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${alpha(content.color, 0.3)}, transparent)`,
              margin: "0 auto",
              mb: 4,
            }}
          />

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
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
                  minWidth: 180,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                  transition: "all 0.3s ease",
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
                  minWidth: 180,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderWidth: 2,
                  borderColor: content.color,
                  color: content.color,
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-3px)",
                    backgroundColor: alpha(content.color, 0.08),
                    borderColor: content.color,
                  },
                  transition: "all 0.3s ease",
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
                startIcon={<AngleLeftIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.action.hover, 0.8),
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                بازگشت به عقب
              </Button>
            )}
          </Box>

          {/* Help Box */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              💡 در صورت تکرار این خطا، لطفاً با پشتیبانی تماس بگیرید یا صفحه را
              رفرش کنید.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorPage;
