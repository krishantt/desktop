import React from "react";
import Window from "../../ui/Window";
import type { WindowState, WindowControls } from "../../../types/window";
import "./PDFViewerApp.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import required CSS for react-pdf-viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerAppProps {
  windowId: string;
  windowState: WindowState;
  windowControls: WindowControls;
  onPositionChange?: (position: { x: number; y: number }) => void;
  pdfUrl?: string;
}

const PDFViewerApp: React.FC<PDFViewerAppProps> = ({
  windowId,
  windowState,
  windowControls,
  onPositionChange,
  pdfUrl = "/docs/resume.pdf",
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
  });

  const windowTitle = `PDF Viewer - ${pdfUrl}${
    windowState.isMinimized
      ? " (minimized)"
      : windowState.isMaximized
        ? " (maximized)"
        : ""
  }`;

  return (
    <Window
      id={windowId}
      title={windowTitle}
      state={windowState}
      controls={windowControls}
      className="pdf-viewer-window"
      resizable={true}
      minWidth={600}
      minHeight={400}
      skipCloseDialog={true}
      onPositionChange={onPositionChange}
    >
      <div className="pdf-viewer-container">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1.0}
          />
        </Worker>
      </div>
    </Window>
  );
};

// PDF Icon component for desktop
export const PDFIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 4C6.89543 4 6 4.89543 6 6V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V14L32 4H8Z"
      fill="#E53E3E"
    />
    <path d="M32 4V14H42L32 4Z" fill="#C53030" />
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="8"
      fill="white"
      fontWeight="bold"
    >
      PDF
    </text>
  </svg>
);

export default PDFViewerApp;
