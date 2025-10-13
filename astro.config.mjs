// astro.config.mjs
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless"; // 👈 usa /serverless
import tailwind from "@astrojs/tailwind"; // si lo usas

export default defineConfig({
  output: "server", // SSR porque usamos headers/redirect
  adapter: vercel(), // Vercel Serverless runtime
  integrations: [tailwind({ applyBaseStyles: false })],
  site: "https://byteworksagency.vercel.app", // ajusta al dominio final cuando lo tengas
  vite: { server: { fs: { strict: false } } },
});
