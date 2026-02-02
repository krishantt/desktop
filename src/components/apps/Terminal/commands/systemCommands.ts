import {
  getSystemInfo,
  getCurrentTime,
  getCurrentDate,
  getRandomQuote,
} from "../../../../utils/terminalUtils";
import type { CommandFunction } from "../types";

export const systemCommands: { [key: string]: CommandFunction } = {
  whoami: () => ["guest"],

  pwd: () => ["/home/guest/desktop"],

  date: () => [getCurrentDate()],

  time: () => [getCurrentTime()],

  uptime: () => {
    const info = getSystemInfo();
    return [`System uptime: ${info.uptime}`];
  },

  uname: () => {
    const info = getSystemInfo();
    return [
      `${info.os}`,
      `Kernel: ${info.kernel}`,
      `Terminal: ${info.terminal}`,
    ];
  },

  neofetch: () => {
    const info = getSystemInfo();
    return [
      "    ╭─────────────────────────────╮",
      "    │     System Information      │",
      "    ├─────────────────────────────┤",
      `    │ OS: ${info.os}           │`,
      `    │ Kernel: ${info.kernel}        │`,
      `    │ Uptime: ${info.uptime}           │`,
      `    │ Memory: ${info.memory}             │`,
      `    │ Storage: ${info.storage}        │`,
      `    │ Terminal: ${info.terminal}     │`,
      "    ╰─────────────────────────────╯",
      "",
      "🖥️ Welcome to Desktop Environment!",
    ];
  },

  ps: () => [
    "PID   COMMAND",
    "1     /init",
    "42    terminal",
    "100   desktop-env",
    "200   ai-chat",
    "300   pdf-viewer",
  ],

  echo: (args?: string[]) => {
    return args && args.length > 0 ? [args.join(" ")] : [""];
  },

  fortune: () => [getRandomQuote()],

  exit: () => [
    "Thanks for using Desktop Environment! 👋",
    "",
    "Terminal session ended.",
    "",
  ],
};
