import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Article,
  Widgets,
  PhotoLibrary,
  LocalShipping,
  Sell,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link } from "react-router";

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [productTemplatesOpen, setProductTemplatesOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTemplatesClick = () => {
    setTemplatesOpen(!templatesOpen);
  };

  const handleProductTemplatesClick = () => {
    setProductTemplatesOpen(!productTemplatesOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          منو
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {/* قالب اطلاعات */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleTemplatesClick}>
            <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
              <Article />
            </ListItemIcon>
            <ListItemText primary="قالب اطلاعات" sx={{ textAlign: "start" }} />
            {templatesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={templatesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="تمام قالب ها" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="افزودن قالب جدید" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* قالب محصول */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleProductTemplatesClick}>
            <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
              <Widgets />
            </ListItemIcon>
            <ListItemText primary="قالب محصول" sx={{ textAlign: "start" }} />
            {productTemplatesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={productTemplatesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="تمام قالب ها" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/templates/attrs/new"
            >
              <ListItemText primary="افزودن قالب جدید" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* گالری */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
              <PhotoLibrary />
            </ListItemIcon>
            <ListItemText primary="گالری" sx={{ textAlign: "start" }} />
          </ListItemButton>
        </ListItem>

        {/* انتقال محصول */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary="انتقال محصول" sx={{ textAlign: "start" }} />
          </ListItemButton>
        </ListItem>

        {/* محصولات */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
              <Sell />
            </ListItemIcon>
            <ListItemText primary="محصولات" sx={{ textAlign: "start" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            پنل مدیریت
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          anchor="right"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              right: 0,
              left: "auto",
            },
          }}
          anchor="right"
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          marginLeft: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
