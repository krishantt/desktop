import { personalCommands } from "./personalCommands";
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

  // Create a special cat command that can access personal commands
  const enhancedFileCommands = {
    ...fileCommands,
    cat: (args?: string[]) => {
      const file = args?.[0];
      if (!file) {
        return ["Usage: cat <filename>"];
      }

      switch (file) {
        case "about.txt":
          return personalCommands.about();
        case "skills.txt":
          return personalCommands.skills();
        case "experience.txt":
          return personalCommands.experience();
        case "projects.txt":
          return personalCommands.projects();
        case "education.txt":
          return personalCommands.education();
        case "certifications.txt":
          return personalCommands.certifications();
        case "awards.txt":
          return personalCommands.awards();
        case "leadership.txt":
          return personalCommands.leadership();
        case "contact.txt":
          return personalCommands.contact();
        case "resume.pdf":
          return [
            'Error: cannot display binary file. Use "resume" command instead.',
          ];
        default:
          return [`cat: ${file}: No such file or directory`];
      }
    },
  };

  // Create enhanced fun commands with matrix functionality
  const enhancedFunCommands = {
    ...funCommands,
    matrix: () => {
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 5000);
      return funCommands.matrix();
    },
  };

  // Create enhanced personal commands with window controls access
  const enhancedPersonalCommands = {
    ...personalCommands,
    resume: () => {
      // Open PDF viewer window if available, otherwise open in new tab
      if (windowControls && windowControls.openPDF) {
        windowControls.openPDF();
        return [
          "📄 Resume",
          "",
          "✅ Opening resume in PDF viewer...",
          "",
          "You can also find my complete resume on LinkedIn:",
          "https://linkedin.com/in/krishanttimil",
        ];
      } else {
        // Fallback to original resume command
        return personalCommands.resume();
      }
    },
  };

  return {
    ...enhancedPersonalCommands,
    ...systemCommands,
    ...enhancedFunCommands,
    ...enhancedFileCommands,
    ...utilityCommands,
  };
};

export * from "./personalCommands";
export * from "./systemCommands";
export * from "./funCommands";
export * from "./fileCommands";
export * from "./utilityCommands";
