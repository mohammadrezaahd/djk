import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import Layout from "~/components/layout/Layout";

const ProductsList = () => {
  return (
    <Layout title="تمام محصولات">
      <Box sx={{ p: 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            تمام محصولات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            در اینجا لیست تمام محصولات نمایش داده خواهد شد.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProductsList;