import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
} from "@mui/material";

import {
  SearchIcon,
  SpeedIcon,
  GridIcon,
  CloudUploadIcon,
} from "../icons/IconComponents";

const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      id: 1,
      icon: <SpeedIcon />,
      title: "ساخت خودکار و سریع محصول",
      description:
        "کافیه اطلاعات پایه رو وارد کنی، باقی کارها رو هوش مصنوعی انجام می‌ده.",
      gradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
    },
    {
      id: 2,
      icon: <SearchIcon />,
      title: "بهینه‌سازی سئو با AI",
      description:
        "عنوان و توضیحات محصولاتت به‌صورت خودکار برای فروش بیشتر تنظیم می‌شن.",
      gradient: "linear-gradient(135deg, #00CEC9, #55E6C1)",
    },
    {
      id: 3,
      icon: <CloudUploadIcon />,
      title: "ساخت از سورس‌های مختلف",
      description:
        "از CSV، سایت‌ها یا API محصولاتت رو وارد کن و هوش مارکت اون‌ها رو آماده انتشار می‌کنه.",
      gradient: "linear-gradient(135deg, #FDA7DC, #F093FB)",
    },
    {
      id: 4,
      icon: <GridIcon />,
      title: "مدیریت و ساخت انبوه",
      description: "هزاران محصول رو در چند دقیقه بساز، بدون تکرار و خطا.",
      gradient: "linear-gradient(135deg, #FDCB6E, #F7B801)",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.default,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* عنوان بخش */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            ویژگی‌های اصلی
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: theme.palette.text.primary,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            چرا هوش مارکت؟
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            با قدرت هوش مصنوعی، فرآیند ساخت محصول را ساده‌تر و سریع‌تر از همیشه
            تجربه کنید
          </Typography>
        </Box>

        {/* کارت‌های ویژگی */}
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={feature.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "none",
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    "& .feature-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                    },
                    "& .feature-gradient": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* گرادیانت پس‌زمینه */}
                <Box
                  className="feature-gradient"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: feature.gradient,
                    opacity: 0.7,
                    transition: "opacity 0.3s ease",
                  }}
                />

                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  {/* آیکون */}
                  <Box
                    className="feature-icon"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: feature.gradient,
                      color: "white",
                      mb: 3,
                      fontSize: "2rem",
                      transition: "transform 0.3s ease",
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  {/* عنوان */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.text.primary,
                      fontSize: "1.1rem",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* توضیحات */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* قسمت اضافی - آمار کوتاه */}
        <Box
          sx={{
            mt: 12,
            p: 6,
            borderRadius: 4,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.05)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.05)} 100%
            )`,
            textAlign: "center",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            ۹۸٪ از کاربران ما راضی هستند
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1.1rem",
            }}
          >
            بیش از ۱۰ هزار کاربر فعال و نیم میلیون محصول ایجاد شده
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
