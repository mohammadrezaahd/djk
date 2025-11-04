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
} from "@mui/material";
import { loginApiNumber } from "~/api/auth.api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authentication - React Router App" },
    { name: "description", content: "Login and register page" },
  ];
}

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setApiError("");
    setSuccessMessage("");

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
      setIsLoading(true);

      try {
        const result = await loginApiNumber({ username, password });

        setSuccessMessage("ورود موفقیت آمیز بود!");
        console.log("Login successful:", result);

        // Clear form
        setUsername("");
        setPassword("");

        // Here you can handle successful login (redirect, store token, etc.)
        // Example: localStorage.setItem('token', result.access_token);
      } catch (error: any) {
        setApiError(
          error.response?.data?.message ||
            error.message ||
            "خطایی در ورود رخ داد"
        );
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            ورود به سیستم
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            لطفاً اطلاعات خود را وارد کنید
          </Typography>

          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {apiError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              label="رمز عبور"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  در حال ورود...
                </>
              ) : (
                "ورود"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
export default Auth;
