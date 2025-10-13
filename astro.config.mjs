import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless'; // puedes usar '/edge' si prefieres Edge

const SITE = 'https://byteworksagency.vercel.app';

export default defineConfig({
  site: SITE,
  adapter: vercel(),        // <— Clave para Vercel si hay SSR
  output: 'server',         // explícito para SSR (puedes omitirlo, pero así es más claro)
  integrations: [
    tailwind({ applyBaseStyles: true }),
    sitemap(),
  ],
});
