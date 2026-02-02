import { fileSystem } from "../../../../utils/terminalUtils";
import type { CommandFunction } from "../types";

export const fileCommands: { [key: string]: CommandFunction } = {
  ls: () => [
    "Available applications and files:",
    "",
    "terminal          - Terminal application",
    "ai-chat           - AI Chat application",
    "pdf-viewer        - PDF Viewer application",
    "system.cfg        - System configuration",
    "apps/             - Applications directory",
    "documents/        - Documents directory",
    "downloads/        - Downloads directory",
    "",
    "Use 'help' for available commands",
  ],

  cat: (args?: string[]) => {
    const file = args?.[0];
    if (!file) {
      return ["Usage: cat <filename>"];
    }

    switch (file) {
      case "system.cfg":
        return [
          "# Desktop Environment Configuration",
          "",
          "version=1.0.0",
          "theme=dark",
          "terminal_enabled=true",
          "ai_chat_enabled=true",
          "pdf_viewer_enabled=true",
          "",
        ];
      case "README.md":
        return [
          "# Desktop Environment",
          "",
          "Interactive web-based desktop environment with:",
          "- Terminal application with command support",
          "- AI Chat application for conversations",
          "- PDF Viewer for document viewing",
          "",
          "Built with React, TypeScript, and modern web technologies.",
          "",
          "Created by Krishant Timilsina",
          "GitHub: https://github.com/krishantt",
        ];
      default:
        return [`cat: ${file}: No such file or directory`];
    }
  },

  tree: () => {
    const treeOutput = ["📁 Desktop Environment Structure:", ""];
    treeOutput.push("📁 home/guest/desktop/");
    treeOutput.push("├── 📁 apps/");
    treeOutput.push("│   ├── 📄 terminal");
    treeOutput.push("│   ├── 📄 ai-chat");
    treeOutput.push("│   └── 📄 pdf-viewer");
    treeOutput.push("├── 📁 documents/");
    treeOutput.push("├── 📁 downloads/");
    treeOutput.push("├── 📄 system.cfg");
    treeOutput.push("└── 📄 README.md");
    return treeOutput;
  },

  find: (args?: string[]) => {
    if (!args || args.length === 0) {
      return ["Usage: find <filename>"];
    }

    const searchTerm = args[0].toLowerCase();
    const found: string[] = [];

    Object.keys(fileSystem).forEach((item) => {
      if (item.toLowerCase().includes(searchTerm)) {
        found.push(item);
      }

      if (fileSystem[item].type === "directory" && fileSystem[item].children) {
        Object.keys(fileSystem[item].children!).forEach((child) => {
          if (child.toLowerCase().includes(searchTerm)) {
            found.push(`${item}/${child}`);
          }
        });
      }
    });

    return found.length > 0
      ? found
      : [`No files found matching '${searchTerm}'`];
  },

  pwd: () => {
    return ["/home/guest/desktop"];
  },

  whoami: () => {
    return ["guest"];
  },
};
