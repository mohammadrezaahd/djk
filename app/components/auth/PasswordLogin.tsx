import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

import {
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
} from "../icons/IconComponents";
import { usePasswordLoginValidation } from "~/validation/hooks";
import { Controller } from "react-hook-form";

interface PasswordLoginProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onSubmit: (phone: string, password: string) => void;
  onSwitchToOtp: () => void;
  isLoading: boolean;
}

const PasswordLogin: React.FC<PasswordLoginProps> = ({
  phone,
  onPhoneChange,
  onSubmit,
  onSwitchToOtp,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = usePasswordLoginValidation(phone);

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data.phone, data.password);
  });

  return (
    <Box component="form" onSubmit={onFormSubmit} sx={{ width: "100%" }}>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            id="phone"
            label="شماره موبایل"
            type="tel"
            onChange={(e) => {
              field.onChange(e);
              onPhoneChange(e.target.value);
            }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            autoComplete="tel"
            autoFocus
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
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
            helperText={errors.password?.message}
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
            در حال ورود...
          </>
        ) : (
          "ورود به سیستم"
        )}
      </Button>

      <Divider sx={{ my: 2 }}>یا</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={onSwitchToOtp}
        disabled={isLoading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontSize: "1rem",
        }}
      >
        ورود با کد یکبار مصرف
      </Button>
    </Box>
  );
};

export default PasswordLogin;
