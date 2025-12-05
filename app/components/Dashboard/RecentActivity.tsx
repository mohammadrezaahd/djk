import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  Skeleton,
} from "@mui/material";

import { ArchiveIcon, TemplateIcon, ImageIcon } from "../icons/IconComponents";
interface ActivityItem {
  id: number;
  type: "product" | "image" | "template" | "category";
  title: string;
  description?: string;
  timestamp?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  isLoading = false,
}) => {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "product":
        return <ArchiveIcon />;
      case "image":
        return <ImageIcon />;
      case "template":
        return <TemplateIcon />;
      case "category":
        return <ArchiveIcon />;
      default:
        return <ArchiveIcon />;
    }
  };

  const getColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "product":
        return "#6C5CE7";
      case "image":
        return "#00CEC9";
      case "template":
        return "#FDA7DC";
      case "category":
        return "#FDCB6E";
      default:
        return "#6C5CE7";
    }
  };

  const getTypeLabel = (type: ActivityItem["type"]) => {
    switch (type) {
      case "product":
        return "محصول";
      case "image":
        return "تصویر";
      case "template":
        return "قالب";
      case "category":
        return "دسته‌بندی";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            فعالیت‌های اخیر
          </Typography>
          <List>
            {[1, 2, 3, 4].map((item) => (
              <ListItem key={item}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton width="60%" />}
                  secondary={<Skeleton width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          فعالیت‌های اخیر
        </Typography>
        {activities.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">فعالیتی ثبت نشده است</Typography>
          </Box>
        ) : (
          <List sx={{ pt: 0 }}>
            {activities.slice(0, 5).map((activity, index) => (
              <ListItem
                key={activity.id}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: `${getColor(activity.type)}15`,
                      color: getColor(activity.type),
                    }}
                  >
                    {getIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          flex: 1,
                          minWidth: "150px",
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Chip
                        label={getTypeLabel(activity.type)}
                        size="small"
                        sx={{
                          backgroundColor: `${getColor(activity.type)}15`,
                          color: getColor(activity.type),
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  }
                  secondary={activity.description || `شناسه: ${activity.id}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
