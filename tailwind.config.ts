import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#000000",
        "canvas-subtle": "#080808",
        surface: {
          soft: "#121212",
          card: "#0d0d0d",
          elevated: "#181818",
          dark: "#050505",
        },
        hairline: {
          DEFAULT: "#222222",
          subtle: "#1a1a1a",
          strong: "#333333",
        },
        ink: {
          DEFAULT: "#ffffff",
          deep: "#f5f5f5",
          muted: "#a3a3a3",
          faint: "#555555",
        },
        terminal: {
          red: "#ff5f56",
          yellow: "#ffbd2e",
          green: "#27c93f",
        },
        brand: {
          base: "#0052FF",
        },
      },
      borderRadius: {
        xl: "12px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
