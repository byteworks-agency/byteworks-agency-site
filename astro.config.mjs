import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", 
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false })],
  site: "https://byteworksagency.vercel.app",
  vite: { server: { fs: { strict: false } } },
});
