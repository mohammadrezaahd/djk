import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Divider,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import { CircleCheckIcon } from "../icons/IconComponents";
const ResultPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewProductsList = () => {
    navigate("/dashboard/products/list");
  };

  const handleCreateAnother = () => {
    navigate("/dashboard/products/new");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.main}10 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              background: "#ffffff",
              border: `2px solid ${theme.palette.success.main}`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.success.light}40, ${theme.palette.success.main}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircleCheckIcon
                  style={{
                    fontSize: 70,
                    color: theme.palette.success.main,
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              محصول شما با موفقیت ثبت شد
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 600,
                mb: 2,
                fontSize: "0.9rem",
              }}
            >
              ✓ درخواست با موفقیت انجام شد
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: 1.8,
                fontSize: "0.95rem",
              }}
            >
              محصول جدید شما با موفقیت در سیستم ثبت شده است. اکنون می‌توانید
              محصول را در لیست محصولات مشاهده کنید یا یک محصول جدید ایجاد کنید.
            </Typography>

            <Divider
              sx={{
                my: 3,
                background: `linear-gradient(90deg, transparent, ${theme.palette.grey[300]}, transparent)`,
              }}
            />

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
                size="large"
                onClick={handleViewProductsList}
                sx={{
                  flex: { xs: "auto", sm: "1" },
                  minWidth: 150,
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                  color: "#ffffff",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                  boxShadow: `0 4px 12px ${theme.palette.success.main}40`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                    boxShadow: `0 6px 16px ${theme.palette.success.main}60`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                مشاهده لیست محصولات
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleCreateAnother}
                sx={{
                  flex: { xs: "auto", sm: "1" },
                  minWidth: 150,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                  border: `2px solid ${theme.palette.secondary.main}`,
                  "&:hover": {
                    background: `${theme.palette.secondary.main}10`,
                    borderColor: theme.palette.secondary.main,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                ایجاد محصول جدید
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultPage;
