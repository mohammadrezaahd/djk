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
        border: isPopular ? 2 : 1,
        borderColor: isPopular ? "primary.main" : "divider",
        borderRadius: 3,
        overflow: "visible",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: (theme) =>
            isPopular
              ? `0 20px 40px ${theme.palette.primary.main}40`
              : theme.shadows[10],
        },
      }}
    >
      {isPopular && (
        <Chip
          label="محبوب‌ترین"
          icon={<StarIcon />}
          sx={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
            px: 2,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: isPopular ? "primary.main" : "text.primary",
              mb: 1,
            }}
          >
            {plan.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            {plan.description}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontWeight: 800,
                color: isPopular ? "primary.main" : "text.primary",
              }}
            >
              {formatPrice(plan.price_toman)}
            </Typography>
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: "text.secondary",
                mr: 1,
              }}
            >
              تومان
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            برای {formatDuration(plan.duration_days)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ p: 0 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon
                  sx={{
                    color: feature.included ? "success.main" : "text.disabled",
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={feature.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.95rem",
                    color: feature.included ? "text.primary" : "text.disabled",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant={isPopular ? "contained" : "outlined"}
          color="primary"
          fullWidth
          size="large"
          onClick={() => onPurchase(plan.id)}
          disabled={isLoading}
          sx={{
            height: 48,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "1rem",
            position: "relative",
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