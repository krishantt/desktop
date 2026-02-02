import React, { useState, useEffect, useRef, useCallback } from "react";
import type { WindowProps, DragState, Size } from "../../../types/window";
import ConfirmDialog from "../../ConfirmDialog";
import "./Window.css";

const Window: React.FC<WindowProps> = ({
  id,
  title,
  state,
  controls,
  children,
  className = "",
  resizable = false,
  minWidth = 400,
  minHeight = 300,
  maxWidth,
  maxHeight,
  showCloseConfirm = false,
  closeConfirmMessage = "Are you sure you want to close this window?",
  skipCloseDialog = false,
  onPositionChange,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });
  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    direction: string;
    startPos: { x: number; y: number };
    startSize: Size;
    startPosition: { x: number; y: number };
  }>({
    isResizing: false,
    direction: "",
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startPosition: { x: 0, y: 0 },
  });
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const { isMinimized, isMaximized, isClosed, isClosing, position } = state;

  // Handle window dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized || e.button !== 0) return;

      e.preventDefault();
      setDragState({
        isDragging: true,
        dragStart: {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        },
      });
    },
    [isMaximized, position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || isMaximized) return;

      const windowElement = windowRef.current;
      if (!windowElement) return;

      const windowRect = windowElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate new position
      let newX = e.clientX - dragState.dragStart.x;
      let newY = e.clientY - dragState.dragStart.y;

      // Apply bounds checking
      const minX = -windowRect.width + 100; // Allow 100px to remain visible
      const maxX = viewportWidth - 100;
      const minY = 0; // Don't allow dragging above top
      const maxY = viewportHeight - 40; // Keep titlebar accessible

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      // Update position through callback
      if (onPositionChange) {
        onPositionChange({ x: newX, y: newY });
      }
    },
    [dragState, isMaximized, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (isMaximized || e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Get current size, preferring state size over DOM rect to avoid issues
      const currentSize = state.size || {
        width: rect.width,
        height: rect.height,
      };

      setResizeState({
        isResizing: true,
        direction,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: currentSize,
        startPosition: { x: rect.left, y: rect.top },
      });
    },
    [isMaximized, state.size]
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeState.isResizing) return;

      const deltaX = e.clientX - resizeState.startPos.x;
      const deltaY = e.clientY - resizeState.startPos.y;

      let newWidth = resizeState.startSize.width;
      let newHeight = resizeState.startSize.height;
      let newX = resizeState.startPosition.x;
      let newY = resizeState.startPosition.y;

      const { direction } = resizeState;

      if (direction.includes("e")) {
        newWidth = Math.max(minWidth, resizeState.startSize.width + deltaX);
      }
      if (direction.includes("w")) {
        const widthDelta = Math.min(
          deltaX,
          resizeState.startSize.width - minWidth
        );
        newWidth = resizeState.startSize.width - widthDelta;
        newX = resizeState.startPosition.x + widthDelta;
      }
      if (direction.includes("s")) {
        newHeight = Math.max(minHeight, resizeState.startSize.height + deltaY);
      }
      if (direction.includes("n")) {
        const heightDelta = Math.min(
          deltaY,
          resizeState.startSize.height - minHeight
        );
        newHeight = resizeState.startSize.height - heightDelta;
        newY = resizeState.startPosition.y + heightDelta;
      }

      // Apply max constraints
      if (maxWidth) newWidth = Math.min(maxWidth, newWidth);
      if (maxHeight) newHeight = Math.min(maxHeight, newHeight);

      // Update size and position with inline styles during resize
      const windowElement = windowRef.current;
      if (windowElement) {
        // Only apply styles if they're reasonable values
        if (newWidth > 0 && newHeight > 0) {
          windowElement.style.width = `${newWidth}px`;
          windowElement.style.height = `${newHeight}px`;
          windowElement.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      }
    },
    [resizeState, minWidth, minHeight, maxWidth, maxHeight]
  );

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (!resizeState.isResizing) return;

    const windowElement = windowRef.current;
    if (windowElement) {
      const rect = windowElement.getBoundingClientRect();

      // Update position
      if (onPositionChange) {
        onPositionChange({
          x: rect.left,
          y: rect.top,
        });
      }

      // Update size in state
      controls.onSizeChange({
        width: rect.width,
        height: rect.height,
      });

      // Don't clear inline styles - let the state update handle it
      // The state will override with the new size values
    }

    setResizeState({
      isResizing: false,
      direction: "",
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      startPosition: { x: 0, y: 0 },
    });
  }, [resizeState.isResizing, onPositionChange, controls]);

  // Handle double-click on titlebar
  const handleTitlebarDoubleClick = useCallback(() => {
    if (isMaximized) {
      controls.onMaximize(); // This should toggle back to restored state
    } else {
      // Center the window - for now just maximize it
      // In a real implementation, you'd calculate center position
      controls.onMaximize();
    }
  }, [isMaximized, controls]);

  // Handle close action
  const handleClose = useCallback(() => {
    if (showCloseConfirm && !skipCloseDialog) {
      setShowCloseDialog(true);
    } else {
      controls.onClose();
    }
  }, [showCloseConfirm, skipCloseDialog, controls]);

  const confirmClose = useCallback(() => {
    setShowCloseDialog(false);
    controls.onClose();
  }, [controls]);

  // Handle window click to bring to front
  const handleWindowClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't bring to front if clicking on buttons
      const target = e.target as HTMLElement;
      if (target.closest(".titlebar-button")) {
        return;
      }
      controls.onBringToFront();
    },
    [controls]
  );

  // Event listeners for dragging
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Event listeners for resizing
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.userSelect = "none";
      document.body.classList.add("resizing");

      // Set cursor based on resize direction
      const cursorMap: { [key: string]: string } = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "ne-resize",
        nw: "nw-resize",
        se: "se-resize",
        sw: "sw-resize",
      };
      document.body.style.cursor =
        cursorMap[resizeState.direction] || "default";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.body.classList.remove("resizing");
    }

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.body.classList.remove("resizing");
    };
  }, [
    resizeState.isResizing,
    resizeState.direction,
    handleResizeMove,
    handleResizeEnd,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isClosed || isMinimized) return;

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "w":
            e.preventDefault();
            handleClose();
            break;
          case "m":
            e.preventDefault();
            controls.onMinimize();
            break;
          case "Enter":
            if (e.shiftKey) {
              e.preventDefault();
              controls.onMaximize();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isClosed, isMinimized, handleClose, controls]);

  if (isClosed) {
    return null;
  }

  const windowClassNames = [
    "window",
    className,
    isMinimized ? "minimized" : "",
    isMaximized ? "maximized" : "",
    isClosing ? "closing" : "",
    dragState.isDragging ? "dragging" : "",
    resizeState.isResizing ? "resizing" : "",
    resizable ? "resizable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const windowStyle: React.CSSProperties = {
    transform: !isMaximized
      ? isClosing
        ? `translate(${position.x}px, ${position.y}px) scale(0.9)`
        : `translate(${position.x}px, ${position.y}px)`
      : undefined,
    opacity: isClosing ? 0 : undefined,
    transition:
      isClosing || resizeState.isResizing
        ? isClosing
          ? "transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
          : "none"
        : undefined,
    width: !isMaximized && state.size ? state.size.width : undefined,
    height: !isMaximized && state.size ? state.size.height : undefined,
    minWidth: minWidth,
    minHeight: minHeight,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    zIndex: state.zIndex || 1000,
  };

  return (
    <>
      <div
        ref={windowRef}
        className={windowClassNames}
        style={windowStyle}
        data-window-id={id}
      >
        {/* Window Titlebar */}
        <div
          className="window-titlebar"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleTitlebarDoubleClick}
          onClick={handleWindowClick}
          style={{
            cursor: isMaximized
              ? "default"
              : dragState.isDragging
                ? "grabbing"
                : "grab",
          }}
        >
          <div className="titlebar-buttons">
            <button
              className="titlebar-button close"
              onClick={handleClose}
              title="Close (⌘W)"
              aria-label="Close window"
            />
            <button
              className="titlebar-button minimize"
              onClick={controls.onMinimize}
              title={isMinimized ? "Restore (⌘M)" : "Minimize (⌘M)"}
              aria-label={isMinimized ? "Restore window" : "Minimize window"}
            />
            <button
              className={`titlebar-button maximize ${isMaximized ? "active" : ""}`}
              onClick={controls.onMaximize}
              title={isMaximized ? "Restore (⇧⌘↵)" : "Maximize (⇧⌘↵)"}
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
            />
          </div>

          <div className="titlebar-content">
            <div className="titlebar-title">{title}</div>
          </div>

          <div className="titlebar-spacer" />
        </div>

        {/* Window Content */}
        <div className="window-content" onClick={handleWindowClick}>
          <div style={{ filter: showCloseDialog ? "blur(2px)" : "none" }}>
            {children}
          </div>

          {/* Close Confirmation Dialog */}
          {!skipCloseDialog && (
            <ConfirmDialog
              isOpen={showCloseDialog}
              message={closeConfirmMessage}
              onConfirm={confirmClose}
              onCancel={() => setShowCloseDialog(false)}
              parentElement={null}
            />
          )}
        </div>

        {/* Resize Handles */}
        {resizable && !isMaximized && (
          <>
            <div
              className="resize-handle resize-n"
              onMouseDown={(e) => handleResizeStart(e, "n")}
            />
            <div
              className="resize-handle resize-s"
              onMouseDown={(e) => handleResizeStart(e, "s")}
            />
            <div
              className="resize-handle resize-e"
              onMouseDown={(e) => handleResizeStart(e, "e")}
            />
            <div
              className="resize-handle resize-w"
              onMouseDown={(e) => handleResizeStart(e, "w")}
            />
            <div
              className="resize-handle resize-ne"
              onMouseDown={(e) => handleResizeStart(e, "ne")}
            />
            <div
              className="resize-handle resize-nw"
              onMouseDown={(e) => handleResizeStart(e, "nw")}
            />
            <div
              className="resize-handle resize-se"
              onMouseDown={(e) => handleResizeStart(e, "se")}
            />
            <div
              className="resize-handle resize-sw"
              onMouseDown={(e) => handleResizeStart(e, "sw")}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Window;
