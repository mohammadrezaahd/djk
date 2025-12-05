import React from "react";
import { Container, Box, Alert, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import AppLayout from "~/components/layout/AppLayout";
import { PricingGrid } from "~/components/pricing";
import { TitleCard } from "~/components/common";
import { usePricing, useInitPayment } from "~/api/pricing.api";

const PricingPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: pricingData,
    isLoading: pricingLoading,
    error: pricingError,
  } = usePricing();

  const { mutate: initPayment, isPending: paymentLoading } = useInitPayment();

  const handlePurchase = async (planId: number) => {
    try {
      await new Promise((resolve) => {
        initPayment(planId, {
          onSuccess: (response) => {
            console.log("Payment initiated:", response);

            if (response?.data?.payment_url) {
              window.location.href = response.data.payment_url;
            } else {
              enqueueSnackbar("پرداخت با موفقیت شروع شد", {
                variant: "success",
              });
            }
            resolve(response);
          },
          onError: (error: any) => {
            console.error("Payment error:", error);
            enqueueSnackbar(
              error?.message ||
                error?.response?.data?.message ||
                "خطا در شروع فرآیند پرداخت",
              { variant: "error" }
            );
          },
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      enqueueSnackbar("خطای غیرمنتظره در سیستم پرداخت", { variant: "error" });
    }
  };

  const plans = pricingData?.data?.list || [];
  const errorMessage = pricingError?.message || "خطا در بارگذاری پلان‌ها";

  return (
    <AppLayout title="پلان‌های اشتراک">
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <TitleCard
          title="پلان‌های اشتراک"
          description="بهترین پلان را برای کسب و کار خود انتخاب کنید"
        />
        {/* Error Alert */}
        {pricingError && (
          <Alert
            severity="error"
            sx={{
              mb: 6,
              borderRadius: 2,
              bgcolor: "error.light",
              color: "error.contrastText",
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Pricing Grid */}
        <Box sx={{ mb: 8 }}>
          <PricingGrid
            plans={plans}
            isLoading={pricingLoading}
            error={pricingError ? errorMessage : undefined}
            onPurchase={handlePurchase}
            purchaseLoading={paymentLoading}
          />
        </Box>

        {/* Guarantee Section */}
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            borderRadius: 3,
            bgcolor: "grey.50",
            border: "2px dashed",
            borderColor: "success.main",
          }}
        >
          {/* <StarIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} /> */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "success.main",
              mb: 2,
            }}
          >
            ۷ روز ضمانت بازگشت وجه
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            اگر از خدمات ما راضی نبودید، تا ۷ روز پس از خرید می‌توانید درخواست
            بازگشت کامل وجه خود را بدهید. بدون سوال، بدون دردسر.
          </Typography>
        </Box>
      </Container>
    </AppLayout>
  );
};

export default PricingPage;
