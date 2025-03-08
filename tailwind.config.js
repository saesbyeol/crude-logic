/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#151c2c",
        card: "#1a2235",
        positive: "#2ebd85",
        negative: "#ff5252",
        border: "#2a3548",
      },
    },
  },
  plugins: [],
}; 