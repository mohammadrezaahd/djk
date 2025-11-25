import React from "react";
import { Box, Typography } from "@mui/material";

const PricingHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", mb: 6 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 2,
        }}
      >
        پلان‌های اشتراک
      </Typography>
      <Typography
        variant="h6"
        component="p"
        sx={{
          color: "text.secondary",
          maxWidth: 600,
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        بهترین پلان را برای کسب و کار خود انتخاب کنید و از امکانات پیشرفته
        هوش‌مارکت بهره‌مند شوید
      </Typography>
    </Box>
  );
};

export default PricingHeader;
