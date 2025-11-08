import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { useLocation } from "react-router";
import Drawer from "./Drawer";
import MainContent from "./MainContent";
import AppBar from "./TopBar";
import PageTransition from "./PageTransition";

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [productTemplatesOpen, setProductTemplatesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Keep templates menu open if any child path is active
  React.useEffect(() => {
    if (isChildPathActive("/templates")) {
      setProductTemplatesOpen(true);
    }
    if (isChildPathActive("/products")) {
      setProductsOpen(true);
    }
  }, [location.pathname]);

  const currentDrawerWidth = desktopCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  // Helper function to check if any child path is active
  const isChildPathActive = (parentPath: string) => {
    return location.pathname.startsWith(parentPath + "/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed(!desktopCollapsed);
    // وقتی منو جمع می‌شود، زیرمنوها را ببندیم
    if (!desktopCollapsed) {
      setTemplatesOpen(false);
      setProductTemplatesOpen(false);
      setProductsOpen(false);
    }
  };

  const handleProductTemplatesClick = () => {
    if (desktopCollapsed) return; // در حالت collapsed کلیک نکند
    setProductTemplatesOpen(!productTemplatesOpen);
  };

  const handleProductsClick = () => {
    if (desktopCollapsed) return; // در حالت collapsed کلیک نکند
    setProductsOpen(!productsOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        currentDrawerWidth={currentDrawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        title={title}
      />

      <Drawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        desktopCollapsed={desktopCollapsed}
        handleDesktopToggle={handleDesktopToggle}
        productTemplatesOpen={productTemplatesOpen}
        handleProductTemplatesClick={handleProductTemplatesClick}
        productsOpen={productsOpen}
        handleProductsClick={handleProductsClick}
        currentDrawerWidth={currentDrawerWidth}
      />

      <MainContent currentDrawerWidth={currentDrawerWidth}>
        <PageTransition>
          {children}
        </PageTransition>
      </MainContent>
    </Box>
  );
};

export default Layout;
