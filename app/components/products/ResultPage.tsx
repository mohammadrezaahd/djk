import React from "react";
import { Box, Paper, Typography, Button, Container, Divider } from "@mui/material";
import { useNavigate } from "react-router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ResultPage = () => {
  const navigate = useNavigate();

  const handleViewProductsList = () => {
    navigate("/products/list");
  };

  const handleCreateAnother = () => {
    navigate("/products/new");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "success.light",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "success.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "success.dark",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            درخواست ساخت محصول شما با موفقیت ثبت شد
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.8 }}
          >
            محصول جدید شما با موفقیت در سیستم ثبت شده است. اکنون می‌توانید
            محصول را در لیست محصولات مشاهده کنید یا یک محصول جدید ایجاد کنید.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleViewProductsList}
              sx={{
                flex: { xs: "auto", sm: "1" },
                minWidth: 150,
              }}
            >
              مشاهده لیست محصولات
            </Button>

            <Button
              variant="outlined"
              color="success"
              size="large"
              onClick={handleCreateAnother}
              sx={{
                flex: { xs: "auto", sm: "1" },
                minWidth: 150,
              }}
            >
              ایجاد محصول جدید
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResultPage;
