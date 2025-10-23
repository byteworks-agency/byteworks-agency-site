/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "media",
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#06b6d4", // legacy brand
          soft: "#22d3ee",
          strong: "#0891b2",
        },
        primary: "#00BCD4",
        secondary: "#0097A7",
        "text-primary": "#FFFFFF",
        "text-secondary": "#E0E0E0",
        "background-light": "#F8F9FA",
        "background-dark": "#101c22",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
