import React, { useState } from "react";
import type { Route } from "./+types/auth";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useLoginNumber } from "~/api/auth.api";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ورود به سیستم" },
    { name: "description", content: "صفحه ورود به پنل مدیریت" },
  ];
}

const Auth = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // بررسی اینکه آیا کاربر قبلاً لاگین کرده یا نه
  React.useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // اگر توکن موجود است، کاربر را به صفحه اصلی هدایت کن
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // استفاده از React Query hook
  const {
    mutateAsync: login,
    isPending: isLoading,
    error: apiError,
    isSuccess,
  } = useLoginNumber();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: { username?: string; password?: string } = {};

    if (!username) {
      newErrors.username = "نام کاربری الزامی است";
    }

    if (!password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (password.length < 3) {
      newErrors.password = "رمز عبور باید حداقل ۳ کاراکتر باشد";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await login({ username, password });


        // Clear form
        setUsername("");
        setPassword("");

        // Redirect to home page after successful login
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error: any) {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "500px",
          height: "500px",
          background: alpha(theme.palette.secondary.main, 0.1),
          borderRadius: "50%",
          top: "-250px",
          right: "-250px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background: alpha(theme.palette.secondary.main, 0.15),
          borderRadius: "50%",
          bottom: "-200px",
          left: "-200px",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.37)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Logo/Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                }}
              >
                <LoginIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>

              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                خوش آمدید
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, textAlign: "center" }}
              >
                برای ادامه لطفاً وارد حساب کاربری خود شوید
              </Typography>

              {/* Success Message */}
              {isSuccess && (
                <Fade in>
                  <Alert
                    severity="success"
                    sx={{
                      width: "100%",
                      mb: 2,
                      borderRadius: 2,
                    }}
                  >
                    ورود موفقیت آمیز بود! در حال انتقال...
                  </Alert>
                </Fade>
              )}

              {/* Error Message */}
              {apiError && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{
                      width: "100%",
                      mb: 2,
                      borderRadius: 2,
                    }}
                  >
                    {(apiError as any)?.response?.data?.message ||
                      (apiError as any)?.message ||
                      "خطایی در ورود رخ داد"}
                  </Alert>
                </Fade>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  id="username"
                  label="نام کاربری"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  autoComplete="username"
                  autoFocus
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  id="password"
                  label="رمز عبور"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  autoComplete="current-password"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&:disabled": {
                      background: theme.palette.action.disabledBackground,
                    },
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{ mr: 1, color: "white" }}
                      />
                      در حال ورود...
                    </>
                  ) : (
                    "ورود به سیستم"
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>

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
          © {new Date().getFullYear()} تمامی حقوق محفوظ است
        </Typography>
      </Container>
    </Box>
  );
};
export default Auth;
