import { fuzzyMatch } from "../../../utils/terminalUtils";
import type { Commands, HistoryItem } from "./types";

export const getTabCompletions = (
  input: string,
  commands: Commands
): string[] => {
  const availableCommands = Object.keys(commands);
  const [cmd, ...args] = input.trim().split(" ");

  if (args.length === 0) {
    // Complete command names
    return availableCommands.filter((command) =>
      command.startsWith(cmd.toLowerCase())
    );
  } else if (cmd === "cat") {
    // Complete file names for cat command
    const files = [
      "system.cfg",
      "README.md",
      "terminal",
      "ai-chat",
      "pdf-viewer",
    ];
    const lastArg = args[args.length - 1];
    return files.filter((file) => file.startsWith(lastArg.toLowerCase()));
  }

  return [];
};

export const handleTabCompletion = (
  currentCommand: string,
  commands: Commands,
  tabCompletions: string[],
  tabIndex: number,
  setTabCompletions: (completions: string[]) => void,
  setTabIndex: (index: number) => void
): string => {
  const completions = getTabCompletions(currentCommand, commands);

  if (completions.length === 0) {
    return currentCommand;
  }

  if (tabCompletions.length === 0) {
    setTabCompletions(completions);
    setTabIndex(0);
    return getCompletedCommand(currentCommand, completions[0]);
  }

  const newIndex = (tabIndex + 1) % completions.length;
  setTabIndex(newIndex);
  return getCompletedCommand(currentCommand, completions[newIndex]);
};

const getCompletedCommand = (input: string, completion: string): string => {
  const [cmd, ...args] = input.trim().split(" ");

  if (args.length === 0) {
    return completion + " ";
  } else {
    const newArgs = [...args];
    newArgs[newArgs.length - 1] = completion;
    return [cmd, ...newArgs].join(" ");
  }
};

export const executeCommand = (
  input: string,
  commands: Commands,
  commandHistory: string[],
  setCommandHistory: (history: string[]) => void,
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>
): string[] => {
  const trimmedInput = input.trim();

  if (!trimmedInput) return [];

  const [command, ...args] = trimmedInput.split(" ");
  let output: string[] = [];

  const commandFunction = commands[command.toLowerCase()];

  // Handle clear command specially - don't add to history
  if (command.toLowerCase() === "clear") {
    if (commandFunction) {
      commandFunction(args);
    }
    return [];
  }

  if (commandFunction) {
    try {
      output = commandFunction(args);
    } catch (error) {
      output = [`Error executing command: ${error}`];
    }
  } else {
    // Fuzzy matching for command suggestions
    const suggestions = fuzzyMatch(
      command.toLowerCase(),
      Object.keys(commands)
    );

    if (suggestions.length > 0) {
      output = [
        `Command '${command}' not found.`,
        "",
        `Did you mean: ${suggestions.slice(0, 3).join(", ")}?`,
        "",
        "Type 'help' for a list of available commands.",
      ];
    } else {
      output = [
        `Command '${command}' not found.`,
        "",
        "Type 'help' for a list of available commands.",
      ];
    }
  }

  // Update command history
  setCommandHistory([...commandHistory, trimmedInput]);

  // Add to terminal history
  const newHistoryItem: HistoryItem = {
    command: trimmedInput,
    output,
    type: commandFunction !== undefined ? "command" : "error",
  };

  setHistory((prev) => [...prev, newHistoryItem]);

  return output;
};

export const handleKeyDown = (
  e: React.KeyboardEvent,
  currentCommand: string,
  commandHistory: string[],
  historyIndex: number,
  tabCompletions: string[],
  tabIndex: number,
  commands: Commands,
  setCurrentCommand: (cmd: string) => void,
  setHistoryIndex: (index: number) => void,
  setTabCompletions: (completions: string[]) => void,
  setTabIndex: (index: number) => void,
  executeCommandHandler: (input: string) => void
): void => {
  if (e.key === "Enter") {
    e.preventDefault();
    executeCommandHandler(currentCommand);
    setCurrentCommand("");
    setHistoryIndex(-1);
    setTabCompletions([]);
    setTabIndex(-1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (commandHistory.length > 0) {
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[newIndex]);
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex !== -1) {
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      } else {
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const completedCommand = handleTabCompletion(
      currentCommand,
      commands,
      tabCompletions,
      tabIndex,
      setTabCompletions,
      setTabIndex
    );
    setCurrentCommand(completedCommand);
  } else {
    // Reset tab completion when typing
    if (e.key !== "Tab") {
      setTabCompletions([]);
      setTabIndex(-1);
    }
  }
};

export const createWelcomeMessage = (): HistoryItem => {
  const isMobile = window.innerWidth < 768;
  const isSmallMobile = window.innerWidth < 480;

  let logo: string[];

  if (isSmallMobile) {
    // Compact logo for very small screens
    logo = [
      "    ██████╗ ",
      "    ██╔══██╗",
      "    ██║  ██║",
      "    ██║  ██║",
      "    ██████╔╝",
      "    ╚═════╝ ",
      "",
      "    DESKTOP",
      "    Environment",
    ];
  } else if (isMobile) {
    // Medium logo for mobile
    logo = [
      "    ██████╗ ███████╗███████╗██╗  ██╗",
      "    ██╔══██╗██╔════╝██╔════╝██║ ██╔╝",
      "    ██║  ██║█████╗  ███████╗█████╔╝ ",
      "    ██║  ██║██╔══╝  ╚════██║██╔═██╗ ",
      "    ██████╔╝███████╗███████║██║  ██╗",
      "    ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝",
    ];
  } else {
    // Full logo for desktop
    logo = [
      "    ██████╗ ███████╗███████╗██╗  ██╗████████╗ ██████╗ ██████╗ ",
      "    ██╔══██╗██╔════╝██╔════╝██║ ██╔╝╚══██╔══╝██╔═══██╗██╔══██╗",
      "    ██║  ██║█████╗  ███████╗█████╔╝    ██║   ██║   ██║██████╔╝",
      "    ██║  ██║██╔══╝  ╚════██║██╔═██╗    ██║   ██║   ██║██╔═══╝ ",
      "    ██████╔╝███████╗███████║██║  ██╗   ██║   ╚██████╔╝██║     ",
      "    ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝     ",
    ];
  }

  return {
    command: "",
    output: [
      ...logo,
      "",
      "Welcome to Desktop Environment! 🖥️",
      "",
      "Interactive web-based desktop with terminal, AI chat, and PDF viewer.",
      "Type 'help' to see available commands.",
      "",
      "Built by Krishant Timilsina | github.com/krishantt",
      "",
    ],
    type: "output",
  };
};
