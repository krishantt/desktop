export interface HistoryItem {
  command: string;
  output: string[];
  type: "command" | "output" | "error";
}

export interface CommandFunction {
  (args?: string[]): string[];
}

export interface Commands {
  [key: string]: CommandFunction;
}

export interface TerminalState {
  history: HistoryItem[];
  currentCommand: string;
  commandHistory: string[];
  historyIndex: number;
  showMatrix: boolean;
  tabCompletions: string[];
  tabIndex: number;
}

export interface FileSystemItem {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: FileSystemItem[];
}

export interface TabCompletionResult {
  completions: string[];
  commonPrefix: string;
}
