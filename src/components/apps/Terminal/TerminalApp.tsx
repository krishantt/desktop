import React from "react";
import Window from "../../ui/Window";
import type { WindowState, WindowControls } from "../../../types/window";
import { useTerminal } from "./hooks/useTerminal";
import MatrixBackground from "../../MatrixBackground";

import "./TerminalApp.css";

interface TerminalAppProps {
  windowId: string;
  windowState: WindowState;
  windowControls: WindowControls;
  onPositionChange?: (position: { x: number; y: number }) => void;
  openPDF?: () => void;
  openAIChat?: () => void;
}

const TerminalApp: React.FC<TerminalAppProps> = ({
  windowId,
  windowState,
  windowControls,
  onPositionChange,
  openPDF,
  openAIChat,
}) => {
  const {
    history,
    currentCommand,
    showMatrix,
    inputRef,
    terminalRef,
    setCurrentCommand,
    handleTerminalClick,
    handleKeyDown,
  } = useTerminal({
    minimize: windowControls.onMinimize,
    maximize: windowControls.onMaximize,
    close: windowControls.onClose,
    openPDF: openPDF,
    openAIChat: openAIChat,
  });

  const terminalTitle = `guest@desktop - Terminal${
    windowState.isMinimized
      ? " (minimized)"
      : windowState.isMaximized
        ? " (maximized)"
        : ""
  }`;

  return (
    <Window
      id={windowId}
      title={terminalTitle}
      state={windowState}
      controls={windowControls}
      showCloseConfirm={true}
      closeConfirmMessage="Are you sure you want to close the terminal? Any unsaved work will be lost."
      className="terminal-window"
      resizable={true}
      minWidth={400}
      minHeight={300}
      maxHeight={600}
      onPositionChange={onPositionChange}
    >
      {showMatrix && <MatrixBackground />}

      <div ref={terminalRef} className="terminal" onClick={handleTerminalClick}>
        <div className="terminal-content">
          {history.map((item, index) => (
            <div key={index} className="terminal-line">
              {item.command && (
                <div className="command-line">
                  <span className="prompt">guest@desktop:~$</span>
                  <span className="command">{item.command}</span>
                </div>
              )}
              <div className={`output ${item.type}`}>
                {item.output.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`output-line ${line.includes("█") || line.includes("╗") || line.includes("╔") || line.includes("║") ? "ascii-art" : ""}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="input-line">
            <span className="prompt">guest@desktop:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="command-input"
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>
      </div>
    </Window>
  );
};

export default TerminalApp;
