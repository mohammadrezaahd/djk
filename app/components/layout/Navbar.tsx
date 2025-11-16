import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useLogout } from "../../api/auth.api";

const Navbar = () => {
  const logoutMutation = useLogout();
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DJK
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          خروج
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;