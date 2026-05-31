import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F5EFD7",
        ink: "#2C1810",
        gold: "#C8960C",
        "gold-light": "#E8B84B",
        "parchment-dark": "#E8DDB8",
        "ink-light": "#5C3D2E",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Source Serif 4'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
