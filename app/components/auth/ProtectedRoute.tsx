import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useCurrentUser } from "~/api/auth.api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    mutateAsync: getCurrentUser,
    isPending,
    error,
  } = useCurrentUser();

  useEffect(() => {
    const checkAuth = async () => {
      // بررسی وجود توکن در localStorage
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        // بررسی اعتبار توکن با API
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Authentication check failed:", err);
        // پاک کردن توکن نامعتبر
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // نمایش Loading در حین بررسی
  if (isChecking || isPending) {
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

  // Redirect به صفحه Restricted اگر احراز هویت نشده
  if (!isAuthenticated) {
    return <Navigate to="/restricted" replace />;
  }

  // نمایش محتوای محافظت شده
  return <>{children}</>;
};

export default ProtectedRoute;
