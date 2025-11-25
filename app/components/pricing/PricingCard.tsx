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
  Divider,
  CircularProgress,
} from "@mui/material";
import { Check as CheckIcon, Star as StarIcon } from "@mui/icons-material";
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
      return `${Math.floor(days / 365)} سال`;
    } else if (days >= 30) {
      return `${Math.floor(days / 30)} ماه`;
    } else {
      return `${days} روز`;
    }
  };

  const features = [
    {
      text: `حداکثر ${plan.max_products.toLocaleString("fa-IR")} محصول`,
      included: true,
    },
    {
      text: `${plan.ai_usage_limit.toLocaleString("fa-IR")} استفاده از هوش مصنوعی`,
      included: true,
    },
    {
      text: `اعتبار ${formatDuration(plan.duration_days)}`,
      included: true,
    },
    {
      text: "پشتیبانی ۲۴ ساعته",
      included: true,
    },
  ];

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: isPopular ? 0 : 1,
        borderColor: "divider",
        borderRadius: 4,
        overflow: "visible",
        background: isPopular
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "background.paper",
        color: isPopular ? "white" : "text.primary",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-12px)",
          boxShadow: isPopular
            ? "0 25px 50px rgba(102, 126, 234, 0.4)"
            : "0 25px 50px rgba(0, 0, 0, 0.15)",
        },
        "&::before": isPopular
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "inherit",
              zIndex: -1,
            }
          : {},
      }}
    >
      {isPopular && (
        <Chip
          label="محبوب‌ترین"
          icon={<StarIcon />}
          sx={{
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(45deg, #FF6B35, #F7931E)",
            color: "white",
            fontWeight: 700,
            px: 3,
            py: 0.5,
            height: 32,
            zIndex: 2,
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
            "& .MuiChip-icon": {
              color: "white",
            },
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: isPopular ? "rgba(255, 255, 255, 0.95)" : "text.primary",
              mb: 1.5,
              letterSpacing: "-0.5px",
            }}
          >
            {plan.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isPopular ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {plan.description}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", mb: 1 }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontWeight: 800,
                color: isPopular ? "rgba(255, 255, 255, 0.95)" : "primary.main",
                letterSpacing: "-1px",
              }}
            >
              {formatPrice(plan.price_toman)}
            </Typography>
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: isPopular ? "rgba(255, 255, 255, 0.8)" : "text.secondary",
                mr: 1,
                fontWeight: 500,
              }}
            >
              تومان
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isPopular ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            برای {formatDuration(plan.duration_days)}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: 1,
            background: isPopular
              ? "rgba(255, 255, 255, 0.2)"
              : "divider",
            mb: 3,
          }}
        />

        <List sx={{ p: 0 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: isPopular
                      ? "rgba(255, 255, 255, 0.2)"
                      : "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon
                    sx={{
                      color: isPopular ? "white" : "white",
                      fontSize: 16,
                    }}
                  />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={feature.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.95rem",
                    color: isPopular ? "rgba(255, 255, 255, 0.9)" : "text.primary",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <CardActions sx={{ p: 4, pt: 0 }}>
        <Button
          variant={isPopular ? "contained" : "outlined"}
          color={isPopular ? "inherit" : "primary"}
          fullWidth
          size="large"
          onClick={() => onPurchase(plan.id)}
          disabled={isLoading}
          sx={{
            height: 56,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "1rem",
            position: "relative",
            background: isPopular
              ? "rgba(255, 255, 255, 0.15)"
              : "transparent",
            backdropFilter: isPopular ? "blur(10px)" : "none",
            border: isPopular
              ? "2px solid rgba(255, 255, 255, 0.3)"
              : "2px solid",
            borderColor: isPopular ? "transparent" : "primary.main",
            color: isPopular ? "white" : "primary.main",
            textTransform: "none",
            "&:hover": {
              background: isPopular
                ? "rgba(255, 255, 255, 0.25)"
                : "primary.main",
              color: isPopular ? "white" : "white",
              borderColor: isPopular ? "transparent" : "primary.main",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: isPopular
                ? "rgba(255, 255, 255, 0.1)"
                : "action.disabledBackground",
              color: isPopular
                ? "rgba(255, 255, 255, 0.5)"
                : "action.disabled",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "خرید اشتراک"
          )}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PricingCard;