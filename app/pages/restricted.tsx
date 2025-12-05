import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha,
} from "@mui/material";

import {
  LockIcon,
  LoginIcon,
  HomeIcon,
} from "~/components/icons/IconComponents";

import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "دسترسی محدود" },
    { name: "description", content: "شما به این صفحه دسترسی ندارید" },
  ];
}

const RestrictedPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "500px",
          height: "500px",
          background: alpha(theme.palette.warning.main, 0.1),
          borderRadius: "50%",
          top: "-250px",
          right: "-250px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background: alpha(theme.palette.warning.main, 0.15),
          borderRadius: "50%",
          bottom: "-200px",
          left: "-200px",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.37)}`,
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.error.main, 0.4)}`,
            }}
          >
            <LockIcon style={{ fontSize: 50, color: "white" }} />
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme.palette.error.main,
            }}
          >
            دسترسی محدود
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.8 }}
          >
            شما به این صفحه دسترسی ندارید
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            برای دسترسی به این بخش، لطفاً ابتدا وارد حساب کاربری خود شوید. اگر
            حساب کاربری ندارید، با پشتیبانی تماس بگیرید.
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: "60%",
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
              margin: "0 auto",
              mb: 4,
            }}
          />

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/auth")}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
              }}
            >
              ورود به سیستم
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              بازگشت به خانه
            </Button>
          </Box>

          {/* Info Box */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 نکته: اگر قبلاً وارد شده‌اید و این پیام را می‌بینید، احتمالاً
              نشست شما منقضی شده است. لطفاً دوباره وارد شوید.
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: "white",
            opacity: 0.8,
          }}
        >
          در صورت نیاز به کمک، با پشتیبانی تماس بگیرید
        </Typography>
      </Container>
    </Box>
  );
};

export default RestrictedPage;
