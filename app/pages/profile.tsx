import React, { useEffect, useState } from "react";
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
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
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
    last_name: ""
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
        last_name: userInfo.last_name || ""
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
          last_name: userInfo.last_name || ""
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
      enqueueSnackbar("پروفایل با موفقیت به‌روزرسانی شد", { variant: "success" });
    } catch (error) {
      console.error("Profile update error:", error);
      enqueueSnackbar("خطا در به‌روزرسانی پروفایل", { variant: "error" });
    }
  };

  const handleInputChange = (field: keyof typeof editForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({
      ...prev,
      [field]: event.target.value
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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {userInfo?.first_name && userInfo?.last_name
                      ? `${userInfo.first_name} ${userInfo.last_name}`
                      : "کاربر محترم"}
                  </Typography>
                  <Box>
                    {isEditing ? (
                      <>
                        <IconButton
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                          sx={{ 
                            color: "white", 
                            bgcolor: alpha(theme.palette.common.white, 0.2),
                            mr: 1,
                            "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.3) }
                          }}
                        >
                          {updateProfileMutation.isPending ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SaveIcon />}
                        </IconButton>
                        <IconButton
                          onClick={handleEditToggle}
                          disabled={updateProfileMutation.isPending}
                          sx={{ 
                            color: "white",
                            bgcolor: alpha(theme.palette.error.main, 0.3),
                            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.5) }
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={handleEditToggle}
                        sx={{ 
                          color: "white",
                          bgcolor: alpha(theme.palette.common.white, 0.2),
                          "&:hover": { bgcolor: alpha(theme.palette.common.white, 0.3) }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
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
                  {isEditing ? (
                    <TextField
                      value={editForm.first_name}
                      onChange={handleInputChange('first_name')}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {userInfo?.first_name || "—"}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", mb: 0.5, display: "block" }}
                  >
                    نام خانوادگی
                  </Typography>
                  {isEditing ? (
                    <TextField
                      value={editForm.last_name}
                      onChange={handleInputChange('last_name')}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                      {userInfo?.last_name || "—"}
                    </Typography>
                  )}
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
                  {isEditing ? (
                    <TextField
                      value={editForm.email}
                      onChange={handleInputChange('email')}
                      variant="outlined"
                      size="small"
                      fullWidth
                      type="email"
                      sx={{ mt: 1, direction: "ltr" }}
                      InputProps={{ sx: { textAlign: "right" } }}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1.1rem", direction: "ltr", textAlign: "right" }}
                    >
                      {userInfo?.email || "—"}
                    </Typography>
                  )}
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
            {isEditing 
              ? "ایمیل، نام و نام خانوادگی قابل ویرایش هستند. شماره موبایل قابل تغییر نیست."
              : "برای ویرایش اطلاعات پروفایل، روی دکمه ویرایش کلیک کنید"
            }
          </Typography>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default ProfilePage;
