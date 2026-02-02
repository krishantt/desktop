import React, { useState, useCallback } from "react";
import type {
  AppInstance,
  WindowState,
  Position,
  Size,
  WindowControls,
} from "../types/window";

export interface WindowManagerState {
  apps: AppInstance[];
  activeAppId?: string;
  nextZIndex: number;
}

export const useWindowManager = () => {
  const [state, setState] = useState<WindowManagerState>({
    apps: [],
    activeAppId: undefined,
    nextZIndex: 1000,
  });

  // Create a new app instance
  const openApp = useCallback(
    (
      baseId: string,
      name: string,
      component: React.ComponentType<{
        windowId: string;
        windowState: WindowState;
        windowControls: WindowControls;
        onPositionChange?: (position: Position) => void;
        [key: string]: unknown;
      }>,
      icon: React.ReactNode,
      initialProps?: Record<string, unknown>
    ) => {
      setState((prevState) => {
        // Generate unique ID for this instance
        const existingInstances = prevState.apps.filter((app) =>
          app.id.startsWith(baseId)
        );
        const instanceNumber = existingInstances.length + 1;
        const uniqueId =
          instanceNumber === 1 ? baseId : `${baseId}-${instanceNumber}`;

        // Calculate position with better offset for multiple instances
        const baseOffset = 50;
        const offsetX = (instanceNumber - 1) * baseOffset;
        const offsetY = (instanceNumber - 1) * baseOffset;
        const baseX = window.innerWidth * 0.2;
        const baseY = window.innerHeight * 0.15;

        // Create new app instance
        const newApp: AppInstance = {
          id: uniqueId,
          name: `${name}${instanceNumber > 1 ? ` (${instanceNumber})` : ""}`,
          component,
          icon,
          props: initialProps,
          state: {
            isMinimized: false,
            isMaximized: false,
            isClosed: false,
            isClosing: false,
            position: {
              x: Math.min(baseX + offsetX, window.innerWidth - 400),
              y: Math.min(baseY + offsetY, window.innerHeight - 300),
            },
            size: {
              width: window.innerWidth * 0.5,
              height: window.innerHeight * 0.5,
            },
            zIndex: prevState.nextZIndex,
          },
        };

        return {
          ...prevState,
          apps: [...prevState.apps, newApp],
          activeAppId: uniqueId,
          nextZIndex: prevState.nextZIndex + 1,
        };
      });
    },
    []
  );

  // Close an app
  const closeApp = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: { ...app.state, isClosing: true },
            }
          : app
      ),
    }));

    // After animation, actually close
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        apps: prevState.apps.map((app) =>
          app.id === id
            ? {
                ...app,
                state: { ...app.state, isClosed: true, isClosing: false },
              }
            : app
        ),
        activeAppId:
          prevState.activeAppId === id ? undefined : prevState.activeAppId,
      }));
    }, 300);
  }, []);

  // Minimize an app
  const minimizeApp = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: { ...app.state, isMinimized: !app.state.isMinimized },
            }
          : app
      ),
      activeAppId:
        prevState.activeAppId === id ? undefined : prevState.activeAppId,
    }));
  }, []);

  // Maximize an app
  const maximizeApp = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: {
                ...app.state,
                isMaximized: !app.state.isMaximized,
                isMinimized: false,
              },
            }
          : app
      ),
    }));
  }, []);

  // Restore an app
  const restoreApp = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: {
                ...app.state,
                isMinimized: false,
                isClosed: false,
                isClosing: false,
                position: { ...app.state.position },
                zIndex: prevState.nextZIndex,
              },
            }
          : app
      ),
      activeAppId: id,
      nextZIndex: prevState.nextZIndex + 1,
    }));
  }, []);

  // Update app position
  const updateAppPosition = useCallback((id: string, position: Position) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: { ...app.state, position },
            }
          : app
      ),
    }));
  }, []);

  // Update app size
  const updateAppSize = useCallback((id: string, size: Size) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: { ...app.state, size },
            }
          : app
      ),
    }));
  }, []);

  // Bring app to front
  const bringToFront = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      apps: prevState.apps.map((app) =>
        app.id === id
          ? {
              ...app,
              state: {
                ...app.state,
                zIndex: prevState.nextZIndex,
              },
            }
          : app
      ),
      activeAppId: id,
      nextZIndex: prevState.nextZIndex + 1,
    }));
  }, []);

  // Get apps that should show desktop icons (closed or minimized)
  const getDesktopApps = useCallback(() => {
    return state.apps.filter(
      (app) => app.state.isClosed || app.state.isMinimized
    );
  }, [state.apps]);

  // Get apps that should render windows
  const getWindowApps = useCallback(() => {
    return state.apps.filter((app) => !app.state.isClosed);
  }, [state.apps]);

  // Check if desktop should be shown
  const shouldShowDesktop = useCallback(() => {
    return (
      state.apps.length === 0 || state.apps.every((app) => app.state.isClosed)
    );
  }, [state.apps]);

  return {
    // State
    apps: state.apps,
    activeAppId: state.activeAppId,

    // Actions
    openApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    restoreApp,
    updateAppPosition,
    updateAppSize,
    bringToFront,

    // Getters
    getDesktopApps,
    getWindowApps,
    shouldShowDesktop,
  };
};
