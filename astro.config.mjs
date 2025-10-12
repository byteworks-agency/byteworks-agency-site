import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const SITE_URL = "https://byteworksagency.vercel.app";

export default defineConfig({
  site: SITE_URL,
  integrations: [tailwind(), sitemap()],
});
