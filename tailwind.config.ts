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
        canvas: "var(--canvas)",
        "canvas-subtle": "var(--canvas-subtle)",
        surface: {
          soft: "var(--surface-soft)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
          dark: "var(--surface-dark)",
        },
        hairline: {
          DEFAULT: "var(--hairline)",
          subtle: "var(--hairline-subtle)",
          strong: "var(--hairline-strong)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          deep: "var(--ink-deep)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
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
