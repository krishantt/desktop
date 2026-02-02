import { systemCommands } from "./systemCommands";
import { funCommands } from "./funCommands";
import { fileCommands } from "./fileCommands";
import { createUtilityCommands } from "./utilityCommands";
import type { Commands, HistoryItem } from "../types";

export const createCommandRegistry = (
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
  commandHistory: string[],
  setShowMatrix: (value: boolean) => void,
  windowControls?: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    openPDF?: () => void;
    openAIChat?: () => void;
  }
): Commands => {
  const utilityCommands = createUtilityCommands(
    setHistory,
    commandHistory,
    windowControls
  );

  // Enhanced fun commands with matrix functionality
  const enhancedFunCommands = {
    ...funCommands,
    matrix: () => {
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 5000);
      return funCommands.matrix();
    },
  };

  // Add PDF command
  const applicationCommands = {
    pdf: () => {
      if (windowControls && windowControls.openPDF) {
        windowControls.openPDF();
        return [
          "📄 PDF Viewer",
          "",
          "✅ Opening PDF Viewer application...",
          "",
          "You can view and interact with PDF documents here.",
        ];
      } else {
        return [
          "PDF Viewer not available in this session.",
          "",
          "The PDF Viewer application is not currently accessible.",
        ];
      }
    },
  };

  return {
    ...systemCommands,
    ...enhancedFunCommands,
    ...fileCommands,
    ...utilityCommands,
    ...applicationCommands,
  };
};

export * from "./systemCommands";
export * from "./funCommands";
export * from "./fileCommands";
export * from "./utilityCommands";
