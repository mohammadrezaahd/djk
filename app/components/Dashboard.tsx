import React, { useMemo } from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import {
  ArchiveIcon,
  ImageIcon,
  GridIcon,
  DescriptionIcon,
} from "./icons/IconComponents";
import StatCard from "./Dashboard/StatCard";
import RecentActivity from "./Dashboard/RecentActivity";
import QuickActions from "./Dashboard/QuickActions";
import { useProducts } from "~/api/product.api";
import { useImages } from "~/api/gallery.api";
import { useAttrs } from "~/api/attributes.api";
import { useDetails } from "~/api/details.api";

const Dashboard = () => {
  // Fetch data with React Query
  const {
    mutateAsync: getProductsList,
    data: productsData,
    isPending: productsLoading,
  } = useProducts();

  const { data: imagesData, isLoading: imagesLoading } = useImages({
    skip: 0,
    limit: 10,
  });

  // Fetch templates
  const {
    mutateAsync: getAttrsList,
    data: attrsData,
    isPending: attrsLoading,
  } = useAttrs();

  const {
    mutateAsync: getDetailsList,
    data: detailsData,
    isPending: detailsLoading,
  } = useDetails();

  // Load data on mount
  React.useEffect(() => {
    getProductsList({ skip: 0, limit: 10 });
    getAttrsList({ skip: 0, limit: 10 });
    getDetailsList({ skip: 0, limit: 10 });
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const productsCount = productsData?.data?.list?.length || 0;
    const imagesCount = imagesData?.data?.list?.length || 0;
    const attrsCount = attrsData?.data?.list?.length || 0;
    const detailsCount = detailsData?.data?.list?.length || 0;

    return {
      products: productsCount,
      images: imagesCount,
      attributeTemplates: attrsCount,
      detailTemplates: detailsCount,
    };
  }, [productsData, imagesData, attrsData, detailsData]);

  // Prepare recent activities
  const recentActivities = useMemo(() => {
    const activities: any[] = [];

    // Add recent products
    if (productsData?.data?.list) {
      productsData.data.list.slice(0, 3).forEach((product) => {
        activities.push({
          id: product.id,
          type: "product" as const,
          title: product.title || `محصول ${product.id}`,
          description: `دسته‌بندی: ${product.category_id}`,
        });
      });
    }

    // Add recent images
    if (imagesData?.data?.list) {
      imagesData.data.list.slice(0, 2).forEach((image) => {
        activities.push({
          id: image.id,
          type: "image" as const,
          title: image.title || `تصویر ${image.id}`,
          description: image.size || image.dimensions,
        });
      });
    }

    return activities;
  }, [productsData, imagesData]);

  const isLoading =
    productsLoading || imagesLoading || attrsLoading || detailsLoading;

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%" }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            خوش آمدید! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            خلاصه‌ای از فعالیت‌های شما
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            title="محصولات"
            value={stats.products}
            icon={ArchiveIcon}
            color="#6C5CE7"
            isLoading={isLoading}
          />
          <StatCard
            title="تصاویر"
            value={stats.images}
            icon={ImageIcon}
            color="#00CEC9"
            isLoading={isLoading}
          />
          <StatCard
            title="قالب‌های ویژگی"
            value={stats.attributeTemplates}
            icon={GridIcon}
            color="#FDA7DC"
            isLoading={isLoading}
          />
          <StatCard
            title="قالب‌های اطلاعات"
            value={stats.detailTemplates}
            icon={DescriptionIcon}
            color="#FDCB6E"
            isLoading={isLoading}
          />
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <QuickActions />
        </Box>

        {/* Recent Activity */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2fr 1fr",
            },
            gap: 3,
          }}
        >
          <RecentActivity activities={recentActivities} isLoading={isLoading} />
          <Paper
            sx={{
              p: 3,
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              💡 نکته روز
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.8 }}>
              با استفاده از قالب‌های از پیش تعریف شده، می‌توانید سرعت ایجاد
              محصولات جدید را به شکل چشمگیری افزایش دهید.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
