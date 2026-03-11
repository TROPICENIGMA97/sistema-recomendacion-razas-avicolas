import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        campo: {
          50:  "#f6fbf0",
          100: "#e8f5d8",
          200: "#d0eab5",
          300: "#aed889",
          400: "#86c05a",
          500: "#62a438",
          600: "#4a8229",
          700: "#3b6722",
          800: "#31521f",
          900: "#28431b",
        },
        tierra: {
          100: "#fef3dc",
          200: "#fde4a8",
          300: "#fbcc6b",
          400: "#f8b135",
          500: "#f59518",
          600: "#d9750e",
          700: "#b5540f",
          800: "#924114",
          900: "#783614",
        },
      },
    },
  },
  plugins: [],
};

export default config;
