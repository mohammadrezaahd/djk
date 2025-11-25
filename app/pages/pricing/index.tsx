import React from "react";
import { Container, Box, Alert, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import AppLayout from "~/components/layout/AppLayout";
import { PricingHeader, PricingGrid } from "~/components/pricing";
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
            // Handle successful payment initialization
            console.log("Payment initiated:", response);

            // If the response contains a payment URL, redirect to it
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <PricingHeader />

        {pricingError && (
          <Alert
            severity="error"
            sx={{
              mb: 6,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                fontSize: 24,
              },
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ mt: 6 }}>
          <PricingGrid
            plans={plans}
            isLoading={pricingLoading}
            error={pricingError ? errorMessage : undefined}
            onPurchase={handlePurchase}
            purchaseLoading={paymentLoading}
          />
        </Box>

        {/* Additional Information Section */}
        <Box sx={{ mt: 12, textAlign: "center" }}>
          <Box
            sx={{
              maxWidth: 700,
              mx: "auto",
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8f9ff, #f0f4ff)",
              border: "1px solid",
              borderColor: "grey.200",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                borderRadius: "inherit",
                zIndex: -1,
                opacity: 0.1,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                mb: 2,
              }}
            >
              🎯 تضمین کیفیت و پشتیبانی
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
              }}
            >
              تمامی پلان‌ها شامل پشتیبانی کامل و به‌روزرسانی‌های رایگان هستند.
              <br />
              در صورت عدم رضایت، تا ۷ روز امکان بازگشت وجه وجود دارد.
            </Typography>
          </Box>
        </Box>
      </Container>
    </AppLayout>
  );
};

export default PricingPage;
