import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuthStatus } from "~/api/auth.api";
import { safeLocalStorage, isClient } from "~/utils/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // اگر در server-side هستیم، فوراً redirect کن
  if (!isClient()) {
    return <Navigate to="/auth" replace />;
  }

  const { isAuthenticated, isLoading, isError, error } = useAuthStatus();

  useEffect(() => {
    if (isError && error) {
      const axiosError = error as any;
      const statusCode = axiosError?.response?.status;

      console.log("🔒 ProtectedRoute Error:", statusCode, axiosError);

      if (statusCode === 401) {
        // 401: توکن نداره یا توکن نامعتبر - برو صفحه auth
        console.log("❌ 401: توکن نامعتبر - هدایت به صفحه ورود");
        safeLocalStorage.removeItem("access_token");
        setRedirectPath("/auth");
      } else if (statusCode === 422) {
        // 422: توکن داره اما register نکرده - برو صفحه auth با state برای نمایش فرم register
        console.log("⚠️ 422: کاربر register نکرده - هدایت به فرم ثبت‌نام");
        // توکن را نگه دار چون برای register لازم است
        navigate("/auth", { 
          state: { 
            step: "register",
            needsRegistration: true 
          },
          replace: true 
        });
        return; // جلوگیری از ادامه execution
      } else {
        // سایر خطاها - پاک کردن توکن و برو auth
        console.log("❌ خطای احراز هویت - هدایت به صفحه ورود");
        safeLocalStorage.removeItem("access_token");
        setRedirectPath("/auth");
      }
    }
  }, [isError, error, navigate]);

  // نمایش Loading در حین بررسی
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="body1" color="text.secondary">
          در حال بررسی دسترسی...
        </Typography>
      </Box>
    );
  }

  // Redirect اگر لازم باشد
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // اگر احراز هویت نشده، redirect کن
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // نمایش محتوای محافظت شده
  return <>{children}</>;
};

export default ProtectedRoute;
