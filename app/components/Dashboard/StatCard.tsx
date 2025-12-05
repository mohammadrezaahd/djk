import React from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import type { FC } from "react";

interface CustomIconProps {
  size?: string | number | 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: FC<CustomIconProps>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  isLoading = false,
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        transition: "all 0.3s ease",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                {value}
              </Typography>
            )}
            {trend && !isLoading && (
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive ? "success.main" : "error.main",
                  fontWeight: 500,
                }}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={28} color={color} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
