import { useState, useEffect } from 'react';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchDevice: boolean;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;

    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      screenWidth: width,
      screenHeight: height,
      orientation: height > width ? 'portrait' : 'landscape',
      touchDevice: typeof window !== 'undefined' && 'ontouchstart' in window,
    };
  });

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        orientation: height > width ? 'portrait' : 'landscape',
        touchDevice: 'ontouchstart' in window,
      });
    };

    // Update on window resize
    window.addEventListener('resize', updateResponsiveState);

    // Update on orientation change
    window.addEventListener('orientationchange', updateResponsiveState);

    // Initial update
    updateResponsiveState();

    return () => {
      window.removeEventListener('resize', updateResponsiveState);
      window.removeEventListener('orientationchange', updateResponsiveState);
    };
  }, []);

  return state;
};

// Utility hook for specific breakpoints
export const useBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | 'xxl') => {
  const { screenWidth } = useResponsive();

  const breakpoints = {
    sm: 640,   // Small devices
    md: 768,   // Medium devices (tablets)
    lg: 1024,  // Large devices (desktops)
    xl: 1280,  // Extra large devices
    xxl: 1536, // 2XL devices
  };

  return screenWidth >= breakpoints[breakpoint];
};

// Hook for mobile-specific features
export const useMobileFeatures = () => {
  const responsive = useResponsive();

  return {
    ...responsive,
    isSmallMobile: responsive.screenWidth < 480,
    isLargeMobile: responsive.screenWidth >= 480 && responsive.screenWidth < 768,
    shouldUseFullscreen: responsive.isMobile,
    shouldHideResizeHandles: responsive.isMobile,
    preferredWindowSize: responsive.isMobile
      ? { width: responsive.screenWidth - 20, height: responsive.screenHeight - 60 }
      : { width: 800, height: 600 },
    supportsPinchZoom: responsive.touchDevice,
    supportsHover: !responsive.touchDevice,
  };
};

// Hook for adaptive window positioning
export const useAdaptiveWindowPosition = (windowId: string) => {
  const responsive = useResponsive();

  const getOptimalPosition = (windowSize: { width: number; height: number }) => {
    const { screenWidth, screenHeight, isMobile } = responsive;

    if (isMobile) {
      // On mobile, center horizontally and leave some space at top
      return {
        x: Math.max(10, (screenWidth - windowSize.width) / 2),
        y: Math.min(60, screenHeight * 0.1),
      };
    }

    // On desktop, use offset positioning for multiple windows
    const baseOffset = parseInt(windowId.slice(-1)) || 0;
    const offsetX = 50 + (baseOffset * 30);
    const offsetY = 50 + (baseOffset * 30);

    return {
      x: Math.min(offsetX, screenWidth - windowSize.width - 50),
      y: Math.min(offsetY, screenHeight - windowSize.height - 50),
    };
  };

  const getConstrainedPosition = (
    position: { x: number; y: number },
    windowSize: { width: number; height: number }
  ) => {
    const { screenWidth, screenHeight } = responsive;

    return {
      x: Math.max(0, Math.min(position.x, screenWidth - windowSize.width)),
      y: Math.max(0, Math.min(position.y, screenHeight - windowSize.height)),
    };
  };

  return {
    getOptimalPosition,
    getConstrainedPosition,
    responsive,
  };
};
