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
          "blue-50": "#EEF4FE",
          "blue-100": "#D8E6FD",
          "blue-200": "#B4CDFA",
          "blue-600": "#0A4FB5",
          "blue-700": "#083C89",
          yellow: "#FFC107",
          "yellow-soft": "#FFE9A8",
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
        glow: "0 30px 80px -24px rgba(11, 94, 215, 0.45)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "fl-grid":
          "linear-gradient(to right, rgba(11,94,215,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,94,215,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "marquee-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-x": "marquee-x 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
