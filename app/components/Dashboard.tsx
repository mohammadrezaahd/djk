import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { Add, Edit, Image, AddCircle } from "@mui/icons-material";

const Dashboard = () => {
  const recentActivities = [
    {
      icon: <Add />,
      title: "محصول جدید اضافه شد",
      time: "2 دقیقه پیش",
      color: "primary",
    },
    {
      icon: <Edit />,
      title: "قالب محصول ویرایش شد",
      time: "1 ساعت پیش",
      color: "info",
    },
    {
      icon: <Image />,
      title: "تصویر جدید در گالری آپلود شد",
      time: "5 ساعت پیش",
      color: "success",
    },
  ];

  return (
    <>
      {/* Stats Cards */}
      {/* <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                تعداد کل محصولات
              </Typography>
              <Typography variant="h4" component="div">
                1,234
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                قالب‌های اطلاعات
              </Typography>
              <Typography variant="h4" component="div">
                56
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Recent Activities */}
      {/* <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="div">
              فعالیت‌های اخیر
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              مشاهده همه
            </Typography>
          </Box>
          <List>
            {recentActivities.map((activity, index) => (
              <ListItem
                key={index}
                divider={index < recentActivities.length - 1}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: `${activity.color}.main`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={activity.time}
                  sx={{
                    textAlign: "right",
                    "& .MuiListItemText-primary": {
                      textAlign: "right",
                    },
                    "& .MuiListItemText-secondary": {
                      textAlign: "right",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card> */}

      {/* Quick Actions */}
      {/* <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            اقدامات سریع
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            برای شروع، یک محصول جدید اضافه کنید.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddCircle />}
            size="large"
            sx={{ py: 1.5 }}
          >
            افزودن محصول جدید
          </Button>
        </CardContent>
      </Card> */}
      <div>HI</div>
    </>
  );
};

export default Dashboard;
