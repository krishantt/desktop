import {
  getSystemInfo,
  getCurrentTime,
  getCurrentDate,
  getRandomQuote,
} from "../../../../utils/terminalUtils";
import personalData from "../../../../../personal-data.json";
import type { CommandFunction } from "../types";

export const systemCommands: { [key: string]: CommandFunction } = {
  whoami: () => [personalData.username],

  pwd: () => [`/home/${personalData.username}/portfolio`],

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
      "🚀 Welcome to my digital space!",
    ];
  },

  ps: () => [
    "PID   COMMAND",
    "1     /init",
    "42    terminal",
    "100   portfolio-app",
    "200   creativity.exe",
    "300   coffee-break",
  ],

  echo: (args?: string[]) => {
    return args && args.length > 0 ? [args.join(" ")] : [""];
  },

  fortune: () => [getRandomQuote()],

  exit: () => [
    "Thanks for visiting! 👋",
    "",
    "Connection to krishant.com.np closed.",
    "",
  ],
};
