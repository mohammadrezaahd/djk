import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Skeleton,
  Grid,
  useTheme,
} from "@mui/material";

const PricingCardSkeleton: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Skeleton 
            variant="text" 
            width="60%" 
            height={40} 
            sx={{ 
              mx: "auto", 
              mb: 1.5,
              borderRadius: 2,
            }} 
          />
          <Skeleton 
            variant="text" 
            width="85%" 
            height={20} 
            sx={{ 
              mx: "auto",
              borderRadius: 1,
            }} 
          />
        </Box>

        {/* Price Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", mb: 1 }}>
            <Skeleton 
              variant="text" 
              width={140} 
              height={52} 
              sx={{ borderRadius: 2 }} 
            />
            <Skeleton 
              variant="text" 
              width={50} 
              height={28} 
              sx={{ 
                mr: 1,
                borderRadius: 1,
              }} 
            />
          </Box>
          <Skeleton 
            variant="text" 
            width="55%" 
            height={18} 
            sx={{ 
              mx: "auto",
              borderRadius: 1,
            }} 
          />
        </Box>

        {/* Divider */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={1} 
          sx={{ 
            mb: 3,
            borderRadius: 0.5,
          }} 
        />

        {/* Features List */}
        <Box>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ display: "flex", alignItems: "center", py: 1.5 }}>
              <Skeleton 
                variant="circular" 
                width={24} 
                height={24} 
                sx={{ 
                  mr: 2.25,
                  flexShrink: 0,
                }} 
              />
              <Skeleton 
                variant="text" 
                width={`${55 + Math.random() * 35}%`} 
                height={20} 
                sx={{ borderRadius: 1 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 4, pt: 0 }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={56} 
          sx={{ 
            borderRadius: 3,
            animation: "pulse 2s ease-in-out infinite",
          }} 
        />
      </CardActions>
    </Card>
  );
};

const PricingGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {[1, 2, 3].map((item) => (
        <Grid 
          size={{ xs: 12, sm: 6, lg: 4 }} 
          key={item}
          sx={{
            animation: `fadeIn 0.6s ease-out ${item * 0.1}s both`,
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <PricingCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export { PricingCardSkeleton, PricingGridSkeleton };