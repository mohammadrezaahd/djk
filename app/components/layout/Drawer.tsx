import {
  Box,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SellIcon from "@mui/icons-material/Sell";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, useLocation } from "react-router";
import type { SvgIconComponent } from "@mui/icons-material";

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

interface SubMenuItem {
  id: string;
  title: string;
  path: string;
}

interface MenuItem {
  id: string;
  title: string;
  path?: string;
  icon: SvgIconComponent;
  expandable?: boolean;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    title: "داشبورد",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    id: "templates",
    title: "قالب ها",
    icon: WidgetsIcon,
    expandable: true,
    subItems: [
      {
        id: "templates-list",
        title: "تمام قالب ها",
        path: "/dashboard/templates/list",
      },
      {
        id: "templates-new",
        title: "افزودن قالب جدید",
        path: "/dashboard/templates/new",
      },
    ],
  },
  {
    id: "gallery",
    title: "گالری",
    path: "/dashboard/gallery",
    icon: PhotoLibraryIcon,
  },
  {
    id: "transportation",
    title: "انتقال محصول",
    path: "/dashboard/transportation",
    icon: LocalShippingIcon,
  },
  {
    id: "products",
    title: "محصولات",
    icon: SellIcon,
    expandable: true,
    subItems: [
      {
        id: "products-list",
        title: "تمام محصولات",
        path: "/dashboard/products/list",
      },
      {
        id: "products-new",
        title: "افزودن محصول جدید",
        path: "/dashboard/products/new",
      },
    ],
  },
];

interface DrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  desktopCollapsed: boolean;
  handleDesktopToggle: () => void;
  productTemplatesOpen: boolean;
  handleProductTemplatesClick: () => void;
  productsOpen: boolean;
  handleProductsClick: () => void;
  currentDrawerWidth: number;
}

const Drawer = ({
  mobileOpen,
  handleDrawerToggle,
  desktopCollapsed,
  handleDesktopToggle,
  productTemplatesOpen,
  handleProductTemplatesClick,
  productsOpen,
  handleProductsClick,
  currentDrawerWidth,
}: DrawerProps) => {
  const theme = useTheme();
  const location = useLocation();

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if menu item or its sub-items are active
  const isMenuItemActive = (item: MenuItem) => {
    if (item.path) {
      return isPathActive(item.path);
    }
    if (item.subItems) {
      return item.subItems.some((sub) => isPathActive(sub.path));
    }
    return false;
  };

  // Get open state based on menu item id
  const getOpenState = (itemId: string) => {
    if (itemId === "templates") return productTemplatesOpen;
    if (itemId === "products") return productsOpen;
    return false;
  };

  // Get click handler based on menu item id
  const getClickHandler = (itemId: string) => {
    if (itemId === "templates") return handleProductTemplatesClick;
    if (itemId === "products") return handleProductsClick;
    return undefined;
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
          <MenuOpenIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = isMenuItemActive(item);
          const isOpen = getOpenState(item.id);
          const handleClick = getClickHandler(item.id);

          return (
            <Box key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  component={item.path ? Link : "div"}
                  to={item.path}
                  onClick={handleClick}
                  sx={{
                    backgroundColor: isActive
                      ? theme.palette.action.selected
                      : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      ml: desktopCollapsed ? 0 : 1,
                      justifyContent: "center",
                      color: isActive ? theme.palette.primary.main : "inherit",
                    }}
                  >
                    <ItemIcon />
                  </ListItemIcon>
                  {!desktopCollapsed && (
                    <>
                      <ListItemText
                        primary={item.title}
                        sx={{
                          textAlign: "start",
                          "& .MuiListItemText-primary": {
                            color: isActive
                              ? theme.palette.primary.main
                              : "inherit",
                            fontWeight: isActive ? "bold" : "normal",
                          },
                        }}
                      />
                      {item.expandable &&
                        (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Sub Items */}
              {item.expandable && item.subItems && !desktopCollapsed && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      borderRight: (theme) =>
                        `2px solid ${theme.palette.divider}`,
                      marginRight: "2rem",
                      borderRadius: "0 2px 2px 0",
                    }}
                  >
                    {item.subItems.map((subItem) => {
                      const isSubActive = isPathActive(subItem.path);
                      return (
                        <ListItemButton
                          key={subItem.id}
                          sx={{
                            pl: 4,
                            backgroundColor: isSubActive
                              ? theme.palette.action.selected
                              : "transparent",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                          component={Link}
                          to={subItem.path}
                        >
                          <ListItemText
                            sx={{
                              textAlign: "start",
                              "& .MuiListItemText-primary": {
                                color: isSubActive
                                  ? theme.palette.primary.main
                                  : "inherit",
                                fontWeight: isSubActive ? "bold" : "normal",
                              },
                            }}
                            primary={subItem.title}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: currentDrawerWidth },
        flexShrink: { sm: 0 },
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <MuiDrawer
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
      </MuiDrawer>
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: currentDrawerWidth,
            right: 0,
            left: "auto",
            transition: (theme) =>
              theme.transitions.create("width", {
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
      </MuiDrawer>
    </Box>
  );
};

export default Drawer;
