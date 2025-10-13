import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

const SITE = "https://byteworksagency.vercel.app";

export default defineConfig({
  site: SITE,
  adapter: vercel({ mode: "serverless" }), 
  output: "server",
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()],
});
