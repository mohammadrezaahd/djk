import React from "react";
import { Box, Typography, Container } from "@mui/material";

const PricingHeader: React.FC = () => {
  return (
    <Box 
      sx={{ 
        textAlign: "center", 
        mb: 8,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #667eea20, #764ba220)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: -1,
        }
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
          letterSpacing: "-1px",
        }}
      >
        پلان‌های اشتراک
      </Typography>
      <Typography
        variant="h6"
        component="p"
        sx={{
          color: "text.secondary",
          maxWidth: 650,
          mx: "auto",
          lineHeight: 1.8,
          fontSize: "1.1rem",
          fontWeight: 400,
        }}
      >
        بهترین پلان را برای کسب و کار خود انتخاب کنید و از امکانات پیشرفته
        هوش‌مارکت بهره‌مند شوید
      </Typography>
      
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 4,
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            width: 20,
            height: 4,
            bgcolor: "grey.300",
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            width: 20,
            height: 4,
            bgcolor: "grey.300",
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default PricingHeader;
