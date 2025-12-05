import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Stack,
} from "@mui/material";

import {
  ArchiveIcon,
  CheckIcon,
  StarIcon,
  AlarmIcon,
  AiIcon,
} from "../icons/IconComponents";

import type { IPricing } from "~/types/interfaces/pricing.interface";

interface PricingCardProps {
  plan: IPricing;
  isPopular?: boolean;
  onPurchase: (planId: number) => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isPopular = false,
  onPurchase,
  isLoading = false,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} سال${years > 1 ? "ه" : ""}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ماه${months > 1 ? "ه" : ""}`;
    } else {
      return `${days} روز`;
    }
  };

  const features = [
    {
      text: `حداکثر ${plan.max_products.toLocaleString("fa-IR")} محصول`,
      icon: <ArchiveIcon />,
      included: true,
    },
    {
      text: `${plan.ai_usage_limit.toLocaleString("fa-IR")} استفاده از هوش مصنوعی`,
      icon: <AiIcon />,
      included: true,
    },
    {
      text: `اعتبار ${formatDuration(plan.duration_days)}`,
      icon: <AlarmIcon />,
      included: true,
    },
    {
      text: "پشتیبانی آنلاین ۲۴/۷",
      icon: <CheckIcon />,
      included: true,
    },
    {
      text: "آپدیت‌های رایگان",
      icon: <CheckIcon />,
      included: true,
    },
  ];

  // Calculate daily cost for better understanding
  const dailyCost = Math.round(plan.price_toman / plan.duration_days);

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "visible",
        background: isPopular
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "background.paper",
        color: isPopular ? "white" : "text.primary",
        border: isPopular ? "none" : "1px solid",
        borderColor: isPopular ? "transparent" : "grey.300",
        boxShadow: isPopular
          ? "0 16px 32px rgba(102, 126, 234, 0.3)"
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isPopular ? "scale(1.05)" : "scale(1)",
        "&:hover": {
          transform: isPopular ? "scale(1.08)" : "scale(1.02)",
          boxShadow: isPopular
            ? "0 20px 40px rgba(102, 126, 234, 0.4)"
            : "0 8px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <Box
          sx={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <Chip
            label="محبوب‌ترین انتخاب"
            icon={<StarIcon />}
            sx={{
              background: "linear-gradient(45deg, #FF6B35, #F7931E)",
              color: "white",
              fontWeight: 700,
              px: 2,
              py: 0.5,
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
              "& .MuiChip-icon": {
                color: "white",
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
        {/* Plan Header */}
        <Box sx={{ textAlign: "right", mb: 4 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 800,
              color: isPopular ? "rgba(255, 255, 255, 0.95)" : "text.primary",
              mb: 1,
              letterSpacing: "-0.5px",
            }}
          >
            {plan.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isPopular ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            {plan.description}
          </Typography>
        </Box>

        {/* Pricing */}
        <Box sx={{ textAlign: "right", mb: 4 }}>
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="flex-end"
            spacing={1}
          >
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontWeight: 900,
                color: isPopular ? "white" : "primary.main",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {formatPrice(plan.price_toman)}
            </Typography>
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: isPopular
                  ? "rgba(255, 255, 255, 0.8)"
                  : "text.secondary",
                fontWeight: 600,
              }}
            >
              تومان
            </Typography>
          </Stack>

          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: isPopular
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
                fontWeight: 500,
              }}
            >
              برای {formatDuration(plan.duration_days)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isPopular ? "rgba(255, 255, 255, 0.6)" : "text.disabled",
                display: "block",
                mt: 0.5,
              }}
            >
              معادل {formatPrice(dailyCost)} تومان در روز
            </Typography>
          </Box>
        </Box>

        {/* Features List */}
        <List sx={{ p: 0, mb: 2, direction: "rtl" }}>
          {features.map((feature, index) => (
            <ListItem
              key={index}
              sx={{ px: 0, py: 1, flexDirection: "row-reverse" }}
            >
              <ListItemIcon sx={{ minWidth: 32, justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isPopular
                      ? "rgba(255, 255, 255, 0.2)"
                      : "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: isPopular ? "blur(10px)" : "none",
                  }}
                >
                  <CheckIcon
                    style={{
                      color: isPopular ? "white" : "white",
                      fontSize: 16,
                    }}
                  />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={feature.text}
                sx={{
                  textAlign: "right",
                  "& .MuiListItemText-primary": {
                    fontSize: "0.9rem",
                    color: isPopular
                      ? "rgba(255, 255, 255, 0.9)"
                      : "text.primary",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Action Button */}
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant={isPopular ? "contained" : "outlined"}
          color={isPopular ? "inherit" : "primary"}
          fullWidth
          size="large"
          onClick={() => onPurchase(plan.id)}
          disabled={isLoading}
          sx={{
            height: 54,
            borderRadius: 2.5,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            position: "relative",
            background: isPopular ? "rgba(255, 255, 255, 0.15)" : "transparent",
            backdropFilter: isPopular ? "blur(10px)" : "none",
            border: "2px solid",
            borderColor: isPopular
              ? "rgba(255, 255, 255, 0.3)"
              : "primary.main",
            color: isPopular ? "white" : "primary.main",
            "&:hover": {
              background: isPopular
                ? "rgba(255, 255, 255, 0.25)"
                : "primary.main",
              color: "white",
              borderColor: isPopular
                ? "rgba(255, 255, 255, 0.4)"
                : "primary.main",
              transform: "translateY(-2px)",
              boxShadow: isPopular
                ? "0 8px 20px rgba(255, 255, 255, 0.2)"
                : "0 8px 20px rgba(102, 126, 234, 0.3)",
            },
            "&:disabled": {
              background: isPopular
                ? "rgba(255, 255, 255, 0.1)"
                : "action.disabledBackground",
              color: isPopular ? "rgba(255, 255, 255, 0.5)" : "action.disabled",
              borderColor: isPopular
                ? "rgba(255, 255, 255, 0.2)"
                : "action.disabled",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "شروع استفاده"
          )}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PricingCard;
