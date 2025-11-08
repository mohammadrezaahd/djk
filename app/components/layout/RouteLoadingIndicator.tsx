import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigation } from 'react-router';

interface RouteLoadingIndicatorProps {
  color?: string;
  height?: number;
}

const RouteLoadingIndicator: React.FC<RouteLoadingIndicatorProps> = ({
  color,
  height = 3,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const isLoading = navigation.state === 'loading';

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${color || theme.palette.primary.main} 20%, 
            ${color || theme.palette.primary.main} 80%, 
            transparent 100%)`,
          animation: 'routeProgress 1.5s ease-in-out infinite',
          '@keyframes routeProgress': {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '100%': {
              transform: 'translateX(100%)',
            },
          },
        }}
      />
    </Box>
  );
};

export default RouteLoadingIndicator;