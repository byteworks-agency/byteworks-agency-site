# ADR 0001: Contexto inicial

- **Estado:** Aceptada
- **Fecha:** 2025-11-05
- **Entorno:** `/home/sirnadie/Documents/Projects/byteworks-agency-site`

## Contexto
Se identificó un proyecto Astro 5.15 con integraciones oficiales (`@astrojs/tailwind`, `@astrojs/sitemap`) y adaptador Vercel en modo serverless. El build `pnpm build` ejecuta `prisma generate` antes de `astro build`, por lo que Prisma 5.22 (PostgreSQL, cliente en `prisma/schema.prisma`) es parte crítica del flujo. Tailwind 3.4 define paleta y tipografías (`Inter`/`Manrope`) y se espera conservar estética Poppins/Inter con bordes suaves, sombras ligeras y gradiente destacado. No se detectó i18n ni configuraciones adicionales de rutas o runtime aparte de Vercel.

## Decisión
Documentar el stack y habilitar control de contexto automático mediante:
- `codex.context.md`: resumen técnico y de diseño.
- `codex.rules.md`: Anti-Change Protocol y recordatorio diff-only.
- `.codexignore`: exclusiones de contexto (node_modules, dist, env, logs, binarios, cache).
- `.codexrc.json`: referencia centralizada y modo `diff-only`.
- `docs/decisions/0001-contexto-inicial.md`: origen del stack, razones de despliegue serverless y compromiso de registrar futuras decisiones.

Se mantiene pnpm como gestor, scripts `pnpm db:*` para Prisma y despliegue en Vercel (`vercel.json`).

## Consecuencias
- Toda persona o agente debe consultar contexto y reglas antes de proponer cambios.
- Migraciones futuras requieren `pnpm db:migrate` y acompañar con ADR propio; regenerar el cliente con `pnpm db:generate` tras modificar `schema.prisma`.
- Cambios en configuración Astro/Tailwind/Vercel deben venir con análisis de impacto y plan de rollback explícito.
- El modo diff-only obliga a modificaciones atómicas y observables.

## Plan de rollback
Si fuera necesario revertir el control automático, eliminar `.codexrc.json`, `codex.context.md`, `codex.rules.md`, `.codexignore` y los ADR creados, restaurando el estado previo. Registrar la reversión en un nuevo ADR explicando motivos y efectos secundarios.
