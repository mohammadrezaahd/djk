import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { AngleLeftIcon } from "../icons/IconComponents";
interface OtpInputProps {
  otp: string[];
  onOtpChange: (otp: string[]) => void;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
  phone: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onBack,
  isLoading,
  error,
  phone,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    onOtpChange(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) {
      newOtp.push("");
    }
    onOtpChange(newOtp);

    // Focus on the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every((digit) => digit !== "")) {
      onSubmit();
    }
  };

  const handleResendClick = () => {
    setCountdown(60);
    setCanResend(false);
    onResend();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        کد 6 رقمی ارسال شده به شماره <strong>{phone}</strong> را وارد کنید
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1.5,
          mb: 2,
          direction: "ltr",
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
              },
            }}
            sx={{
              width: "50px",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            error={!!error}
          />
        ))}
      </Box>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", textAlign: "center", mb: 2 }}
        >
          {error}
        </Typography>
      )}

      {!canResend && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mb: 2 }}
        >
          ارسال مجدد کد تا {formatTime(countdown)}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || otp.some((digit) => !digit)}
        sx={{
          mt: 2,
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
            در حال تایید...
          </>
        ) : (
          "تایید کد"
        )}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={handleResendClick}
        disabled={isLoading || !canResend}
        sx={{ mt: 1 }}
      >
        ارسال مجدد کد
      </Button>

      <Divider sx={{ my: 2 }}>یا</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={onBack}
        disabled={isLoading}
        startIcon={<AngleLeftIcon />}
        sx={{
          py: 1.5,
          borderRadius: 2,
        }}
      >
        بازگشت به وارد کردن شماره
      </Button>
    </Box>
  );
};

export default OtpInput;
