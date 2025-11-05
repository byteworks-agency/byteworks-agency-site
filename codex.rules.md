# Anti-Change Protocol

- Trabajar siempre en modo `diff-only`: cada cambio debe ser incremental y fácil de revertir.
- Antes de editar cualquier archivo, leer `./codex.context.md`, `./codex.rules.md` y ADR vigentes en `./docs/decisions/`.
- Sin tocar código/product assets salvo que exista solicitud explícita; priorizar documentación y control de contexto.
- Antes de modificar configuraciones (build, rutas, i18n, Prisma, deploy), explicar impacto, proponer rollback y validar dependencias.
- Mantener scripts pnpm (`pnpm dev`, `pnpm db:*`, `pnpm build`) como única fuente de verdad para tareas recurrentes.
- Registrar nuevas decisiones en `docs/decisions` siguiendo numeración incremental y conservar historial.
