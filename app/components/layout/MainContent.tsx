import React from "react";
import { Box, Toolbar, useTheme } from "@mui/material";

interface MainContentProps {
  children: React.ReactNode;
  currentDrawerWidth: number;
}

const MainContent = ({ children, currentDrawerWidth }: MainContentProps) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        width: "100%",
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar />
      {children}
    </Box>
  );
};

export default MainContent;
