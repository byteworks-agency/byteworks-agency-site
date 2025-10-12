/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "media",
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#06b6d4", // cyan-500
          soft: "#22d3ee", // cyan-400
          strong: "#0891b2", // cyan-600
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
