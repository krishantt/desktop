import React from "react";
import { useResponsive } from "../../../hooks/useResponsive";
import "./MobileNav.css";

interface MobileNavProps {
  apps: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
  }>;
  onAppOpen: (appId: string) => void;
  onAppClose: (appId: string) => void;
  onAppRestore: (appId: string) => void;
  showAppsDrawer?: boolean;
  onToggleAppsDrawer?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  apps,
  onAppOpen,
  onAppClose,
  onAppRestore,
  showAppsDrawer = false,
  onToggleAppsDrawer,
}) => {
  const { isMobile } = useResponsive();

  if (!isMobile) return null;

  const openApps = apps.filter((app) => app.isOpen && !app.isMinimized);
  const minimizedApps = apps.filter((app) => app.isOpen && app.isMinimized);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="mobile-nav">
        {/* Home/Desktop Button */}
        <button
          className="nav-button home-button"
          onClick={() => {
            // Close all apps or show desktop
            openApps.forEach((app) => onAppClose(app.id));
          }}
          title="Home"
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Running Apps */}
        <div className="running-apps">
          {openApps.map((app) => (
            <button
              key={app.id}
              className="nav-button app-button active"
              onClick={() => {
                // Bring app to front or focus
                onAppRestore(app.id);
              }}
              title={app.name}
            >
              <div className="nav-icon">{app.icon}</div>
              <div className="active-indicator" />
            </button>
          ))}

          {minimizedApps.map((app) => (
            <button
              key={app.id}
              className="nav-button app-button minimized"
              onClick={() => onAppRestore(app.id)}
              title={`Restore ${app.name}`}
            >
              <div className="nav-icon">{app.icon}</div>
            </button>
          ))}
        </div>

        {/* App Drawer Toggle */}
        <button
          className={`nav-button apps-button ${showAppsDrawer ? "active" : ""}`}
          onClick={onToggleAppsDrawer}
          title="Apps"
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Apps Drawer Overlay */}
      {showAppsDrawer && (
        <div className="apps-drawer-overlay" onClick={onToggleAppsDrawer}>
          <div className="apps-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="apps-drawer-header">
              <h3>Apps</h3>
              <button
                className="close-drawer-button"
                onClick={onToggleAppsDrawer}
                title="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="apps-grid">
              {/* Show all apps */}
              {apps.map((app) => (
                <button
                  key={app.id}
                  className={`app-grid-item ${app.isOpen ? "open" : ""}`}
                  onClick={() => {
                    if (app.isOpen) {
                      if (app.isMinimized) {
                        onAppRestore(app.id);
                      }
                    } else {
                      onAppOpen(app.id);
                    }
                    onToggleAppsDrawer?.();
                  }}
                  title={app.name}
                >
                  <div className="app-grid-icon">{app.icon}</div>
                  <div className="app-grid-label">{app.name}</div>
                  {app.isOpen && <div className="app-status-dot" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
