import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import StatCard from "./Dashboard/StatCard";
import QuickActions from "./Dashboard/QuickActions";
import RecentActivity from "./Dashboard/RecentActivity";
import { useProducts } from "../api/product.api";
import { useImages } from "../api/gallery.api";
import { useAttrs } from "../api/attributes.api";
import { useDetails } from "../api/details.api";

const Dashboard = () => {
  const { data: productsData } = useProducts({ limit: 5, skip: 0 });
  const { data: imagesData } = useImages({ limit: 5, skip: 0 });
  const { data: attrsData } = useAttrs({ limit: 5, skip: 0 });
  const { data: detailsData } = useDetails({ limit: 5, skip: 0 });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        داشبورد
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="محصولات"
            value={productsData?.data.total ?? 0}
            icon="inventory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="تصاویر"
            value={imagesData?.data.total ?? 0}
            icon="image"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ویژگی‌ها"
            value={attrsData?.data.total ?? 0}
            icon="tune"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="اطلاعات"
            value={detailsData?.data.total ?? 0}
            icon="info"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;