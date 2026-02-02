import { useEffect, useCallback, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Desktop from "./components/ui/Desktop";
import { TerminalApp, TerminalIcon } from "./components/apps/Terminal";
import { PDFViewerApp, PDFIcon } from "./components/apps/PDFViewer";
import { AIChatApp, AIChatIcon } from "./components/apps/AIChat";
import { useWindowManager } from "./hooks/useWindowManager";
import { useResponsive, useMobileFeatures } from "./hooks/useResponsive";
import type { DesktopIconProps, Size } from "./types/window";
import "./App.css";

function App() {
  const {
    apps,
    openApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    restoreApp,
    updateAppPosition,
    updateAppSize,
    bringToFront,
    getWindowApps,
    shouldShowDesktop,
  } = useWindowManager();

  const responsive = useResponsive();
  const mobileFeatures = useMobileFeatures();

  const handleOpenTerminal = useCallback(() => {
    openApp("terminal", "Terminal", TerminalApp, <TerminalIcon />);
  }, [openApp]);

  const handleOpenPDF = useCallback(() => {
    openApp("pdf-viewer", "PDF Viewer", PDFViewerApp, <PDFIcon />);
  }, [openApp]);

  const handleOpenAIChat = useCallback(() => {
    openApp("ai-chat", "AI Chat", AIChatApp, <AIChatIcon />);
  }, [openApp]);

  // Initialize with Terminal app ready to open
  useEffect(() => {
    // Auto-open terminal on page load
    handleOpenTerminal();
  }, [handleOpenTerminal]);

  const handleIconClick = (iconId: string) => {
    if (iconId === "terminal") {
      handleOpenTerminal();
    } else if (iconId === "pdf-viewer") {
      handleOpenPDF();
    } else if (iconId === "ai-chat") {
      handleOpenAIChat();
    }
  };

  const handleIconDoubleClick = (iconId: string) => {
    if (iconId === "terminal") {
      handleOpenTerminal();
    } else if (iconId === "pdf-viewer") {
      handleOpenPDF();
    } else if (iconId === "ai-chat") {
      handleOpenAIChat();
    }
  };

  // Create desktop icons (only for apps that aren't open)
  const desktopIcons: DesktopIconProps[] = [
    {
      id: "terminal",
      label: "Terminal",
      icon: <TerminalIcon />,
    },
    {
      id: "pdf-viewer",
      label: "PDF Viewer",
      icon: <PDFIcon />,
    },
    {
      id: "ai-chat",
      label: "AI Chat",
      icon: <AIChatIcon />,
    },
    // Add more apps here in the future
  ];

  // Simple desktop display logic
  const showFullDesktop = shouldShowDesktop();
  const minimizedApps = apps.filter((app) => app.state.isMinimized);

  // Handle keyboard shortcuts for desktop
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (shouldShowDesktop()) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleOpenTerminal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shouldShowDesktop, handleOpenTerminal]);

  const renderWindows = () => {
    return getWindowApps().map((app) => {
      const AppComponent = app.component;

      const windowControls = {
        onMinimize: () => minimizeApp(app.id),
        onMaximize: () => maximizeApp(app.id),
        onClose: () => closeApp(app.id),
        onRestore: () => restoreApp(app.id),
        onBringToFront: () => bringToFront(app.id),
        onSizeChange: (size: Size) => updateAppSize(app.id, size),
      };

      return (
        <Suspense
          key={app.id}
          fallback={
            <div
              style={{
                position: "absolute",
                top: mobileFeatures.isMobile ? "20%" : "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#00ff88",
                fontFamily: "monospace",
                fontSize: mobileFeatures.isMobile ? "14px" : "16px",
                textAlign: "center",
                padding: mobileFeatures.isMobile ? "16px" : "20px",
                background: "rgba(0, 0, 0, 0.8)",
                borderRadius: "8px",
                border: "1px solid rgba(0, 255, 136, 0.3)",
              }}
            >
              Loading {app.name}...
              {mobileFeatures.isMobile && <br />}
              {mobileFeatures.isMobile && "📱 Mobile Optimized"}
            </div>
          }
        >
          <AppComponent
            windowId={app.id}
            windowState={app.state}
            windowControls={windowControls}
            onPositionChange={(position) => updateAppPosition(app.id, position)}
            openPDF={app.id.startsWith("terminal") ? handleOpenPDF : undefined}
            openAIChat={
              app.id.startsWith("terminal") ? handleOpenAIChat : undefined
            }
            responsive={responsive}
            mobileFeatures={mobileFeatures}
            {...(app.props || {})}
          />
        </Suspense>
      );
    });
  };

  return (
    <Router>
      <div
        className={`app ${responsive.isMobile ? "mobile" : ""} ${responsive.orientation}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <div
                className="app-container"
                style={{
                  touchAction: mobileFeatures.isMobile
                    ? "manipulation"
                    : "auto",
                  overflowX: mobileFeatures.isMobile ? "hidden" : "visible",
                  userSelect: mobileFeatures.touchDevice ? "none" : "auto",
                }}
              >
                {/* Always show desktop as base layer */}
                <Desktop
                  icons={desktopIcons}
                  onIconClick={handleIconClick}
                  onIconDoubleClick={handleIconDoubleClick}
                  showHint={showFullDesktop}
                  hintText={
                    mobileFeatures.isMobile
                      ? "Tap an icon to open applications"
                      : "Press Space or Enter to open Terminal"
                  }
                  responsive={responsive}
                  mobileFeatures={mobileFeatures}
                />

                {/* Minimized windows taskbar - adapted for mobile */}
                {minimizedApps.length > 0 && (
                  <div
                    className={`taskbar ${responsive.isMobile ? "mobile" : ""}`}
                    style={{
                      ...(mobileFeatures.isMobile && {
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        right: "auto",
                        top: "auto",
                        flexDirection: "row",
                        gap: "8px",
                        background: "rgba(0, 0, 0, 0.9)",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(20px)",
                      }),
                    }}
                  >
                    {minimizedApps.map((app, index) => (
                      <div
                        key={app.id}
                        className="taskbar-item"
                        onClick={() => restoreApp(app.id)}
                        onTouchStart={() => restoreApp(app.id)}
                        title={`${mobileFeatures.touchDevice ? "Tap" : "Click"} to restore ${app.name}`}
                        style={{
                          transform: mobileFeatures.isMobile
                            ? "none"
                            : `translateY(${index * 20}px)`,
                        }}
                      >
                        <div className="taskbar-icon">{app.icon}</div>
                        <div className="taskbar-label">{app.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render all active windows on top */}
                {renderWindows()}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
