import React from "react";
import { Grid, Box, Alert, CircularProgress } from "@mui/material";
import PricingCard from "./PricingCard";
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        خطا در بارگذاری پلان‌های اشتراک: {error}
      </Alert>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        در حال حاضر پلان اشتراکی موجود نیست.
      </Alert>
    );
  }

  // Find the most popular plan (could be based on any criteria, here using middle plan or specific logic)
  const getPopularPlanIndex = () => {
    if (plans.length === 1) return 0;
    if (plans.length === 2) return 1;
    return Math.floor(plans.length / 2); // Middle plan for odd numbers, or slightly after middle for even
  };

  const popularPlanIndex = getPopularPlanIndex();

  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {plans.map((plan, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={plan.id}>
          <PricingCard
            plan={plan}
            isPopular={index === popularPlanIndex}
            onPurchase={onPurchase}
            isLoading={purchaseLoading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PricingGrid;