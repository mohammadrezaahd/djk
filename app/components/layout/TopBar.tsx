import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface AppBarProps {
  currentDrawerWidth: number;
  handleDrawerToggle: () => void;
  title?: string;
}

const TopBar = ({ currentDrawerWidth, handleDrawerToggle, title = "پنل مدیریت" }: AppBarProps) => {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
        mr: { sm: `${currentDrawerWidth}px` },
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
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
    </MuiAppBar>
  );
};

export default TopBar;
