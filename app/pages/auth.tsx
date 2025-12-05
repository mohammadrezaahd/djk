import React, { useState, useEffect } from "react";
import type { Route } from "./+types/auth";
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { LoginIcon } from "~/components/icons/IconComponents";
import {
  useCheckNumber,
  useSendOtp,
  useVerifyOtp,
  useRegister,
  useLoginWithPassword,
} from "~/api/auth.api";
import { useNavigate, useLocation } from "react-router";
import {
  PhoneInput,
  OtpInput,
  RegisterForm,
  PasswordLogin,
} from "~/components/auth";
import { useSnackbar } from "notistack";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ورود به سیستم" },
    { name: "description", content: "صفحه ورود به پنل مدیریت" },
  ];
}

type AuthStep =
  | "phone"
  | "otp-new-user"
  | "register"
  | "password-login"
  | "otp-existing-user";

const Auth = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // API Hooks
  const checkNumber = useCheckNumber();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const register = useRegister();
  const loginWithPassword = useLoginWithPassword();

  // بررسی location.state برای هدایت مستقیم به register
  useEffect(() => {
    const state = location.state as any;
    if (state?.needsRegistration && state?.step === "register") {
      console.log("📝 هدایت مستقیم به فرم ثبت‌نام (422 error)");
      setStep("register");
      enqueueSnackbar("لطفاً اطلاعات خود را تکمیل کنید", { variant: "info" });
      // پاک کردن state بعد از استفاده
      window.history.replaceState({}, document.title);
    }
  }, [location, enqueueSnackbar]);

  // بررسی اینکه آیا کاربر قبلاً لاگین کرده و register شده یا نه
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const state = location.state as any;

    // فقط redirect کن اگر needsRegistration نباشد
    if (token && !state?.needsRegistration) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location]);

  // Handlers
  const handlePhoneSubmit = async (phoneValue: string) => {
    try {
      enqueueSnackbar("در حال بررسی شماره موبایل...", { variant: "info" });
      const result = await checkNumber.mutateAsync({ phone: phoneValue });

      if (result.new_user) {
        // کاربر جدید - ارسال OTP
        await sendOtp.mutateAsync({ phone: phoneValue });
        setStep("otp-new-user");
        enqueueSnackbar("کد تایید به شماره شما ارسال شد", {
          variant: "success",
        });
      } else {
        // کاربر موجود - نمایش فرم لاگین با رمز
        setStep("password-login");
        enqueueSnackbar("لطفاً با رمز عبور خود وارد شوید", { variant: "info" });
      }
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "خطا در بررسی شماره موبایل",
        { variant: "error" }
      );
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      enqueueSnackbar("کد وارد شده باید 6 رقم باشد", { variant: "error" });
      return;
    }

    try {
      enqueueSnackbar("در حال تایید کد...", { variant: "info" });
      const result = await verifyOtp.mutateAsync({ phone, code: otpCode });

      if (step === "otp-new-user") {
        // کاربر جدید - به فرم ثبت نام بروید
        setStep("register");
        enqueueSnackbar("کد تایید شد! لطفاً اطلاعات خود را تکمیل کنید", {
          variant: "success",
        });
      } else {
        // کاربر موجود - لاگین شد
        enqueueSnackbar("ورود موفقیت‌آمیز! در حال انتقال...", {
          variant: "success",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "کد تایید نامعتبر است",
        { variant: "error" }
      );
    }
  };

  const handleRegisterSubmit = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    try {
      enqueueSnackbar("در حال ثبت نام...", { variant: "info" });
      await register.mutateAsync(data);
      enqueueSnackbar("ثبت نام موفقیت‌آمیز! در حال ورود به سیستم...", {
        variant: "success",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "خطا در ثبت نام",
        { variant: "error" }
      );
    }
  };

  const handlePasswordLogin = async (phoneNum: string, password: string) => {
    try {
      enqueueSnackbar("در حال ورود...", { variant: "info" });
      await loginWithPassword.mutateAsync({
        phone: phoneNum,
        password,
      });
      enqueueSnackbar("ورود موفقیت‌آمیز! در حال انتقال...", {
        variant: "success",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "شماره یا رمز عبور اشتباه است",
        { variant: "error" }
      );
    }
  };

  const handleSwitchToOtp = async () => {
    if (!phone.trim()) {
      enqueueSnackbar("لطفاً ابتدا شماره موبایل را وارد کنید", {
        variant: "warning",
      });
      return;
    }

    try {
      enqueueSnackbar("در حال ارسال کد...", { variant: "info" });
      await sendOtp.mutateAsync({ phone });
      setStep("otp-existing-user");
      enqueueSnackbar("کد تایید به شماره شما ارسال شد", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "خطا در ارسال کد",
        { variant: "error" }
      );
    }
  };

  const handleResendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    try {
      enqueueSnackbar("در حال ارسال مجدد کد...", { variant: "info" });
      await sendOtp.mutateAsync({ phone });
      enqueueSnackbar("کد تایید مجدداً ارسال شد", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "خطا در ارسال مجدد کد",
        { variant: "error" }
      );
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    enqueueSnackbar("بازگشت به صفحه ورود شماره موبایل", { variant: "info" });
  };

  const isLoading =
    checkNumber.isPending ||
    sendOtp.isPending ||
    verifyOtp.isPending ||
    register.isPending ||
    loginWithPassword.isPending;

  // Render current step
  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <PhoneInput
            phone={phone}
            onPhoneChange={setPhone}
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
          />
        );

      case "otp-new-user":
      case "otp-existing-user":
        return (
          <OtpInput
            otp={otp}
            onOtpChange={setOtp}
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            onBack={handleBackToPhone}
            isLoading={isLoading}
            phone={phone}
          />
        );

      case "register":
        return (
          <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />
        );

      case "password-login":
        return (
          <PasswordLogin
            phone={phone}
            onPhoneChange={setPhone}
            onSubmit={handlePasswordLogin}
            onSwitchToOtp={handleSwitchToOtp}
            isLoading={isLoading}
          />
        );

      default:
        return null;
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
                <LoginIcon style={{ fontSize: 40, color: "white" }} />
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
                {step === "register"
                  ? "لطفاً اطلاعات خود را وارد کنید"
                  : step === "password-login"
                    ? "برای ادامه وارد حساب کاربری خود شوید"
                    : step === "otp-new-user" || step === "otp-existing-user"
                      ? "کد تایید ارسال شده را وارد کنید"
                      : "برای ورود یا ثبت نام شماره موبایل خود را وارد کنید"}
              </Typography>

              {/* Render current step */}
              {renderStep()}
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
