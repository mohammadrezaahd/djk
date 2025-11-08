import React from 'react';
import { Box, keyframes, useTheme } from '@mui/material';

interface AnimatedIllustrationProps {
  size?: number;
  type?: 'search' | 'broken' | 'empty';
}

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const AnimatedIllustration: React.FC<AnimatedIllustrationProps> = ({
  size = 120,
  type = 'search',
}) => {
  const theme = useTheme();

  const getIllustration = () => {
    switch (type) {
      case 'search':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Search Circle */}
            <circle
              cx="45"
              cy="45"
              r="25"
              stroke={theme.palette.primary.main}
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            {/* Search Handle */}
            <line
              x1="65"
              y1="65"
              x2="85"
              y2="85"
              stroke={theme.palette.primary.main}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* X mark inside circle */}
            <line
              x1="35"
              y1="35"
              x2="55"
              y2="55"
              stroke={theme.palette.error.main}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="55"
              y1="35"
              x2="35"
              y2="55"
              stroke={theme.palette.error.main}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      
      case 'broken':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Broken page */}
            <path
              d="M30 20 L30 100 L90 100 L90 50 L70 30 L30 20 Z"
              stroke={theme.palette.primary.main}
              strokeWidth="3"
              fill={theme.palette.primary.main + '20'}
            />
            {/* Crack */}
            <path
              d="M40 40 L50 60 L45 80"
              stroke={theme.palette.error.main}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );
      
      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="40"
              stroke={theme.palette.primary.main}
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
          </svg>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: `${float} 3s ease-in-out infinite`,
      }}
    >
      {getIllustration()}
      
      {/* Floating background circle */}
      <Box
        sx={{
          position: 'absolute',
          width: size * 1.5,
          height: size * 1.5,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          animation: `${pulse} 2s ease-in-out infinite`,
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default AnimatedIllustration;