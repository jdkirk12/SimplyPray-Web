import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0F9F4",
          100: "#CFE7DD",
          200: "#A8D5C0",
          300: "#7BAF9E",
          400: "#5A9A85",
          500: "#3A6F63",
          600: "#2F5C51",
          700: "#1F453B",
          800: "#143028",
          900: "#0A1B15",
        },
        sanctuary: {
          bg: "#F8F4EF",
          warm: "#F2EADC",
          pale: "#EBF5F1",
          hairline: "rgba(47,92,81,0.12)",
        },
        ink: {
          DEFAULT: "#1D2B27",
          mid: "#4A5C57",
          soft: "#7A8C87",
        },
        brass: {
          DEFAULT: "#B8935A",
          pale: "#F2E8D6",
        },
        danger: {
          DEFAULT: "#B4513F",
          pale: "#F9E7E0",
        },
        secondary: {
          100: "#D6EAF8",
          300: "#7FB6E3",
          500: "#2E5F87",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E8E8E8",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
        button: "999px",
      },
      boxShadow: {
        "sanctuary-xs": "0 2px 10px rgba(47,92,81,.06)",
        "sanctuary-sm": "0 6px 22px rgba(47,92,81,.08)",
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
