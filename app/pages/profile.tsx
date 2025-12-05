import React, { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import {
  Box,
  CardContent,
  Typography,
  Avatar,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Tooltip,
  Badge,
} from "@mui/material";

import {
  EmailIcon,
  UserIcon,
  PhoneIcon,
  EditIcon,
  CloseIcon,
  StarIcon,
  ShieldIcon,
  VerifiedIcon,
  SaveIcon,
} from "~/components/icons/IconComponents";

import { useProfile, useUpdateProfile } from "~/api/profile.api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setUser } from "~/store/slices/userSlice";
import { useSnackbar } from "notistack";

export function meta() {
  return [
    { title: "پروفایل من" },
    { name: "description", content: "مشاهده و ویرایش اطلاعات پروفایل" },
  ];
}

const ProfilePage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });

  // دریافت اطلاعات از store
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // دریافت اطلاعات از API
  const { data: userData, isLoading, isError, error } = useProfile();

  // Update profile mutation
  const updateProfileMutation = useUpdateProfile();

  // ذخیره در store
  useEffect(() => {
    if (userData?.data) {
      dispatch(setUser(userData.data));
    }
  }, [userData, dispatch]);

  const userInfo = currentUser || userData?.data;

  // Initialize edit form when user data is available
  useEffect(() => {
    if (userInfo) {
      setEditForm({
        email: userInfo.email || "",
        first_name: userInfo.first_name || "",
        last_name: userInfo.last_name || "",
      });
    }
  }, [userInfo]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset form
      if (userInfo) {
        setEditForm({
          email: userInfo.email || "",
          first_name: userInfo.first_name || "",
          last_name: userInfo.last_name || "",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      // Only send fields that have changed
      const updatedFields: any = {};

      if (editForm.email !== userInfo?.email) {
        updatedFields.email = editForm.email;
      }
      if (editForm.first_name !== userInfo?.first_name) {
        updatedFields.first_name = editForm.first_name;
      }
      if (editForm.last_name !== userInfo?.last_name) {
        updatedFields.last_name = editForm.last_name;
      }

      // If no changes, just exit edit mode
      if (Object.keys(updatedFields).length === 0) {
        setIsEditing(false);
        enqueueSnackbar("هیچ تغییری انجام نشد", { variant: "info" });
        return;
      }

      await updateProfileMutation.mutateAsync(updatedFields);
      setIsEditing(false);
      enqueueSnackbar("پروفایل با موفقیت به‌روزرسانی شد", {
        variant: "success",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      enqueueSnackbar("خطا در به‌روزرسانی پروفایل", { variant: "error" });
    }
  };

  const handleInputChange =
    (field: keyof typeof editForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

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
          {userData?.error || (error as any)?.message || "خطای نامشخص"}
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="پروفایل من">
      <Box sx={{ maxWidth: 1400, mx: "auto", p: 2 }}>
        {/* Modern Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.dark} 100%)`,
            position: "relative",
            overflow: "hidden",
            minHeight: "280px",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "600px",
              height: "600px",
              background: `conic-gradient(from 0deg, transparent, ${alpha(theme.palette.common.white, 0.08)}, transparent)`,
              borderRadius: "50%",
              animation: "rotate 20s linear infinite",
              "@keyframes rotate": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 2, p: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Tooltip title="تغییر تصویر پروفایل">
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.primary.main,
                          boxShadow: 2,
                          "&:hover": { bgcolor: theme.palette.grey[100] },
                        }}
                      ></IconButton>
                    </Tooltip>
                  }
                >
                  <Avatar
                    sx={{
                      width: 140,
                      height: 140,
                      fontSize: "3.5rem",
                      fontWeight: "bold",
                      bgcolor: alpha(theme.palette.common.white, 0.25),
                      border: `5px solid ${alpha(theme.palette.common.white, 0.4)}`,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {userInfo?.first_name?.[0]?.toUpperCase() ||
                      userInfo?.email?.[0]?.toUpperCase() ||
                      "U"}
                  </Avatar>
                </Badge>
              </Box>

              <Box
                sx={{
                  color: "white",
                  flex: 1,
                  textAlign: { xs: "center", md: "right" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 3,
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 2, md: 0 },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        mb: 1.5,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        fontSize: { xs: "2rem", md: "3rem" },
                      }}
                    >
                      {userInfo?.first_name && userInfo?.last_name
                        ? `${userInfo.first_name} ${userInfo.last_name}`
                        : "کاربر محترم"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        opacity: 0.9,
                        fontWeight: 400,
                        mb: { xs: 2, md: 0 },
                      }}
                    >
                      عضو هوشمارکت
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: { xs: "center", md: "flex-end" },
                      alignSelf: { xs: "center", md: "flex-start" },
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Tooltip title="ذخیره تغییرات">
                          <IconButton
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                            sx={{
                              color: "white",
                              bgcolor: alpha(theme.palette.success.main, 0.3),
                              backdropFilter: "blur(10px)",
                              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.success.main, 0.5),
                              },
                            }}
                          >
                            {updateProfileMutation.isPending ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "white" }}
                              />
                            ) : (
                              <SaveIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="لغو">
                          <IconButton
                            onClick={handleEditToggle}
                            disabled={updateProfileMutation.isPending}
                            sx={{
                              color: "white",
                              bgcolor: alpha(theme.palette.error.main, 0.3),
                              backdropFilter: "blur(10px)",
                              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.5),
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="ویرایش پروفایل">
                        <IconButton
                          onClick={handleEditToggle}
                          sx={{
                            color: "white",
                            bgcolor: alpha(theme.palette.common.white, 0.2),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.common.white, 0.3),
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                    mb: 4,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Chip
                    icon={<VerifiedIcon />}
                    label="تایید شده"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.2),
                      color: "white",
                      border: `1px solid ${alpha(theme.palette.success.main, 0.4)}`,
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Chip
                    icon={<ShieldIcon />}
                    label="امن"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.2),
                      color: "white",
                      border: `1px solid ${alpha(theme.palette.info.main, 0.4)}`,
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Chip
                    icon={<StarIcon />}
                    label="کاربر فعال"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.2),
                      color: "white",
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{ textAlign: { xs: "center", md: "right" }, py: 1 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          mb: 0.5,
                        }}
                      >
                        فعال
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ opacity: 0.85, fontWeight: 500 }}
                      >
                        وضعیت حساب
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{ textAlign: { xs: "center", md: "right" }, py: 1 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          mb: 0.5,
                          fontSize: { xs: "1.5rem", sm: "2rem" },
                        }}
                      >
                        {new Date().toLocaleDateString("fa-IR")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ opacity: 0.85, fontWeight: 500 }}
                      >
                        تاریخ عضویت
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Modern Information Grid */}
        <Grid container spacing={5} sx={{ mb: 5 }}>
          {/* Personal Information Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <CardContent sx={{ p: 5, pt: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <UserIcon style={{ fontSize: "1.5rem" }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    اطلاعات شخصی
                  </Typography>
                </Box>

                <Stack spacing={5}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      نام
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editForm.first_name}
                        onChange={handleInputChange("first_name")}
                        variant="outlined"
                        size="medium"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.8
                            ),
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "500",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {userInfo?.first_name || "نام را وارد کنید"}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      نام خانوادگی
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editForm.last_name}
                        onChange={handleInputChange("last_name")}
                        variant="outlined"
                        size="medium"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.8
                            ),
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "500",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {userInfo?.last_name || "نام خانوادگی را وارد کنید"}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>

          {/* Contact Information Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
                },
              }}
            >
              <CardContent sx={{ p: 3, pt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      mr: 2,
                    }}
                  >
                    <EmailIcon />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.secondary.main,
                    }}
                  >
                    اطلاعات تماس
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      ایمیل
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editForm.email}
                        onChange={handleInputChange("email")}
                        variant="outlined"
                        size="medium"
                        fullWidth
                        type="email"
                        sx={{
                          direction: "ltr",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(
                              theme.palette.background.paper,
                              0.8
                            ),
                          },
                          "& input": { textAlign: "right" },
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "500",
                          direction: "ltr",
                          textAlign: "right",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {userInfo?.email || "ایمیل را وارد کنید"}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      شماره موبایل
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "1.2rem",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "500",
                          direction: "ltr",
                          textAlign: "right",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {userInfo?.phone || "شماره موبایل ثبت نشده"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>

          {/* Subscription Plan Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                },
              }}
            >
              <CardContent sx={{ p: 5, pt: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <StarIcon style={{ fontSize: "1.5rem" }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.warning.main,
                    }}
                  >
                    اشتراک من
                  </Typography>
                </Box>

                <Stack spacing={5}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 2,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      نوع اشتراک
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        color: theme.palette.text.primary,
                        fontSize: "1.25rem",
                      }}
                    >
                      پلن رایگان
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: "600",
                        mb: 2,
                        display: "block",
                        textTransform: "uppercase",
                      }}
                    >
                      تا پایان اشتراک
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        color: theme.palette.success.main,
                        fontSize: "1.25rem",
                      }}
                    >
                      نامحدود
                    </Typography>
                  </Box>

                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        borderRadius: 3,
                        py: 2,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.error.dark})`,
                        },
                      }}
                    >
                      ارتقاء اشتراک
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Features Section */}
        <Grid container spacing={5} sx={{ mt: 5 }}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.8)} 100%)`,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                p: 5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 4,
                  color: theme.palette.text.primary,
                  fontSize: "1.3rem",
                }}
              >
                دسترسی سریع
              </Typography>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShieldIcon />}
                    sx={{
                      borderRadius: 3,
                      py: 2.5,
                      borderColor: alpha(theme.palette.warning.main, 0.3),
                      color: theme.palette.warning.main,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: theme.palette.warning.main,
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    تنظیمات امنیت
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<UserIcon />}
                    sx={{
                      borderRadius: 3,
                      py: 2.5,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      color: theme.palette.primary.main,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    مدیریت حساب
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Help & Support */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                p: 5,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color: theme.palette.info.main,
                  fontSize: "1.3rem",
                }}
              >
                راهنما و پشتیبانی
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7, fontSize: "1rem" }}
              >
                {isEditing
                  ? "ایمیل، نام و نام خانوادگی قابل ویرایش هستند. شماره موبایل از طریق تنظیمات امنیتی قابل تغییر است."
                  : "برای ویرایش اطلاعات پروفایل، روی دکمه ویرایش در بالای صفحه کلیک کنید."}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: 3,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.primary.dark})`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                تماس با پشتیبانی
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default ProfilePage;
