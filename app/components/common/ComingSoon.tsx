import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";

import { HourglassIcon, ConstructionIcon } from "../icons/IconComponents";

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "به زودی",
  description = "این بخش در حال توسعه است و به زودی در دسترس خواهد بود.",
  icon,
}) => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          textAlign: "center",
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 3,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                transform: "scale(1)",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
              "50%": {
                transform: "scale(1.05)",
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            },
          }}
        >
          {icon || <HourglassIcon style={{ fontSize: 60, color: "white" }} />}
        </Box>

        {/* Badge */}
        <Chip
          icon={<ConstructionIcon />}
          label="در دست توسعه"
          color="primary"
          sx={{
            mb: 3,
            fontWeight: "bold",
            px: 2,
            py: 0.5,
          }}
        />

        {/* Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            lineHeight: 1.8,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {description}
        </Typography>

        {/* Progress Bar Animation */}
        <Box
          sx={{
            position: "relative",
            height: "6px",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: "3px",
            overflow: "hidden",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              width: "40%",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: "3px",
              animation: "loading 2s ease-in-out infinite",
              "@keyframes loading": {
                "0%": {
                  left: "-40%",
                },
                "100%": {
                  left: "100%",
                },
              },
            }}
          />
        </Box>

        {/* Footer Note */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 4, opacity: 0.7 }}
        >
          لطفاً منتظر بمانید، این ویژگی به زودی اضافه خواهد شد 🚀
        </Typography>
      </Paper>
    </Container>
  );
};

export default ComingSoon;
