import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#193F72",
          700: "#2957A2",
        },
        gold: {
          500: "#D7B56D",
        },
        carbon: "#2B2A29",
        steel: {
          500: "#7688A1",
        },
        surface: "#F1F2F7",
        border: "#D9DADA",
        "border-muted": "#B2B3B3",
        gray: {
          100: "#F1F2F7",
          600: "#898989",
        },
        green: {
          50: "#ECFDF5",
          600: "#059669",
        },
        red: {
          50: "#FEF2F2",
          600: "#DC2626",
        },
        amber: {
          50: "#FFFBEB",
          600: "#D97706",
        },
        blue: {
          50: "#EFF6FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "Fira Code", "monospace"],
        serif: ["var(--font-dm-serif)", "DM Serif Display", "Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
        button: "10px",
        input: "10px",
        tag: "6px",
        tooltip: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 12px rgba(25, 63, 114, 0.06)",
        "card-raised": "0 8px 24px rgba(25, 63, 114, 0.08)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
