import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import { Link } from "react-router";
import { RocketIcon, AiIcon, TrendUpIcon } from "../icons/IconComponents";
const CTASection: React.FC = () => {
  const theme = useTheme();

  const benefits = [
    "رایگان شروع کن",
    "بدون نیاز به کارت اعتباری",
    "پشتیبانی ۲۴/۷",
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main} 0%, 
          ${alpha(theme.palette.primary.dark, 0.9)} 50%,
          ${theme.palette.secondary.main} 100%
        )`,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* پترن‌های پس‌زمینه */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: alpha("#ffffff", 0.1),
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: alpha("#ffffff", 0.05),
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "20%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: alpha("#ffffff", 0.1),
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* انیمیشن‌ها */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 0.9; }
          }
        `}
      </style>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            {/* محتوای اصلی */}
            <Box>
              {/* بج */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: alpha("#ffffff", 0.2),
                  color: "white",
                  px: 3,
                  py: 1,
                  borderRadius: 10,
                  mb: 4,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  backdropFilter: "blur(10px)",
                }}
              >
                <AiIcon style={{ fontSize: 16 }} />
                آماده‌ای هوشمندتر بفروشی؟
              </Box>

              {/* عنوان اصلی */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3rem" },
                  lineHeight: 1.2,
                }}
              >
                ساخت محصول در دیجی‌کالا هیچ‌وقت این‌قدر ساده نبوده
              </Typography>

              {/* توضیحات */}
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontSize: "1.25rem",
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                همین الان شروع کن و اولین محصولاتت رو با کمک هوش مصنوعی بساز
              </Typography>

              {/* فهرست مزایا */}
              <Box sx={{ mb: 6 }}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: alpha("#ffffff", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✓
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      }}
                    >
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* دکمه‌های عمل */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: { xs: "stretch", md: "center" },
              }}
            >
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                size="large"
                startIcon={<RocketIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  color: theme.palette.primary.main,
                  borderRadius: 3,
                  px: 6,
                  py: 3,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  boxShadow: `0 12px 40px ${alpha("#ffffff", 0.3)}`,
                  border: `2px solid ${alpha("#ffffff", 0.2)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                    boxShadow: `0 20px 60px ${alpha("#ffffff", 0.4)}`,
                    transform: "translateY(-3px) scale(1.02)",
                  },
                }}
              >
                شروع رایگان
              </Button>

              <Button
                component={Link}
                to="/demo"
                variant="outlined"
                size="large"
                startIcon={<TrendUpIcon />}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderColor: alpha("#ffffff", 0.3),
                  color: "white",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    backgroundColor: alpha("#ffffff", 0.1),
                    borderColor: alpha("#ffffff", 0.5),
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 30px ${alpha("#ffffff", 0.2)}`,
                  },
                }}
              >
                مشاهده دمو
              </Button>

              {/* متن تشویقی کوچک */}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  opacity: 0.8,
                  fontSize: "0.875rem",
                  mt: 2,
                }}
              >
                🚀 بیش از ۱۰ هزار کاربر راضی
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* آمار سریع */}
        <Box
          sx={{
            mt: 10,
            p: 6,
            borderRadius: 4,
            background: alpha("#ffffff", 0.1),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha("#ffffff", 0.2)}`,
          }}
        >
          <Grid container spacing={4} textAlign="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                ۵ دقیقه
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                زمان راه‌اندازی
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                ۱۰۰۰+
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                محصول در ساعت
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                ۹۸٪
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                دقت هوش مصنوعی
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
