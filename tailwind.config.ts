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
        fl: {
          blue: "#0B5ED7",
          "blue-dark": "#071A35",
          yellow: "#FFC107",
          white: "#FFFFFF",
          "gray-50": "#F8F9FB",
          "gray-100": "#F1F3F5",
          "gray-200": "#E9ECEF",
          "gray-300": "#DEE2E6",
          "gray-400": "#CED4DA",
          "gray-500": "#ADB5BD",
          "gray-600": "#6C757D",
          "gray-700": "#495057",
          "gray-800": "#343A40",
          "gray-900": "#212529",
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 12px 40px rgba(0, 0, 0, 0.08)",
        "soft-xl": "0 20px 60px rgba(0, 0, 0, 0.1)",
        floating: "0 24px 48px -12px rgba(11, 94, 215, 0.15)",
        card: "0 8px 32px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
