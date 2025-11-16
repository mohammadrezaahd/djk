import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import {
  Add as AddIcon,
  Category,
  ViewList,
} from "@mui/icons-material";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader title="دسترسی سریع" />
      <CardContent>
        <List>
          <ListItem>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              href="/products/new"
            >
              افزودن محصول جدید
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="outlined"
              startIcon={<Category />}
              fullWidth
              href="/templates/new"
            >
              افزودن قالب جدید
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="outlined"
              startIcon={<ViewList />}
              fullWidth
              href="/products/list"
            >
              مشاهده همه محصولات
            </Button>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default QuickActions;