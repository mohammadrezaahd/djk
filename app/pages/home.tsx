import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  alpha,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Rating,
  Divider,
} from "@mui/material";
import { Link } from "react-router";

import {
  SpeedIcon,
  SearchIcon,
  AiIcon,
  RocketIcon,
  CloudUploadIcon,
  GridIcon,
  LoginIcon,
  CircleCheckIcon,
  QuoteIcon,
  EmailIcon,
  PhoneIcon,
  MenuBars,
  LocationIcon,
  UserIcon,
} from "~/components/icons/IconComponents";

export function meta() {
  return [
    { title: "هوش مارکت - ساخت محصول، ساده‌تر از همیشه" },
    {
      name: "description",
      content:
        "از ایده تا فروش در دیجی‌کالا، با قدرت هوش مصنوعی هوش مارکت. ساخت خودکار محصولات، بهینه‌سازی سئو و مدیریت انبوه.",
    },
    {
      name: "keywords",
      content: "هوش مارکت، دیجی کالا، ساخت محصول، هوش مصنوعی، سئو، فروش آنلاین",
    },
    { name: "author", content: "هوش مارکت" },
    {
      property: "og:title",
      content: "هوش مارکت - ساخت محصول، ساده‌تر از همیشه",
    },
    {
      property: "og:description",
      content: "از ایده تا فروش در دیجی‌کالا، با قدرت هوش مصنوعی هوش مارکت",
    },
    { property: "og:type", content: "website" },
  ];
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { title: "خانه", href: "/" },
    { title: "درباره ما", href: "/about" },
    { title: "ویژگی‌ها", href: "/features" },
    { title: "راهنما", href: "/help" },
    { title: "پشتیبانی", href: "/support" },
    { title: "تماس با ما", href: "/contact" },
  ];

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

  const steps = [
    {
      id: 1,
      icon: <LoginIcon />,
      title: "وارد پنل هوش مارکت شو",
      description:
        "با چند کلیک ساده وارد پنل کاربری شده و سفر خود را آغاز کنید",
    },
    {
      id: 2,
      icon: <CloudUploadIcon />,
      title: "فایل محصولاتت رو آپلود کن یا لینک بده",
      description:
        "فایل‌های CSV، Excel را آپلود کنید یا لینک محصولات از وب‌سایت‌ها را وارد کنید",
    },
    {
      id: 3,
      icon: <GridIcon />,
      title: "تنظیمات دلخواهت رو انتخاب کن",
      description:
        "قوانین سئو، قالب‌بندی و سایر تنظیمات را مطابق نیاز خود پیکربندی کنید",
    },
    {
      id: 4,
      icon: <CircleCheckIcon />,
      title: "محصولت آماده‌ی انتشار در دیجی‌کالاست!",
      description:
        "محصولات شما با کیفیت بالا و بهینه‌سازی شده آماده انتشار هستند",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "علی احمدی",
      role: "فروشنده لوازم جانبی موبایل",
      rating: 5,
      text: "قبل از هوش مارکت، ساخت ۵۰ محصول برام کابوس بود. الان تو یه ساعت ۳۰۰ تا می‌سازم!",
    },
    {
      id: 2,
      name: "مریم کریمی",
      role: "فروشنده پوشاک زنانه",
      rating: 5,
      text: "عنوان‌ها و توضیحاتش دقیقاً همونیه که باعث میشه محصولم بالا بیاد.",
    },
    {
      id: 3,
      name: "محمد رضایی",
      role: "فروشنده لوازم خانگی",
      rating: 5,
      text: "واقعاً خیلی راحت شده کارم. الان فقط روی فروش متمرکزم، نه وارد کردن محصولات.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* هدر */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* لوگو و نام برند */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                }}
              >
                هوش مارکت
              </Typography>
            </Box>

            {/* منوی دسکتاپ */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  to={link.href}
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>

            {/* دکمه‌های عمل */}
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                component={Link}
                to="/auth"
                variant="outlined"
                startIcon={<UserIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                ورود / ثبت نام
              </Button>

              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                ورود به مارکت
              </Button>

              {/* منوی موبایل */}
              <IconButton
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: theme.palette.text.primary,
                }}
                onClick={handleMenuOpen}
              >
                <MenuBars />
              </IconButton>
            </Box>

            {/* منوی کشویی موبایل */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 2 }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.href}
                  onClick={handleMenuClose}
                  component={Link}
                  to={link.href}
                >
                  {link.title}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* بخش Hero */}
      <Box
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.05)} 50%,
            ${alpha(theme.palette.background.paper, 0.8)} 100%
          )`,
          py: { xs: 6, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 6,
              textAlign: { xs: "center", md: "right" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* بج معرفی */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  px: 3,
                  py: 1,
                  borderRadius: 10,
                  mb: 4,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <AiIcon size={16} />
                نسل جدید ساخت محصول با هوش مصنوعی
              </Box>

              {/* عنوان اصلی */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                  background: "linear-gradient(135deg, #6C5CE7, #00CEC9)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ساخت محصول، ساده‌تر از همیشه
              </Typography>

              {/* متن توضیحی */}
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontSize: "1.25rem",
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                از ایده تا فروش در دیجی‌کالا، با قدرت هوش مصنوعی هوش مارکت
              </Typography>

              {/* دکمه‌های عمل */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 4,
                }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<RocketIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                    borderRadius: 3,
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                    "&:hover": {
                      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
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
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  مشاهده دمو
                </Button>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              {/* تصویر یا انیمیشن */}
              <Box
                sx={{
                  width: { xs: 300, md: 400 },
                  height: { xs: 250, md: 300 },
                  background:
                    "linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.1))",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                <AiIcon
                  size={80}
                  color={theme.palette.primary.main}
                  style={{ opacity: 0.7 }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* بخش ویژگی‌ها */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: theme.palette.background.default,
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
          </Box>

          {/* کارت‌های ویژگی */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {features.map((feature) => (
              <Box
                key={feature.id}
                sx={{
                  flex: {
                    sm: "1 1 calc(50% - 16px)",
                    lg: "1 1 calc(25% - 16px)",
                  },
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    border: "none",
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box
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
                      }}
                    >
                      {feature.icon}
                    </Box>

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

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* بخش چگونه کار می‌کند */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
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
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {steps.map((step, index) => (
              <Card
                key={step.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
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

                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
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
            ))}
          </Box>
        </Container>
      </Box>

      {/* بخش تجربیات کاربران */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
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
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {testimonials.map((testimonial) => (
              <Box key={testimonial.id} sx={{ flex: 1 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                        color: "white",
                        mb: 3,
                      }}
                    >
                      <QuoteIcon style={{ fontSize: "1.8rem" }} />
                    </Box>

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

                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background:
                            "linear-gradient(135deg, #6C5CE7, #A29BFE)",
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
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* فراخوان به عمل */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${alpha(theme.palette.primary.dark, 0.9)} 50%,
            ${theme.palette.secondary.main} 100%
          )`,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 6,
              textAlign: { xs: "center", md: "right" },
            }}
          >
            <Box sx={{ flex: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  opacity: 0.9,
                }}
              >
                آماده‌ای هوشمندتر بفروشی؟
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3rem" },
                }}
              >
                ساخت محصول در دیجی‌کالا هیچ‌وقت این‌قدر ساده نبوده
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                }}
              >
                همین الان شروع کن و اولین محصولاتت رو با کمک هوش مصنوعی بساز
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
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
                  "&:hover": {
                    boxShadow: `0 20px 60px ${alpha("#ffffff", 0.4)}`,
                    transform: "translateY(-3px) scale(1.02)",
                  },
                }}
              >
                شروع رایگان
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* فوتر */}
      <Box
        component="footer"
        sx={{
          background: theme.palette.background.paper,
          pt: 8,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
              mb: 6,
            }}
          >
            {/* معرفی شرکت */}
            <Box sx={{ flex: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 3,
                }}
              >
                هوش مارکت
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                ساخت محصول، ساده‌تر از همیشه. از ایده تا فروش در دیجی‌کالا، با
                قدرت هوش مصنوعی.
              </Typography>
            </Box>

            {/* لینک‌های سریع */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                لینک‌های سریع
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {["درباره ما", "پشتیبانی", "تماس با ما", "قیمت‌گذاری"].map(
                  (link) => (
                    <Button
                      key={link}
                      sx={{
                        justifyContent: "flex-start",
                        p: 0,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link}
                    </Button>
                  )
                )}
              </Box>
            </Box>

            {/* اطلاعات تماس */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                تماس با ما
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon style={{ color: theme.palette.text.secondary }} />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon style={{ color: theme.palette.text.secondary }} />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    support@hoshmarket.com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationIcon
                    style={{ color: theme.palette.text.secondary }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    تهران، ایران
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              © ۲۰۲۵ هوش مارکت. تمامی حقوق محفوظ است.
            </Typography>

            <Box display="flex" gap={3}>
              {["شرایط استفاده", "حریم خصوصی"].map((link) => (
                <Button
                  key={link}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {link}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
