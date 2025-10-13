import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // usamos SSR (detección de idioma/headers)
  adapter: vercel(), // runtime vercel (serverless por defecto)
  integrations: [tailwind({ applyBaseStyles: false })],
  site: "https://byteworksagency.vercel.app",
  // Quita la relajación de fs.strict para evitar el aviso de seguridad
  // Si antes pusimos algo, lo removemos:
  // vite: { server: { fs: { strict: false } } },
});
