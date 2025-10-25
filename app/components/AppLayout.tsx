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
  Menu,
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
  ChevronLeft,
  ChevronRight,
  MenuOpen,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router";

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [productTemplatesOpen, setProductTemplatesOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Keep templates menu open if any child path is active
  React.useEffect(() => {
    if (isChildPathActive('/templates')) {
      setProductTemplatesOpen(true);
    }
  }, [location.pathname]);

  const currentDrawerWidth = desktopCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed(!desktopCollapsed);
    // وقتی منو جمع می‌شود، زیرمنوها را ببندیم
    if (!desktopCollapsed) {
      setTemplatesOpen(false);
      setProductTemplatesOpen(false);
    }
  };

  const handleTemplatesClick = () => {
    if (desktopCollapsed) return; // در حالت collapsed کلیک نکند
    setTemplatesOpen(!templatesOpen);
  };

  const handleProductTemplatesClick = () => {
    if (desktopCollapsed) return; // در حالت collapsed کلیک نکند
    setProductTemplatesOpen(!productTemplatesOpen);
  };

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    return location.pathname === path;
  };

  // Helper function to check if any child path is active
  const isChildPathActive = (parentPath: string) => {
    return location.pathname.startsWith(parentPath + '/');
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{ justifyContent: desktopCollapsed ? "center" : "space-between" }}
      >
        {!desktopCollapsed && (
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            منو
          </Typography>
        )}
        <IconButton
          onClick={handleDesktopToggle}
          sx={{
            display: {
              xs: "none",
              sm: "flex",
              marginLeft: desktopCollapsed ? 0 : "-5px",
            },
          }}
        >
          <MenuOpen />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {/* داشبورد */}
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/"
            sx={{
              backgroundColor: isPathActive('/') && location.pathname === '/' ? 
                theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                ml: desktopCollapsed ? 0 : 1,
                justifyContent: "center",
                color: isPathActive('/') && location.pathname === '/' ? 
                  theme.palette.primary.main : 'inherit',
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText 
                primary="داشبورد" 
                sx={{ 
                  textAlign: "start",
                  '& .MuiListItemText-primary': {
                    color: isPathActive('/') && location.pathname === '/' ? 
                      theme.palette.primary.main : 'inherit',
                    fontWeight: isPathActive('/') && location.pathname === '/' ? 
                      'bold' : 'normal',
                  }
                }} 
              />
            )}
          </ListItemButton>
        </ListItem>

        {/* قالب ها */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleProductTemplatesClick}
            sx={{
              backgroundColor: isPathActive('/templates') ? 
                theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                ml: desktopCollapsed ? 0 : 1,
                justifyContent: "center",
                color: isPathActive('/templates') ? 
                  theme.palette.primary.main : 'inherit',
              }}
            >
              <Widgets />
            </ListItemIcon>
            {!desktopCollapsed && (
              <>
                <ListItemText 
                  primary="قالب ها" 
                  sx={{ 
                    textAlign: "start",
                    '& .MuiListItemText-primary': {
                      color: isPathActive('/templates') ? 
                        theme.palette.primary.main : 'inherit',
                      fontWeight: isPathActive('/templates') ? 
                        'bold' : 'normal',
                    }
                  }} 
                />
                {productTemplatesOpen ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        {!desktopCollapsed && (
          <Collapse in={productTemplatesOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                borderRight: "2px solid #e7e6e6",
                marginRight: "2rem",
                borderRadius: "0 2px 2px 0",
              }}
            >
              <ListItemButton 
                sx={{ 
                  pl: 4,
                  backgroundColor: isPathActive('/templates') ? 
                    theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                component={Link}
                to="/templates"
              >
                <ListItemText
                  sx={{ 
                    textAlign: "start",
                    '& .MuiListItemText-primary': {
                      color: isPathActive('/templates') ? 
                        theme.palette.primary.main : 'inherit',
                      fontWeight: isPathActive('/templates') ? 
                        'bold' : 'normal',
                    }
                  }}
                  primary="تمام قالب ها"
                />
              </ListItemButton>
              <ListItemButton
                sx={{ 
                  pl: 4,
                  backgroundColor: isPathActive('/templates/attrs/new') ? 
                    theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                component={Link}
                to="/templates/attrs/new"
              >
                <ListItemText
                  sx={{ 
                    textAlign: "start",
                    '& .MuiListItemText-primary': {
                      color: isPathActive('/templates/attrs/new') ? 
                        theme.palette.primary.main : 'inherit',
                      fontWeight: isPathActive('/templates/attrs/new') ? 
                        'bold' : 'normal',
                    }
                  }}
                  primary="افزودن قالب جدید"
                />
              </ListItemButton>
            </List>
          </Collapse>
        )}

        {/* گالری */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/gallery"
            sx={{
              backgroundColor: isPathActive('/gallery') ? 
                theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                ml: desktopCollapsed ? 0 : 1,
                justifyContent: "center",
                color: isPathActive('/gallery') ? 
                  theme.palette.primary.main : 'inherit',
              }}
            >
              <PhotoLibrary />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText 
                primary="گالری" 
                sx={{ 
                  textAlign: "start",
                  '& .MuiListItemText-primary': {
                    color: isPathActive('/gallery') ? 
                      theme.palette.primary.main : 'inherit',
                    fontWeight: isPathActive('/gallery') ? 
                      'bold' : 'normal',
                  }
                }} 
              />
            )}
          </ListItemButton>
        </ListItem>

        {/* انتقال محصول */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/shipping"
            sx={{
              backgroundColor: isPathActive('/shipping') ? 
                theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                ml: desktopCollapsed ? 0 : 1,
                justifyContent: "center",
                color: isPathActive('/shipping') ? 
                  theme.palette.primary.main : 'inherit',
              }}
            >
              <LocalShipping />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText
                primary="انتقال محصول"
                sx={{ 
                  textAlign: "start",
                  '& .MuiListItemText-primary': {
                    color: isPathActive('/shipping') ? 
                      theme.palette.primary.main : 'inherit',
                    fontWeight: isPathActive('/shipping') ? 
                      'bold' : 'normal',
                  }
                }}
              />
            )}
          </ListItemButton>
        </ListItem>

        {/* محصولات */}
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/product"
            sx={{
              backgroundColor: isPathActive('/product') ? 
                theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "auto",
                ml: desktopCollapsed ? 0 : 1,
                justifyContent: "center",
                color: isPathActive('/product') ? 
                  theme.palette.primary.main : 'inherit',
              }}
            >
              <Sell />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText 
                primary="محصولات" 
                sx={{ 
                  textAlign: "start",
                  '& .MuiListItemText-primary': {
                    color: isPathActive('/product') ? 
                      theme.palette.primary.main : 'inherit',
                    fontWeight: isPathActive('/product') ? 
                      'bold' : 'normal',
                  }
                }} 
              />
            )}
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
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          mr: { sm: `${currentDrawerWidth}px` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
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
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
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
              right: 0,
              left: "auto",
            },
          }}
          anchor="left"
          PaperProps={{
            sx: {
              right: 0,
              left: "auto",
              transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              right: 0,
              left: "auto",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
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
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
