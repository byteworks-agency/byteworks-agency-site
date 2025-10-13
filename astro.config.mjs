---

## `/astro.config.mjs` (reemplazo completo)

> Define `site` para URLs canónicas, sitemap y robots correctos. No toco integraciones “raras”; sólo las comunes y seguras.

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// ⚠️ Ajusta a tu dominio final cuando lo tengas.
// Mientras tanto dejamos el de Vercel para no dejarlo vacío:
const SITE = 'https://byteworksagency.vercel.app';

export default defineConfig({
  site: SITE,
  integrations: [
    tailwind({
      // No forzamos config especial; usa tu tailwind.config.mjs
      applyBaseStyles: true,
    }),
    sitemap({
      filter: (page) => {
        // Opcional: si necesitas excluir páginas (drafts, etc.)
        return true;
      },
      i18n: {
        // Si no todas las rutas tienen mirror EN/ES, deja esto vacío
        // y usa <link rel="alternate"> en el layout (ya implementado).
      },
    }),
  ],
  // Si usas rutas con base, adapters, etc., agrégalo aquí.
  // output: 'static' | 'server' (por defecto queda en 'static' si no se cambia).
});
