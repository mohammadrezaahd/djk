import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  EmailIcon,
  UserIcon,
} from "../icons/IconComponents";
import { useRegisterValidation } from "~/validation/hooks";
import { Controller } from "react-hook-form";

interface RegisterFormProps {
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useRegisterValidation();

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Box component="form" onSubmit={onFormSubmit} sx={{ width: "100%" }}>
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            id="first_name"
            label="نام"
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            autoComplete="given-name"
            autoFocus
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <UserIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            id="last_name"
            label="نام خانوادگی"
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            autoComplete="family-name"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <UserIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            id="email"
            label="ایمیل"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            id="password"
            label="رمز عبور"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              "حداقل 8 کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص"
            }
            autoComplete="new-password"
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
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || !isValid}
        sx={{
          mt: 4,
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
            در حال ثبت نام...
          </>
        ) : (
          "ثبت نام و ورود"
        )}
      </Button>
    </Box>
  );
};

export default RegisterForm;
