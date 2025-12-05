import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import { Link } from "react-router";

import { UserIcon, MenuBars } from "../icons/IconComponents";

const Header: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { title: "خانه", href: "/" },
    { title: "درباره ما", href: "/about" },
    { title: "ویژگی‌ها", href: "/features" },
    { title: "راهنما", href: "/help" },
    { title: "پشتیبانی", href: "/support" },
    { title: "تماس با ما", href: "/contact" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* لوگو و نام برند */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              component="img"
              src="/Hoshmarket.png"
              alt="هوش مارکت"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
              }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: "1.5rem",
              }}
            >
              هوش مارکت
            </Typography>
          </Box>

          {/* منوی دسکتاپ */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                to={link.href}
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* دکمه‌های عمل */}
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              component={Link}
              to="/auth"
              variant="outlined"
              startIcon={<UserIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              ورود / ثبت نام
            </Button>

            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              ورود به مارکت
            </Button>

            {/* منوی موبایل */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: theme.palette.text.primary,
              }}
              onClick={handleMenuOpen}
            >
              <MenuBars />
            </IconButton>
          </Box>

          {/* منوی کشویی موبایل */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: 2 }}
          >
            {navLinks.map((link) => (
              <MenuItem
                key={link.href}
                onClick={handleMenuClose}
                component={Link}
                to={link.href}
              >
                {link.title}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
