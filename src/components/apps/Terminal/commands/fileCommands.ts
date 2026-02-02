import { fileSystem } from "../../../../utils/terminalUtils";
import personalData from "../../../../../personal-data.json";
import type { CommandFunction } from "../types";

export const fileCommands: { [key: string]: CommandFunction } = {
  ls: () => [
    "Available sections:",
    "",
    "about.txt         - Personal information",
    "skills.txt        - Technical skills",
    "experience.txt    - Work experience",
    "projects.txt      - Personal projects",
    "education.txt     - Educational background",
    "certifications.txt- Certifications and courses",
    "awards.txt        - Awards and achievements",
    "leadership.txt    - Leadership experience",
    "contact.txt       - Contact information",
    "resume.pdf        - Resume document",
  ],

  cat: (args?: string[]) => {
    const file = args?.[0];
    if (!file) {
      return ["Usage: cat <filename>"];
    }

    switch (file) {
      case "about.txt":
        // We'll need to import these from the main commands object or personal commands
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "skills.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "experience.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "projects.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "education.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "certifications.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "awards.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "leadership.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "contact.txt":
        return [
          "Error: Command handler needs to be connected to personal commands",
        ];
      case "resume.pdf":
        return [
          'Error: cannot display binary file. Use "resume" command instead.',
        ];
      default:
        return [`cat: ${file}: No such file or directory`];
    }
  },

  tree: () => {
    const treeOutput = ["📁 Portfolio Structure:", ""];
    Object.keys(fileSystem).forEach((item) => {
      const file = fileSystem[item];
      if (file.type === "directory") {
        treeOutput.push(`📁 ${item}/`);
        if (file.children) {
          Object.keys(file.children).forEach((child) => {
            treeOutput.push(`  📄 ${child}`);
          });
        }
      } else {
        treeOutput.push(`📄 ${item}`);
      }
    });
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
    return [`/home/${personalData.username}/portfolio`];
  },

  whoami: () => {
    return [personalData.username];
  },
};
