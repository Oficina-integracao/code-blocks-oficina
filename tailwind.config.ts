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
        background: "var(--background)",
        foreground: "var(--foreground)",
        arduino: {
          teal: "#00979C",
          dark: "#006468",
          light: "#E5F5F5",
          orange: "#E47128",
        },
      },
    },
  },
  plugins: [],
};

export default config;
