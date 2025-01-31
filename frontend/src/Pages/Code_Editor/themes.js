import * as monaco from "monaco-editor";

export const THEMES = {
  "my-dark-theme": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "ffa500", fontStyle: "italic" },
      { token: "keyword", foreground: "ff007f", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#ffffff",
    },
  },
  "my-light-theme": {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "008000", fontStyle: "italic" },
      { token: "keyword", foreground: "0000ff", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#000000",
    },
  },
  "ocean-blue-theme": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "00ffff", fontStyle: "italic" },
      { token: "keyword", foreground: "00ffcc", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#003366",
      "editor.foreground": "#ccffff",
    },
  },
  "solarized-dark-theme": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
      { token: "keyword", foreground: "268bd2", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
    },
  },
  "midnight-purple-theme": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "d4acfc", fontStyle: "italic" },
      { token: "keyword", foreground: "bb86fc", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#1e0621",
      "editor.foreground": "#e3dfff",
    },
  },
};

export const registerThemes = () => {
  console.log('Registering themes...');
  Object.entries(THEMES).forEach(([themeName, themeConfig]) => {
    console.log(`Registering theme: ${themeName}`);
    monaco.editor.defineTheme(themeName, themeConfig);
  });
};
