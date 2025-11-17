import React, { useEffect } from "react";
import AppLayout from "~/components/layout/AppLayout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useCurrentUserQuery } from "~/api/auth.api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setUser } from "~/store/slices/userSlice";

export function meta() {
  return [
    { title: "پروفایل من" },
    { name: "description", content: "مشاهده و ویرایش اطلاعات پروفایل" },
  ];
}

const ProfilePage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // دریافت اطلاعات از store
  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  // دریافت اطلاعات از API
  const { data: userData, isLoading, isError, error } = useCurrentUserQuery();

  // ذخیره در store
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [userData, dispatch]);

  const userInfo = currentUser || userData;

  if (isLoading) {
    return (
      <AppLayout title="پروفایل من">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout title="پروفایل من">
        <Alert severity="error" sx={{ mt: 2 }}>
          خطا در دریافت اطلاعات پروفایل:{" "}
          {(error as any)?.message || "خطای نامشخص"}
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="پروفایل من">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header Card with Avatar */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "300px",
              height: "300px",
              background: alpha(theme.palette.common.white, 0.1),
              borderRadius: "50%",
              top: "-150px",
              right: "-150px",
            },
          }}
        >
          <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "right" },
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "3rem",
                  fontWeight: "bold",
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  border: `4px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`,
                }}
              >
                {userInfo?.first_name?.[0]?.toUpperCase() ||
                  userInfo?.email?.[0]?.toUpperCase() ||
                  "U"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                  {userInfo?.first_name && userInfo?.last_name
                    ? `${userInfo.first_name} ${userInfo.last_name}`
                    : "کاربر محترم"}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="کاربر تایید شده"
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Personal Information */}
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PersonIcon color="primary" />
                اطلاعات شخصی
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", mb: 0.5, display: "block" }}
                  >
                    نام
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    {userInfo?.first_name || "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", mb: 0.5, display: "block" }}
                  >
                    نام خانوادگی
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    {userInfo?.last_name || "—"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EmailIcon color="primary" />
                اطلاعات تماس
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", mb: 0.5, display: "block" }}
                  >
                    ایمیل
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", direction: "ltr", textAlign: "right" }}
                  >
                    {userInfo?.email || "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", mb: 0.5, display: "block" }}
                  >
                    شماره موبایل
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", direction: "ltr", textAlign: "right" }}
                  >
                    {userInfo?.phone || "—"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Note Box */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            برای ویرایش اطلاعات پروفایل، لطفاً با پشتیبانی تماس بگیرید
          </Typography>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default ProfilePage;
