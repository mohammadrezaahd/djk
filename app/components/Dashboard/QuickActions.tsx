import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Inventory as ProductIcon,
  Image as ImageIcon,
  Widgets as TemplateIcon,
  Category as CategoryIcon,
  Speed as QuickIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "محصول سریع",
      icon: QuickIcon,
      color: "#FF6B6B",
      path: "/dashboard/products/quick",
    },
    {
      label: "محصول جدید",
      icon: ProductIcon,
      color: "#6C5CE7",
      path: "/dashboard/products/new",
    },
    {
      label: "آپلود تصویر",
      icon: ImageIcon,
      color: "#00CEC9",
      path: "/dashboard/gallery",
    },
    {
      label: "قالب جدید",
      icon: TemplateIcon,
      color: "#FDA7DC",
      path: "/dashboard/templates/new",
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          دسترسی سریع
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outlined"
                fullWidth
                onClick={() => navigate(action.path)}
                sx={{
                  py: 2,
                  borderColor: `${action.color}40`,
                  color: action.color,
                  "&:hover": {
                    borderColor: action.color,
                    backgroundColor: `${action.color}10`,
                  },
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Icon sx={{ fontSize: 32 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {action.label}
                </Typography>
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
