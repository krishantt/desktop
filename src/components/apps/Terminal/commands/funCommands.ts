import type { CommandFunction } from "../types";

export const funCommands: { [key: string]: CommandFunction } = {
  weather: () => [
    "🌤️  Current Weather in Nepal",
    "",
    "Temperature: 22°C",
    "Condition: Partly Cloudy",
    "Humidity: 65%",
    "Wind: 5 km/h",
    "",
    "Perfect coding weather! ☕",
  ],

  music: () => [
    "🎵 Currently Playing:",
    "",
    "♪ Lo-fi Hip Hop Radio - beats to relax/study to",
    "🔊 Volume: ████████░░ 80%",
    "⏱️  Duration: ∞",
    "",
    "The perfect coding soundtrack! 🎧",
  ],

  coffee: () => [
    "☕ Brewing coffee...",
    "",
    "[████████████████████] 100%",
    "",
    "☕ Coffee ready! Perfect for coding sessions.",
    "",
    "Productivity level: MAXIMUM ⚡",
  ],

  joke: () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
      "Why don't programmers like nature? It has too many bugs! 🌿",
      "What's a programmer's favorite hangout place? Foo Bar! 🍻",
      "Why did the developer go broke? Because he used up all his cache! 💰",
      "What do you call a programmer from Finland? Nerdic! 🇫🇮",
    ];

    return [jokes[Math.floor(Math.random() * jokes.length)]];
  },

  matrix: (_args?: string[], setShowMatrix?: (value: boolean) => void) => {
    if (setShowMatrix) {
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 5000);
    }

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const matrix = [];
    for (let i = 0; i < 10; i++) {
      let line = "";
      for (let j = 0; j < 50; j++) {
        line += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      matrix.push(line);
    }
    return [
      "🔴 Entering the Matrix...",
      "",
      ...matrix,
      "",
      "🔴 Welcome to the real world, Neo.",
    ];
  },
};
