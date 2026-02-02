export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isClosed: boolean;
  isClosing: boolean;
  position: Position;
  size?: Size;
  zIndex?: number;
}

export interface WindowControls {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onRestore?: () => void;
  onBringToFront: () => void;
  onSizeChange: (size: Size) => void;
}

export interface DragState {
  isDragging: boolean;
  dragStart: Position;
}

export interface WindowProps {
  id: string;
  title: string;
  state: WindowState;
  controls: WindowControls;
  children: React.ReactNode;
  className?: string;
  resizable?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  showCloseConfirm?: boolean;
  closeConfirmMessage?: string;
  skipCloseDialog?: boolean;
  onPositionChange?: (position: Position) => void;
}

export interface DesktopIconProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

export interface AppInstance {
  id: string;
  name: string;
  component: React.ComponentType<{
    windowId: string;
    windowState: WindowState;
    windowControls: WindowControls;
    onPositionChange?: (position: Position) => void;
    [key: string]: unknown;
  }>;
  icon: React.ReactNode;
  state: WindowState;
  props?: Record<string, unknown>;
}

export interface DesktopState {
  apps: AppInstance[];
  activeAppId?: string;
  wallpaper?: string;
}
