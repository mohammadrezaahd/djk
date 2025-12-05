import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
  Rating,
} from "@mui/material";
import { QuoteIcon } from "../icons/IconComponents";
const TestimonialsSection: React.FC = () => {
  const theme = useTheme();

  const testimonials = [
    {
      id: 1,
      name: "علی احمدی",
      role: "فروشنده لوازم جانبی موبایل",
      avatar: "/avatars/user1.png",
      rating: 5,
      text: "قبل از هوش مارکت، ساخت ۵۰ محصول برام کابوس بود. الان تو یه ساعت ۳۰۰ تا می‌سازم!",
      gradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
    },
    {
      id: 2,
      name: "مریم کریمی",
      role: "فروشنده پوشاک زنانه",
      avatar: "/avatars/user2.png",
      rating: 5,
      text: "عنوان‌ها و توضیحاتش دقیقاً همونیه که باعث میشه محصولم بالا بیاد.",
      gradient: "linear-gradient(135deg, #00CEC9, #55E6C1)",
    },
    {
      id: 3,
      name: "محمد رضایی",
      role: "فروشنده لوازم خانگی",
      avatar: "/avatars/user3.png",
      rating: 5,
      text: "واقعاً خیلی راحت شده کارم. الان فقط روی فروش متمرکزم، نه وارد کردن محصولات.",
      gradient: "linear-gradient(135deg, #FDA7DC, #F093FB)",
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
      {/* پترن پس‌زمینه */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          background: `
            radial-gradient(circle at 20% 30%, ${theme.palette.primary.main} 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main} 0%, transparent 60%)
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
            تجربه‌ی کاربران
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
            کاربران ما چه می‌گویند؟
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
            تجربه‌ی واقعی فروشندگان موفق در دیجی‌کالا با استفاده از هوش مارکت
          </Typography>
        </Box>

        {/* کارت‌های نظرات */}
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "none",
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    "& .quote-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                    },
                    "& .testimonial-gradient": {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* گرادیانت بالا */}
                <Box
                  className="testimonial-gradient"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: testimonial.gradient,
                    opacity: 0.7,
                    transition: "opacity 0.3s ease",
                  }}
                />

                <CardContent
                  sx={{
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* آیکون نقل قول */}
                  <Box
                    className="quote-icon"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: testimonial.gradient,
                      color: "white",
                      mb: 3,
                      transition: "transform 0.3s ease",
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <QuoteIcon style={{ fontSize: "1.8rem" }} />
                  </Box>

                  {/* امتیاز */}
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{
                      mb: 2,
                      "& .MuiRating-iconFilled": {
                        color: "#FDCB6E",
                      },
                    }}
                  />

                  {/* متن نظر */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      lineHeight: 1.7,
                      fontSize: "1.1rem",
                      mb: 3,
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>

                  {/* اطلاعات کاربر */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: 50,
                        height: 50,
                        background: testimonial.gradient,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: "1rem",
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* بخش آمار اعتماد */}
        <Box
          sx={{
            mt: 12,
            p: 8,
            borderRadius: 4,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.background.paper, 0.8)} 0%, 
              ${alpha(theme.palette.background.paper, 0.9)} 100%
            )`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            ۹۸٪ رضایت کاربران
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1.2rem",
              mb: 4,
            }}
          >
            بیش از ۱۰ هزار فروشنده موفق به ما اعتماد کرده‌اند
          </Typography>

          {/* آمار کوتاه */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                ۱۰K+
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                کاربر راضی
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.secondary.main,
                  mb: 1,
                }}
              >
                ۵۰۰K+
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                محصول ایجاد شده
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#00B894",
                  mb: 1,
                }}
              >
                ۲۴/۷
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                پشتیبانی
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
