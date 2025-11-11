import React, { useState } from "react";
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
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useLogout } from "~/api/auth.api";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const { mutateAsync: logout } = useLogout();

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
    await logout();
    navigate("/auth");
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
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Help */}
      <Tooltip title="راهنما" arrow>
        <IconButton
          onClick={() => navigate("/help")}
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
            م
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
              م
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                کاربر محترم
              </Typography>
              <Typography variant="body2" color="text.secondary">
                admin@example.com
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem
          onClick={() => handleNavigation("/profile")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>پروفایل من</Typography>
            <Chip label="به زودی" size="small" color="primary" />
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
            <SettingsIcon fontSize="small" />
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
            <ShieldIcon fontSize="small" />
          </ListItemIcon>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography>امنیت و حریم خصوصی</Typography>
            <Chip label="به زودی" size="small" color="primary" />
          </Box>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography>خروج از حساب</Typography>
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
