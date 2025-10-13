import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless"; // 👈 serverless (no /server)
import tailwind from "@astrojs/tailwind"; // si lo usas

export default defineConfig({
  // Usamos SSR porque lees headers (detección de idioma / 404 con headers)
  output: "server",

  adapter: vercel(), // Vercel serverless runtime

  integrations: [
    tailwind({ applyBaseStyles: false }), // si ya tienes estilos base, déjalo en false
  ],

  // Opcional: ajusta a tu deploy real para canónicos/og:url
  site: "https://byteworks-agency-site.vercel.app",

  vite: {
    server: {
      fs: { strict: false },
    },
  },
});
