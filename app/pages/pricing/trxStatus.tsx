import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";

import {
  CircleCheckIcon,
  ErrorIcon,
  HomeIcon,
  ReceiptIcon,
} from "~/components/icons/IconComponents";

import { useNavigate, useSearchParams } from "react-router";
import { useSnackbar } from "notistack";
import AppLayout from "~/components/layout/AppLayout";
import { useTrxStatus } from "~/api/pricing.api";
import { TrxStatus } from "~/types/interfaces/pricing.interface";

const TrxStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [countdown, setCountdown] = useState(5);

  const trxId = searchParams.get("trx");
  const trxIdNumber = trxId ? parseInt(trxId, 10) : null;

  const {
    data: trxData,
    isLoading,
    error,
    refetch,
  } = useTrxStatus(trxIdNumber || 0, {
    enabled: !!trxIdNumber,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!trxId || !trxIdNumber) {
      enqueueSnackbar("شناسه تراکنش یافت نشد", { variant: "error" });
      navigate("/dashboard");
    }
  }, [trxId, trxIdNumber, navigate, enqueueSnackbar]);

  // Countdown effect for redirect to dashboard
  useEffect(() => {
    if (trxData?.data && !isLoading && !error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [trxData?.data, isLoading, error, navigate]);

  const getStatusConfig = (status: TrxStatus) => {
    switch (status) {
      case TrxStatus.VERIFIED:
        return {
          color: "success" as const,
          icon: <CircleCheckIcon />,
          title: "پرداخت موفق",
          message: "پرداخت شما با موفقیت انجام شد و اشتراک شما فعال گردید.",
          bgColor: "#4caf50",
          textColor: "#2e7d32",
        };
      case TrxStatus.UNVERIFIED:
        return {
          color: "error" as const,
          icon: <ErrorIcon />,
          title: "پرداخت ناموفق",
          message: "متأسفانه پرداخت شما انجام نشد. لطفاً مجدداً تلاش کنید.",
          bgColor: "error.light",
          textColor: "error.dark",
        };
      default:
        return {
          color: "warning" as const,
          icon: <ErrorIcon />,
          title: "وضعیت نامشخص",
          message: "وضعیت پرداخت مشخص نیست. لطفاً با پشتیبانی تماس بگیرید.",
          bgColor: "warning.light",
          textColor: "warning.dark",
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoToPricing = () => {
    navigate("/dashboard");
  };

  const handleRetry = () => {
    refetch();
  };

  if (!trxIdNumber) {
    return (
      <AppLayout title="نتیجه پرداخت">
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card sx={{ textAlign: "center", p: 4 }}>
            <ErrorIcon
              style={{ fontSize: 64, color: "error.main", marginBottom: 16 }}
            />
            <Typography variant="h5" sx={{ mb: 2, color: "error.main" }}>
              خطا در شناسه تراکنش
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              شناسه تراکنش معتبر نیست
            </Typography>
            <Button variant="contained" onClick={handleGoHome} size="large">
              بازگشت به خانه
            </Button>
          </Card>
        </Container>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout title="نتیجه پرداخت">
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card sx={{ textAlign: "center", p: 6 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              در حال بررسی وضعیت پرداخت...
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              لطفاً صبر کنید
            </Typography>
          </Card>
        </Container>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="نتیجه پرداخت">
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card sx={{ textAlign: "center", p: 4 }}>
            <ErrorIcon
              style={{ fontSize: 64, color: "error.main", marginBottom: 16 }}
            />
            <Typography variant="h5" sx={{ mb: 2, color: "error.main" }}>
              خطا در دریافت اطلاعات
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              {error?.message || "خطا در دریافت وضعیت تراکنش"}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
                onClick={handleRetry}
                size="large"
              >
                تلاش مجدد
              </Button>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                size="large"
              >
                بازگشت به خانه
              </Button>
            </Stack>
          </Card>
        </Container>
      </AppLayout>
    );
  }

  const statusConfig = getStatusConfig(trxData?.data?.status as TrxStatus);

  return (
    <AppLayout title="نتیجه پرداخت">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Status Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 200,
              background: `${statusConfig.bgColor}40`,
              borderRadius: "50%",
              filter: "blur(60px)",
              zIndex: -1,
            },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: statusConfig.bgColor,
              color: "#fff",
              mb: 3,
              fontSize: 60,
            }}
          >
            {statusConfig.icon}
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: statusConfig.textColor,
              mb: 2,
              letterSpacing: "-0.5px",
            }}
          >
            {statusConfig.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {statusConfig.message}
          </Typography>
        </Box>

        {/* Transaction Details */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <ReceiptIcon style={{ color: "primary.main", marginRight: 16 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                جزئیات تراکنش
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  شناسه تراکنش:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {trxId}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  شناسه پلان:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {trxData?.data?.plan_id}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  مبلغ:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatPrice(trxData?.data?.amount || 0)} تومان
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  وضعیت:
                </Typography>
                <Chip
                  label={statusConfig.title}
                  icon={statusConfig.icon}
                  variant="filled"
                  sx={{
                    bgcolor:
                      statusConfig.color === "success"
                        ? "#4caf50"
                        : statusConfig.color === "error"
                          ? "#f44336"
                          : "#ff9800",
                    color: "#fff",
                    "& .MuiChip-icon": {
                      color: "#fff",
                      marginRight: 1,
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Countdown Timer */}
        {trxData?.data && countdown > 0 && (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              {countdown} ثانیه دیگر به طور خودکار به داشبورد منتقل می‌شوید
            </Typography>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={((5 - countdown) / 5) * 100}
                size={40}
                thickness={4}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  fontSize={12}
                  fontWeight={600}
                >
                  {countdown}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={handleGoHome}
            size="large"
            sx={{ minWidth: 200 }}
          >
            بازگشت به داشبورد
          </Button>
        </Stack>

        {/* Additional Info */}
        {trxData?.data?.status === TrxStatus.VERIFIED && (
          <Alert
            severity="success"
            sx={{
              mt: 4,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                fontSize: 24,
              },
            }}
          >
            <Typography variant="body2">
              اشتراک شما با موفقیت فعال شد. اکنون می‌توانید از تمامی امکانات
              پلان خود استفاده کنید.
            </Typography>
          </Alert>
        )}

        {trxData?.data?.status === TrxStatus.UNVERIFIED && (
          <Alert
            severity="info"
            sx={{
              mt: 4,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                fontSize: 24,
              },
            }}
          >
            <Typography variant="body2">
              در صورت کسر مبلغ از حساب شما، وجه طی ۲۴ ساعت به حساب شما بازگشت
              داده خواهد شد. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.
            </Typography>
          </Alert>
        )}
      </Container>
    </AppLayout>
  );
};

export default TrxStatusPage;
