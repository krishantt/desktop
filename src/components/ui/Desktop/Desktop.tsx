import React from "react";
import type { DesktopIconProps } from "../../../types/window";
import type { ResponsiveState } from "../../../hooks/useResponsive";
import "./Desktop.css";

interface DesktopProps {
  children?: React.ReactNode;
  icons?: DesktopIconProps[];
  wallpaper?: string;
  className?: string;
  onIconClick?: (iconId: string) => void;
  onIconDoubleClick?: (iconId: string) => void;
  showHint?: boolean;
  hintText?: string;
  responsive?: ResponsiveState;
  mobileFeatures?: {
    isMobile: boolean;
    touchDevice: boolean;
    isSmallMobile: boolean;
    shouldUseFullscreen: boolean;
  };
}

const DesktopIcon: React.FC<
  DesktopIconProps & {
    onIconClick?: (id: string) => void;
    onIconDoubleClick?: (id: string) => void;
    touchDevice?: boolean;
    isMobile?: boolean;
  }
> = ({
  id,
  label,
  icon,
  className = "",
  onIconClick,
  onIconDoubleClick,
  touchDevice = false,
  isMobile = false,
}) => {
  const handleClick = () => {
    onIconClick?.(id);
  };

  const handleDoubleClick = () => {
    onIconDoubleClick?.(id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchDevice) {
      onIconClick?.(id);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchDevice) {
      onIconDoubleClick?.(id);
    }
  };

  return (
    <div
      className={`desktop-icon ${className} ${isMobile ? "mobile" : ""} ${touchDevice ? "touch" : ""}`}
      onClick={!touchDevice ? handleClick : undefined}
      onDoubleClick={!touchDevice ? handleDoubleClick : undefined}
      onTouchStart={touchDevice ? handleTouchStart : undefined}
      onTouchEnd={touchDevice ? handleTouchEnd : undefined}
      title={`${touchDevice ? "Tap" : "Double-click"} to open ${label}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDoubleClick();
        }
      }}
      style={{
        ...(isMobile && {
          minWidth: "60px",
          minHeight: "80px",
          padding: "8px",
          margin: "4px",
        }),
      }}
    >
      <div className="icon-image">{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
};

const Desktop: React.FC<DesktopProps> = ({
  children,
  icons = [],
  wallpaper,
  className = "",
  onIconClick,
  onIconDoubleClick,
  showHint = false,
  hintText = "Press Space or Enter to open applications",
  responsive,
  mobileFeatures,
}) => {
  const desktopStyle: React.CSSProperties = wallpaper
    ? { backgroundImage: `url(${wallpaper})` }
    : {};

  return (
    <div
      className={`desktop ${className} ${responsive?.isMobile ? "mobile" : ""} ${responsive?.orientation || ""}`}
      style={{
        touchAction: mobileFeatures?.touchDevice ? "manipulation" : "auto",
        userSelect: mobileFeatures?.touchDevice ? "none" : "auto",
      }}
    >
      <div className="desktop-wallpaper" style={desktopStyle} />

      {icons.length > 0 && (
        <div
          className="desktop-icons"
          style={{
            ...(mobileFeatures?.isMobile && {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "20px 16px",
              gap: "16px",
              maxWidth: "100vw",
              overflowX: "hidden",
            }),
          }}
        >
          {icons.map((iconProps) => (
            <DesktopIcon
              key={iconProps.id}
              {...iconProps}
              onIconClick={onIconClick}
              onIconDoubleClick={onIconDoubleClick}
              touchDevice={mobileFeatures?.touchDevice}
              isMobile={mobileFeatures?.isMobile}
            />
          ))}
        </div>
      )}

      {showHint && (
        <div
          className="desktop-hint"
          style={{
            ...(mobileFeatures?.isMobile && {
              bottom: "80px",
              fontSize: "14px",
              padding: "0 20px",
              lineHeight: "1.4",
            }),
          }}
        >
          {hintText}
        </div>
      )}

      {/* Windows and other content */}
      {children}
    </div>
  );
};

export default Desktop;
export { DesktopIcon };
