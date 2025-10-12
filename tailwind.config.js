/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind v4 no requiere `content`. Mantén los breakpoints clásicos explícitos.
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // `max-w-6xl` ya existe por defecto (72rem), lo dejo aquí por claridad.
      maxWidth: {
        "6xl": "72rem",
      },
    },
  },
  plugins: [],
};
