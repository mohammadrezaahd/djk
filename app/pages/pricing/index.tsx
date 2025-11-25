import React from "react";
import { Container, Box, Alert } from "@mui/material";
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <PricingHeader />

        {pricingError && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          <PricingGrid
            plans={plans}
            isLoading={pricingLoading}
            error={pricingError ? errorMessage : undefined}
            onPurchase={handlePurchase}
            purchaseLoading={paymentLoading}
          />
        </Box>

        {/* Additional Information Section */}
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Alert
            severity="info"
            sx={{
              maxWidth: 600,
              mx: "auto",
            }}
          >
            تمامی پلان‌ها شامل پشتیبانی کامل و به‌روزرسانی‌های رایگان هستند.
            <br />
            در صورت عدم رضایت، تا ۷ روز امکان بازگشت وجه وجود دارد.
          </Alert>
        </Box>
      </Container>
    </AppLayout>
  );
};

export default PricingPage;
