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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useMediaQuery,
} from "@mui/material";

import {
  LoginIcon,
  SettingsIcon,
  CloudUploadIcon,
  CircleCheckIcon,
} from "../icons/IconComponents";

const HowItWorksSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const steps = [
    {
      id: 1,
      icon: <LoginIcon />,
      title: "وارد پنل هوش مارکت شو",
      description:
        "با چند کلیک ساده وارد پنل کاربری شده و سفر خود را آغاز کنید",
      color: "#6C5CE7",
    },
    {
      id: 2,
      icon: <CloudUploadIcon />,
      title: "فایل محصولاتت رو آپلود کن یا لینک بده",
      description:
        "فایل‌های CSV، Excel را آپلود کنید یا لینک محصولات از وب‌سایت‌ها را وارد کنید",
      color: "#00CEC9",
    },
    {
      id: 3,
      icon: <SettingsIcon />,
      title: "تنظیمات دلخواهت رو انتخاب کن",
      description:
        "قوانین سئو، قالب‌بندی و سایر تنظیمات را مطابق نیاز خود پیکربندی کنید",
      color: "#FDA7DC",
    },
    {
      id: 4,
      icon: <CircleCheckIcon />,
      title: "محصولت آماده‌ی انتشار در دیجی‌کالاست!",
      description:
        "محصولات شما با کیفیت بالا و بهینه‌سازی شده آماده انتشار هستند",
      color: "#00B894",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      {/* پترن پس‌زمینه */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `
            radial-gradient(circle at 10% 20%, ${theme.palette.primary.main} 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, ${theme.palette.secondary.main} 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
            راهنمای استفاده
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
            چگونه کار می‌کند؟
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
            در چهار مرحله ساده، محصولات خود را آماده فروش در دیجی‌کالا کنید
          </Typography>
        </Box>

        {/* مراحل - نمایش کارتی در موبایل */}
        {isMobile ? (
          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12 }} key={step.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(step.color, 0.1)}`,
                    border: `2px solid ${alpha(step.color, 0.1)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 8px 30px ${alpha(step.color, 0.2)}`,
                      borderColor: alpha(step.color, 0.3),
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={3}>
                      {/* شماره مرحله */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          backgroundColor: step.color,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {step.id}
                      </Box>

                      <Box flex={1}>
                        {/* عنوان */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {step.title}
                        </Typography>

                        {/* توضیحات */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>

                      {/* آیکون */}
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          backgroundColor: alpha(step.color, 0.1),
                          color: step.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* مراحل - نمایش Stepper در دسکتاپ */
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Stepper
              orientation="vertical"
              sx={{
                "& .MuiStepContent-root": {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={step.id} active={true}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          backgroundColor: step.color,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          boxShadow: `0 4px 15px ${alpha(step.color, 0.3)}`,
                        }}
                      >
                        {step.id}
                      </Box>
                    )}
                    sx={{
                      "& .MuiStepLabel-labelContainer": {
                        mr: 3,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {step.title}
                    </Typography>
                  </StepLabel>
                  <StepContent sx={{ pr: 8, pb: 6 }}>
                    <Box
                      sx={{
                        backgroundColor: alpha(step.color, 0.05),
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${alpha(step.color, 0.1)}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          backgroundColor: alpha(step.color, 0.2),
                          color: step.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                          fontSize: "1.1rem",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* باکس تشویقی */}
        <Box
          sx={{
            mt: 10,
            p: 6,
            borderRadius: 4,
            background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* پترن پس‌زمینه */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: alpha("#ffffff", 0.1),
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -80,
              left: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              backgroundColor: alpha("#ffffff", 0.05),
            }}
          />

          <Box position="relative" zIndex={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              همین الان شروع کن!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 0,
                opacity: 0.9,
              }}
            >
              فقط چند دقیقه تا داشتن محصولات آماده فروش فاصله داری
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
