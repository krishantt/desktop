import { useState, useRef, useEffect } from "react";
import type { HistoryItem } from "../types";
import { createCommandRegistry } from "../commands";
import { executeCommand, handleKeyDown, createWelcomeMessage } from "../utils";

export const useTerminal = (windowControls?: {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  openPDF?: () => void;
  openAIChat?: () => void;
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showMatrix, setShowMatrix] = useState(false);
  const [tabCompletions, setTabCompletions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Create command registry with state setters
  const commands = createCommandRegistry(
    setHistory,
    commandHistory,
    setShowMatrix,
    windowControls
  );

  // Initialize with welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory([createWelcomeMessage()]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (terminalRef.current) {
        const windowContent = terminalRef.current.closest(
          ".window-content"
        ) as HTMLElement;

        if (windowContent) {
          windowContent.scrollTop = windowContent.scrollHeight;
        }
      }
    };

    // Use setTimeout to ensure DOM is updated
    setTimeout(scrollToBottom, 100);
  }, [history]);

  // Also auto-scroll when input gets focus to ensure it's visible
  useEffect(() => {
    if (inputRef.current && terminalRef.current) {
      const handleInputFocus = () => {
        setTimeout(() => {
          if (terminalRef.current) {
            const windowContent = terminalRef.current.closest(
              ".window-content"
            ) as HTMLElement;
            if (windowContent) {
              windowContent.scrollTop = windowContent.scrollHeight;
            }
          }
        }, 50);
      };

      const currentInput = inputRef.current;
      currentInput.addEventListener("focus", handleInputFocus);
      return () => {
        if (currentInput) {
          currentInput.removeEventListener("focus", handleInputFocus);
        }
      };
    }
  }, []);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Execute command handler
  const executeCommandHandler = (input: string) => {
    executeCommand(
      input,
      commands,
      commandHistory,
      setCommandHistory,
      setHistory
    );

    // Force scroll after command execution
    setTimeout(() => {
      if (terminalRef.current) {
        const windowContent = terminalRef.current.closest(
          ".window-content"
        ) as HTMLElement;
        if (windowContent) {
          windowContent.scrollTop = windowContent.scrollHeight;
        }
      }
    }, 150);
  };

  // Key down handler
  const handleKeyDownEvent = (e: React.KeyboardEvent) => {
    handleKeyDown(
      e,
      currentCommand,
      commandHistory,
      historyIndex,
      tabCompletions,
      tabIndex,
      commands,
      setCurrentCommand,
      setHistoryIndex,
      setTabCompletions,
      setTabIndex,
      executeCommandHandler
    );
  };

  return {
    // State
    history,
    currentCommand,
    showMatrix,

    // Refs
    inputRef,
    terminalRef,

    // Actions
    setCurrentCommand,
    handleTerminalClick,
    handleKeyDown: handleKeyDownEvent,

    // Computed
    commands,
  };
};
