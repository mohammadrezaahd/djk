import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
  Badge,
  Chip,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";

import {
  SettingsIcon,
  NotificationIcon,
  HelpIcon,
  LogoutIcon,
  AccountIcon,
  ShieldIcon,
  SupportIcon,
} from "../icons/IconComponents";

import { useNavigate } from "react-router";
import { useLogout } from "~/api/auth.api";
import { useProfile } from "~/api/profile.api";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setUser, clearUser } from "~/store/slices/userSlice";
import { useSnackbar } from "notistack";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  // دریافت اطلاعات کاربر از store
  const currentUser = useAppSelector((state) => state.user.currentUser);

  // دریافت اطلاعات کاربر از API
  const { data: userData, isSuccess } = useProfile();

  // ذخیره اطلاعات کاربر در store
  useEffect(() => {
    if (isSuccess && userData?.data) {
      dispatch(setUser(userData.data));
    }
  }, [isSuccess, userData, dispatch]);

  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();

    try {
      enqueueSnackbar("در حال خروج از حساب کاربری...", { variant: "info" });
      await logout();

      // پاک کردن اطلاعات کاربر از store
      dispatch(clearUser());

      enqueueSnackbar("با موفقیت از حساب خارج شدید", { variant: "success" });

      // هدایت به صفحه ورود
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Logout error:", error);
      enqueueSnackbar("خطا در خروج از حساب کاربری", { variant: "error" });
    }
  };

  const handleNavigation = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Notifications */}
      <Tooltip title="اعلان‌ها" arrow>
        <IconButton
          onClick={handleNotifMenuOpen}
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Help */}
      <Tooltip title="راهنما" arrow>
        <IconButton
          onClick={() => navigate("/dashboard/help")}
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>

      {/* Support */}
      <Tooltip title="پشتیبانی" arrow>
        <IconButton
          onClick={() => navigate("/dashboard/ticketing")}
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <SupportIcon />
        </IconButton>
      </Tooltip>

      {/* Profile */}
      <Tooltip title="پروفایل" arrow>
        <IconButton
          onClick={handleProfileMenuOpen}
          sx={{
            ml: 1,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {currentUser?.first_name?.[0]?.toUpperCase() ||
              currentUser?.email?.[0]?.toUpperCase() ||
              "U"}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 2,
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
            >
              {currentUser?.first_name?.[0]?.toUpperCase() ||
                currentUser?.email?.[0]?.toUpperCase() ||
                "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {currentUser?.first_name && currentUser?.last_name
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : "کاربر محترم"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                {currentUser?.email || currentUser?.phone || "بدون اطلاعات"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem
          onClick={() => handleNavigation("/dashboard/profile")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <AccountIcon size={20} />
          </ListItemIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>پروفایل من</Typography>
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigation("/settings")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon size={20} />
          </ListItemIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>تنظیمات</Typography>
            <Chip label="به زودی" size="small" color="primary" />
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigation("/security")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <ShieldIcon size={20} />
          </ListItemIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>امنیت و حریم خصوصی</Typography>
            <Chip label="به زودی" size="small" color="primary" />
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigation("/dashboard/pricing")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>اشتراک فعال ندارید</Typography>
            <Chip label="برای خرید اشتراک" size="small" color="warning" />
          </Box>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            py: 1.5,
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon size={20} color="error" />
          </ListItemIcon>
          <Typography>
            {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
          </Typography>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 2,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            اعلان‌ها
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={handleNotifClose}
          sx={{
            py: 2,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            محصول جدید اضافه شد
          </Typography>
          <Typography variant="caption" color="text.secondary">
            2 ساعت پیش
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleNotifClose}
          sx={{
            py: 2,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            قالب جدید ایجاد شد
          </Typography>
          <Typography variant="caption" color="text.secondary">
            5 ساعت پیش
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleNotifClose}
          sx={{
            py: 2,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            تصویر جدید آپلود شد
          </Typography>
          <Typography variant="caption" color="text.secondary">
            1 روز پیش
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar;
