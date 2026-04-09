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
          600: "#2D5A4F",
          700: "#1F453B",
          800: "#143028",
          900: "#0A1B15",
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
      borderRadius: {
        card: "20px",
        button: "25px",
      },
      fontFamily: {
        sans: [
          "ui-rounded",
          "SF Pro Rounded",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
