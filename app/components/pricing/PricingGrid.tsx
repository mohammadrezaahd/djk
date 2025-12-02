import React from "react";
import { Grid, Box, Alert, Typography } from "@mui/material";
import PricingCard from "./PricingCard";
import { PricingGridSkeleton } from "./PricingSkeleton";
import type { IPricing } from "~/types/interfaces/pricing.interface";

interface PricingGridProps {
  plans: IPricing[];
  isLoading?: boolean;
  error?: string;
  onPurchase: (planId: number) => void;
  purchaseLoading?: boolean;
}

const PricingGrid: React.FC<PricingGridProps> = ({
  plans,
  isLoading = false,
  error,
  onPurchase,
  purchaseLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <PricingGridSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 4,
          borderRadius: 2,
          textAlign: "center",
          fontSize: "1rem",
        }}
      >
        خطا در بارگذاری پلان‌های اشتراک: {error}
      </Alert>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 4,
          backgroundColor: "grey.50",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            mb: 2,
            fontWeight: 500,
          }}
        >
          در حال حاضر پلان اشتراکی موجود نیست
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          لطفاً بعداً مراجعه کنید یا با پشتیبانی تماس بگیرید
        </Typography>
      </Box>
    );
  }

  // Determine popular plan based on criteria
  const getPopularPlanIndex = () => {
    if (plans.length <= 2) return plans.length - 1;
    if (plans.length === 3) return 1; // Middle plan for 3 plans
    return Math.floor(plans.length / 2); // Middle plan for more plans
  };

  const popularPlanIndex = getPopularPlanIndex();

  return (
    <Box sx={{ py: 2 }}>
      {/* Pricing Cards */}
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {plans.map((plan, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}
            key={plan.id}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <PricingCard
                plan={plan}
                isPopular={index === popularPlanIndex}
                onPurchase={onPurchase}
                isLoading={purchaseLoading}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Additional Info */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          textAlign: "center",
          backgroundColor: "primary.light",
          borderRadius: 2,
          color: "primary.contrastText",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          💡 نیاز به مشاوره دارید؟ با تیم فروش ما در ارتباط باشید: ۰۲۱-۱۲۳۴۵۶۷۸
        </Typography>
      </Box>
    </Box>
  );
};

export default PricingGrid;
