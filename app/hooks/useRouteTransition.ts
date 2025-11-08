import { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router';

interface UseRouteTransitionReturn {
  isNavigating: boolean;
  isTransitioning: boolean;
  currentPath: string;
  previousPath: string | null;
}

export const useRouteTransition = (): UseRouteTransitionReturn => {
  const location = useLocation();
  const navigation = useNavigation();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isNavigating = navigation.state === 'loading';

  useEffect(() => {
    if (location.pathname !== previousPath) {
      if (previousPath) {
        setIsTransitioning(true);
        
        const timer = setTimeout(() => {
          setIsTransitioning(false);
        }, 300); // Transition duration

        return () => clearTimeout(timer);
      }
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);

  return {
    isNavigating,
    isTransitioning,
    currentPath: location.pathname,
    previousPath,
  };
};

export default useRouteTransition;