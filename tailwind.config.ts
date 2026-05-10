import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["DM Sans", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
