import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  IconButton,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import { Link } from "react-router";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const Footer: React.FC = () => {
  const theme = useTheme();

  const footerSections = [
    {
      title: "محصولات",
      links: [
        { title: "ساخت محصول", href: "/products/create" },
        { title: "مدیریت محصولات", href: "/products/manage" },
        { title: "تجزیه و تحلیل", href: "/analytics" },
        { title: "قیمت‌گذاری", href: "/pricing" },
      ],
    },
    {
      title: "شرکت",
      links: [
        { title: "درباره ما", href: "/about" },
        { title: "تماس با ما", href: "/contact" },
        { title: "فرصت‌های شغلی", href: "/careers" },
        { title: "اخبار و مقالات", href: "/blog" },
      ],
    },
    {
      title: "پشتیبانی",
      links: [
        { title: "مرکز راهنمایی", href: "/help" },
        { title: "پشتیبانی آنلاین", href: "/support" },
        { title: "سوالات متداول", href: "/faq" },
        { title: "آموزش‌ها", href: "/tutorials" },
      ],
    },
    {
      title: "قانونی",
      links: [
        { title: "شرایط و ضوابط", href: "/terms" },
        { title: "حریم خصوصی", href: "/privacy" },
        { title: "سیاست کوکی‌ها", href: "/cookies" },
        { title: "GDPR", href: "/gdpr" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      title: "۰۲۱-۱۲۳۴۵۶۷۸",
      subtitle: "پشتیبانی ۲۴/۷",
    },
    {
      icon: <EmailIcon />,
      title: "support@hoshmarket.com",
      subtitle: "پاسخ در کمتر از ۲ ساعت",
    },
    {
      icon: <LocationOnIcon />,
      title: "تهران، ایران",
      subtitle: "دفتر مرکزی",
    },
  ];

  const socialMedia = [
    {
      icon: <TelegramIcon />,
      href: "https://t.me/hoshmarket",
      label: "تلگرام",
    },
    {
      icon: <InstagramIcon />,
      href: "https://instagram.com/hoshmarket",
      label: "اینستاگرام",
    },
    {
      icon: <WhatsAppIcon />,
      href: "https://wa.me/989123456789",
      label: "واتساپ",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, 
          ${theme.palette.background.paper} 0%, 
          ${alpha(theme.palette.primary.main, 0.05)} 100%
        )`,
        pt: 8,
        pb: 4,
        position: "relative",
      }}
    >
      {/* خط تزیینی بالا */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(135deg, #6C5CE7, #00CEC9, #FDA7DC, #FDCB6E)",
        }}
      />

      <Container maxWidth="lg">
        {/* بخش اصلی فوتر */}
        <Grid container spacing={6}>
          {/* معرفی شرکت */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box>
              {/* لوگو و نام */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <AutoAwesomeIcon />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                  }}
                >
                  هوش مارکت
                </Typography>
              </Box>

              {/* شعار */}
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

              {/* شبکه‌های اجتماعی */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  ما را دنبال کنید
                </Typography>
                <Box display="flex" gap={1}>
                  {socialMedia.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* لینک‌های فوتر */}
          {footerSections.map((section, index) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                {section.title}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {section.links.map((link, linkIndex) => (
                  <Button
                    key={linkIndex}
                    component={Link}
                    to={link.href}
                    variant="text"
                    sx={{
                      justifyContent: "flex-start",
                      p: 0,
                      minWidth: "auto",
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: theme.palette.primary.main,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {link.title}
                  </Button>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* اطلاعات تماس */}
        <Box mb={6}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 4,
              textAlign: "center",
            }}
          >
            راه‌های تماس با ما
          </Typography>
          <Grid container spacing={4}>
            {contactInfo.map((contact, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {contact.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {contact.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {contact.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* کپی‌رایت */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            textAlign: { xs: "center", md: "left" },
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

          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            <Button
              component={Link}
              to="/terms"
              variant="text"
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              شرایط استفاده
            </Button>
            <Button
              component={Link}
              to="/privacy"
              variant="text"
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              حریم خصوصی
            </Button>
            <Button
              component={Link}
              to="/sitemap"
              variant="text"
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              نقشه سایت
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
