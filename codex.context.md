# Contexto técnico

## Stack detectado
- Astro 5.15 (ESM) con integraciones `@astrojs/tailwind`, `@astrojs/sitemap` y adaptador `@astrojs/vercel` en modo serverless; output `server` y bundler Vite/esbuild apuntando a `es2019`.
- Tailwind CSS 3.4 + PostCSS/autoprefixer, dark mode por `media`, fuentes extendidas y paleta definida en `tailwind.config.mjs`.
- Prisma 5.22 apuntando a PostgreSQL (`prisma/schema.prisma`), generación automática del cliente en `pnpm build`, scripts de base de datos via pnpm.
- Dependencias auxiliares: `@supabase/supabase-js` para integraciones remotas y `zod` para validación; soporte TypeScript mediante `tsconfig.json` y `env.d.ts`.

## Diseño y UX
- Tipografía base `Inter`/`Manrope`; mantener la dupla Poppins/Inter para piezas de marketing. Conservar bordes redondeados suaves (`borderRadius` extendido), sombras ligeras y al menos un gradiente hero conforme a la guía.
- Paleta principal declarada (`brand`, `primary`, `secondary`, fondos claro/oscuro) y modo oscuro automático; respetar estas claves al extender estilos.
- Tailwind opera con `applyBaseStyles: true`; revisar utilidades antes de añadir CSS global.

## Datos y backend
- Prisma usa `DATABASE_URL` y `DIRECT_URL` (sin pool) desde el entorno; ejecutar `pnpm db:migrate`/`pnpm db:generate` antes de builds que toquen el cliente.
- Migraciones almacenadas en `prisma/migrations`; semillas en `prisma/seed.mjs`.

## Localización
- No se detectó configuración i18n ni carpetas `locales`; cualquier internacionalización futura debe documentarse previamente.

## Entorno y despliegue
- `pnpm build` invoca `prisma generate` y `astro build`. Prever este paso en CI/CD.
- Objetivo de despliegue: Vercel (`vercel.json` define comandos, CSP y cabeceras). Mantener compatibilidad serverless (evitar dependencias de edge).

## Operativa
- Ejecutar scripts con pnpm (`pnpm dev`, `pnpm preview`, `pnpm db:*`).
- Antes de proponer cambios, revisar este archivo, `codex.rules.md` y ADR vigentes.
