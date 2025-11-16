import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLogin } from "../api/auth.api";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/slices/authSlice";
import type { User } from "../types";

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: loginApi, isPending, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Prime the API by calling it once on component mount
    // This is a workaround for a bug where the first call fails
    // loginApi({ username: "", password: "" }).catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await loginApi({ username, password });
      if (result.status === "true" && result.data) {
        const user: User = {
          id: result.data.id,
          username: result.data.username,
          // other user properties...
        };
        const token = result.data.token;
        dispatch(login({ user, token }));

        // Send them back to the page they tried to visit when they were redirected to the login page.
        navigate(from, { replace: true });
      } else {
        // Handle failed login
      }
    } catch (err) {
      // Error is already handled by the `error` state from `useLogin`
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          ورود به پنل مدیریت
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              نام کاربری یا رمز عبور اشتباه است
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : "ورود"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;