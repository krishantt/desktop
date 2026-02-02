export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[]) => string[];
}

export interface FileSystem {
  [key: string]: {
    type: "file" | "directory";
    content?: string;
    children?: FileSystem;
  };
}

export const fileSystem: FileSystem = {
  "about.txt": {
    type: "file",
    content: "Personal information about Krishant Timilsina",
  },
  "skills.txt": {
    type: "file",
    content: "Technical skills and expertise",
  },
  "experience.txt": {
    type: "file",
    content: "Professional work experience",
  },
  "projects.txt": {
    type: "file",
    content: "Featured projects and repositories",
  },
  "education.txt": {
    type: "file",
    content: "Educational background and qualifications",
  },
  "certifications.txt": {
    type: "file",
    content: "Certifications and professional courses",
  },
  "awards.txt": {
    type: "file",
    content: "Awards and achievements",
  },
  "leadership.txt": {
    type: "file",
    content: "Leadership experience and roles",
  },
  "contact.txt": {
    type: "file",
    content: "Contact information and social links",
  },
  "resume.pdf": {
    type: "file",
    content: "Resume document (binary file)",
  },
  blog: {
    type: "directory",
    children: {
      "chaos-engineering.md": {
        type: "file",
        content: "Blog post about chaos engineering",
      },
      "intro-to-go.md": {
        type: "file",
        content: "Introduction to Go programming language",
      },
    },
  },
  certificates: {
    type: "directory",
    children: {
      "azure-ai-fundamentals.pdf": {
        type: "file",
        content: "Microsoft Azure AI Fundamentals certificate",
      },
      "ai-ml-microdegree.pdf": {
        type: "file",
        content: "Fusemachines AI & Machine Learning Microdegree",
      },
    },
  },
};

export const formatOutput = (
  text: string,
  type: "success" | "error" | "warning" | "info" = "info"
): string => {
  const colors = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };
  return `${colors[type]} ${text}`;
};

export const createProgressBar = (
  progress: number,
  width: number = 20
): string => {
  const filled = Math.floor((progress / 100) * width);
  const empty = width - filled;
  return `[${"█".repeat(filled)}${" ".repeat(empty)}] ${progress}%`;
};

export const typewriterEffect = (
  text: string,
  delay: number = 50
): Promise<void> => {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
};

export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString();
};

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString();
};

export const getSystemInfo = () => {
  return {
    os: "TerminalOS 1.0",
    kernel: "Linux-like",
    uptime: "42 days",
    memory: "16GB",
    storage: "512GB SSD",
    terminal: "KrishantTerm v2.0",
  };
};

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const getRandomQuote = (): string => {
  const quotes = [
    "Code is poetry written for machines to dance to.",
    "The best error message is the one that never shows up.",
    "First, solve the problem. Then, write the code.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "The only way to learn a new programming language is by writing programs in it.",
    "Programs must be written for people to read, and only incidentally for machines to execute.",
    "Walking on water and developing software from a specification are easy if both are frozen.",
    "It's not a bug; it's an undocumented feature.",
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const validateCommand = (
  command: string,
  availableCommands: string[]
): boolean => {
  return availableCommands.includes(command.toLowerCase());
};

export const fuzzyMatch = (input: string, commands: string[]): string[] => {
  return commands.filter(
    (cmd) =>
      cmd.toLowerCase().includes(input.toLowerCase()) ||
      input.toLowerCase().includes(cmd.toLowerCase())
  );
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export const generateMockFileStats = () => {
  return {
    size: Math.floor(Math.random() * 10000) + 1000,
    modified: new Date(
      Date.now() - Math.random() * 10000000000
    ).toLocaleString(),
    permissions: "-rw-r--r--",
    owner: "krishant",
  };
};
