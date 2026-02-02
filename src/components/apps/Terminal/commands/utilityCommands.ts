import type { CommandFunction, HistoryItem } from "../types";

export const createUtilityCommands = (
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>,
  commandHistory: string[],
  windowControls?: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    openPDF?: () => void;
    openAIChat?: () => void;
  }
): { [key: string]: CommandFunction } => ({
  clear: () => {
    setHistory([]);
    return [];
  },

  history: () => {
    return commandHistory.length > 0
      ? commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`)
      : ["No commands in history"];
  },

  help: () => [
    "📚 Desktop Environment - Available Commands:",
    "",
    "🗂️  File Operations:",
    "  ls             - List files and applications",
    "  cat <file>     - Display file contents",
    "  tree           - Show directory structure",
    "  find <name>    - Find files by name",
    "",
    "⚙️  System Commands:",
    "  whoami         - Display current user",
    "  pwd            - Show current directory",
    "  date           - Show current date",
    "  time           - Show current time",
    "  uptime         - Show system uptime",
    "  uname          - Show system information",
    "  neofetch       - Display system info (fancy)",
    "  ps             - Show running processes",
    "",
    "🖥️  Applications:",
    "  ai             - Open AI Chat application",
    "  pdf            - Open PDF Viewer (if available)",
    "  terminal       - Current terminal session",
    "",
    "🎮 Fun Commands:",
    "  fortune        - Get a random programming quote",
    "  weather        - Check weather",
    "  music          - What's currently playing",
    "  coffee         - Brew some virtual coffee",
    "  matrix         - Enter the Matrix (with visual effects!)",
    "  joke           - Get a programming joke",
    "",
    "🔧 Utilities:",
    "  echo <text>    - Display text",
    "  history        - Show command history",
    "  clear          - Clear the terminal",
    "  window <action>- Control terminal window (minimize/maximize/close)",
    "  exit           - Close terminal",
    "",
    "💡 Pro tip: Try 'neofetch' for system info or 'matrix' for some fun!",
    "",
  ],

  window: (args?: string[]) => {
    if (!windowControls) {
      return ["Window controls not available"];
    }

    const action = args?.[0]?.toLowerCase();

    switch (action) {
      case "minimize":
      case "min":
        windowControls.minimize();
        return ["Window minimized"];
      case "maximize":
      case "max":
        windowControls.maximize();
        return ["Window maximized"];
      case "close":
        windowControls.close();
        return ["Closing window..."];
      default:
        return [
          "Window control commands:",
          "",
          "  window minimize  - Minimize the terminal window",
          "  window maximize  - Maximize/restore the terminal window",
          "  window close     - Close the terminal window",
          "",
          "Shortcuts: min, max for minimize/maximize",
        ];
    }
  },

  ai: () => {
    if (!windowControls?.openAIChat) {
      return ["AI Chat not available"];
    }

    windowControls.openAIChat();
    return [
      "🤖 AI Chat - Local Agent",
      "",
      "✅ Opening AI Chat window...",
      "",
      "Features:",
      "• Local LLM running in your browser",
      "• WebGPU acceleration",
      "• PDF document analysis",
      "• Offline capabilities",
      "",
      "Type 'help' in the AI Chat for commands!",
    ];
  },
});
