import React from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { usePhoneValidation } from "~/validation/hooks";
import { Controller } from "react-hook-form";
import { PhoneIcon } from "../icons/IconComponents";

interface PhoneInputProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  phone,
  onPhoneChange,
  onSubmit,
  isLoading,
}) => {
  const { control, handleSubmit, formState: { errors, isValid } } = usePhoneValidation(phone);

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data.phone);
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
            helperText={errors.phone?.message || "شماره موبایل خود را وارد کنید"}
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || !isValid}
        sx={{
          mt: 3,
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
            در حال بررسی...
          </>
        ) : (
          "ادامه"
        )}
      </Button>
    </Box>
  );
};

export default PhoneInput;
