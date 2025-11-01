import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

const SITE = "https://byteworksagency.com";

export default defineConfig({
  site: SITE,
  // Use Node/serverless runtime; Prisma is not supported on edge runtimes
  adapter: vercel({ mode: "serverless" }),
  output: "server",
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()],
  vite: {
    ssr: {
      external: ["@prisma/client", "@prisma/engines"],
    },
    build: {
      target: "es2019",
    },
    esbuild: {
      target: "es2019",
    },
  },
});
