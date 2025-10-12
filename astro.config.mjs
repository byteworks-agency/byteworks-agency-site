import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const SITE_URL = "https://byteworksagency.vercel.app";

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind(),
    sitemap({
      serialize(item) {
        // Prioriza home y páginas raíz
        const url = new URL(item.url, SITE_URL).pathname;
        let priority = 0.6;
        let changefreq = "monthly";

        if (url === "/en/" || url === "/es/") {
          priority = 1.0;
          changefreq = "weekly";
        } else if (url.endsWith("/contact")) {
          priority = 0.7;
          changefreq = "monthly";
        } else if (url.endsWith("/terms") || url.endsWith("/privacy")) {
          priority = 0.4;
          changefreq = "yearly";
        }

        return {
          ...item,
          priority,
          changefreq,
        };
      },
    }),
  ],
});
