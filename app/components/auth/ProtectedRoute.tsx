import React from "react";
import { Navigate } from "react-router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuthStatus } from "~/api/auth.api";
import { safeLocalStorage, isClient } from "~/utils/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // اگر در server-side هستیم، فوراً redirect کن
  if (!isClient()) {
    return <Navigate to="/restricted" replace />;
  }

  const { isAuthenticated, isLoading, isError } = useAuthStatus();

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

  // اگر احراز هویت نشده، redirect کن
  if (!isAuthenticated || isError) {
    // پاک کردن توکن در صورت خطا
    if (isError) {
      safeLocalStorage.removeItem("access_token");
    }
    return <Navigate to="/restricted" replace />;
  }

  // نمایش محتوای محافظت شده
  return <>{children}</>;
};

export default ProtectedRoute;
