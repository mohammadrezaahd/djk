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

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

interface DrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  desktopCollapsed: boolean;
  handleDesktopToggle: () => void;
  productTemplatesOpen: boolean;
  handleProductTemplatesClick: () => void;
  currentDrawerWidth: number;
}

const Drawer = ({
  mobileOpen,
  handleDrawerToggle,
  desktopCollapsed,
  handleDesktopToggle,
  productTemplatesOpen,
  handleProductTemplatesClick,
  currentDrawerWidth,
}: DrawerProps) => {
  const theme = useTheme();
  const location = useLocation();

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    return location.pathname === path;
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
        {/* داشبورد */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              backgroundColor:
                isPathActive("/") && location.pathname === "/"
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
                color:
                  isPathActive("/") && location.pathname === "/"
                    ? theme.palette.primary.main
                    : "inherit",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText
                primary="داشبورد"
                sx={{
                  textAlign: "start",
                  "& .MuiListItemText-primary": {
                    color:
                      isPathActive("/") && location.pathname === "/"
                        ? theme.palette.primary.main
                        : "inherit",
                    fontWeight:
                      isPathActive("/") && location.pathname === "/"
                        ? "bold"
                        : "normal",
                  },
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
              backgroundColor: isPathActive("/templates")
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
                color: isPathActive("/templates")
                  ? theme.palette.primary.main
                  : "inherit",
              }}
            >
              <WidgetsIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <>
                <ListItemText
                  primary="قالب ها"
                  sx={{
                    textAlign: "start",
                    "& .MuiListItemText-primary": {
                      color: isPathActive("/templates")
                        ? theme.palette.primary.main
                        : "inherit",
                      fontWeight: isPathActive("/templates")
                        ? "bold"
                        : "normal",
                    },
                  }}
                />
                {productTemplatesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                  backgroundColor: isPathActive("/templates/list")
                    ? theme.palette.action.selected
                    : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                component={Link}
                to="/templates/list"
              >
                <ListItemText
                  sx={{
                    textAlign: "start",
                    "& .MuiListItemText-primary": {
                      color: isPathActive("/templates/list")
                        ? theme.palette.primary.main
                        : "inherit",
                      fontWeight: isPathActive("/templates/list")
                        ? "bold"
                        : "normal",
                    },
                  }}
                  primary="تمام قالب ها"
                />
              </ListItemButton>
              <ListItemButton
                sx={{
                  pl: 4,
                  backgroundColor: isPathActive("/templates/new")
                    ? theme.palette.action.selected
                    : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                component={Link}
                to="/templates/new"
              >
                <ListItemText
                  sx={{
                    textAlign: "start",
                    "& .MuiListItemText-primary": {
                      color: isPathActive("/templates/attrs/new")
                        ? theme.palette.primary.main
                        : "inherit",
                      fontWeight: isPathActive("/templates/attrs/new")
                        ? "bold"
                        : "normal",
                    },
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
              backgroundColor: isPathActive("/gallery")
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
                color: isPathActive("/gallery")
                  ? theme.palette.primary.main
                  : "inherit",
              }}
            >
              <PhotoLibraryIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText
                primary="گالری"
                sx={{
                  textAlign: "start",
                  "& .MuiListItemText-primary": {
                    color: isPathActive("/gallery")
                      ? theme.palette.primary.main
                      : "inherit",
                    fontWeight: isPathActive("/gallery") ? "bold" : "normal",
                  },
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
              backgroundColor: isPathActive("/shipping")
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
                color: isPathActive("/shipping")
                  ? theme.palette.primary.main
                  : "inherit",
              }}
            >
              <LocalShippingIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText
                primary="انتقال محصول"
                sx={{
                  textAlign: "start",
                  "& .MuiListItemText-primary": {
                    color: isPathActive("/shipping")
                      ? theme.palette.primary.main
                      : "inherit",
                    fontWeight: isPathActive("/shipping") ? "bold" : "normal",
                  },
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
              backgroundColor: isPathActive("/product")
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
                color: isPathActive("/product")
                  ? theme.palette.primary.main
                  : "inherit",
              }}
            >
              <SellIcon />
            </ListItemIcon>
            {!desktopCollapsed && (
              <ListItemText
                primary="محصولات"
                sx={{
                  textAlign: "start",
                  "& .MuiListItemText-primary": {
                    color: isPathActive("/product")
                      ? theme.palette.primary.main
                      : "inherit",
                    fontWeight: isPathActive("/product") ? "bold" : "normal",
                  },
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
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
