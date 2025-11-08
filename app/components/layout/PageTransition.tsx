import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';
import RouteLoadingIndicator from './RouteLoadingIndicator';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('enter');
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start exit transition
    setTransitionStage('exit');
    
    const timer = setTimeout(() => {
      // Update content and start enter transition
      setDisplayChildren(children);
      setTransitionStage('enter');
    }, 150); // Short delay for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Update children when they change (for same route)
  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  const getTransitionStyles = () => {
    const baseStyles = {
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, opacity',
    };

    switch (transitionStage) {
      case 'enter':
        return {
          ...baseStyles,
          opacity: 1,
          transform: 'translateY(0px)',
        };
      case 'exit':
        return {
          ...baseStyles,
          opacity: 0.7,
          transform: 'translateY(-8px)',
        };
      default:
        return {
          ...baseStyles,
          opacity: 1,
          transform: 'translateY(0px)',
        };
    }
  };

  return (
    <>
      {/* Route loading indicator */}
      <RouteLoadingIndicator />

      {/* Page content with smooth transition */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)', // Adjust for AppBar height
          ...getTransitionStyles(),
        }}
      >
        {displayChildren}
      </Box>
    </>
  );
};

export default PageTransition;