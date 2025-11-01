<div align="center">
  <img src="https://byteworksagency.com/og-image.png" alt="ByteWorks" width="180" />

  # ByteWorks — Official Agency Website
  *Modern, bilingual web experiences for Caribbean & LATAM businesses.*

  [Site en producción](https://byteworksagency.com) · [Contacto](mailto:hello@byteworks.agency)
</div>

---

## 📣 Sobre el proyecto

Este repositorio contiene la web pública y el panel interno de ByteWorks.  
Se apoya en Astro para el front, Supabase/Postgres para datos y un flujo de billing propio que genera cotizaciones, facturas y recordatorios.

### Destacados
- Contenido bilingüe (EN/ES) con toggle automático.
- Tema light/dark persistente en el cliente.
- Panel `/admin` con autenticación por Supabase + fallback dev.
- Flujo de facturación: cotizaciones → aceptación → factura → pagos parciales → archivo automático.
- Notificaciones Slack opcionales para nuevos leads.
- Integraciones preparadas para CRM vía webhooks.

---

## 🛠️ Stack & Arquitectura

| Área             | Tecnología / Servicio |
|------------------|-----------------------|
| Frontend         | Astro 5, Tailwind CSS, TypeScript |
| Panel / UI       | Astro Islands + scripts vanilla |
| Datos            | Prisma ORM + Supabase Postgres |
| Deploy           | Vercel |
| Automatizaciones | Slack Incoming Webhook, Contact Webhook opcional |

### Diagrama rápido
```
Browser ──> Astro routes (public) ──┐
                                   ├─> API endpoints (/api/*) ──> Prisma ──> Supabase Postgres
Admin panel ──> Auth (Supabase) ───┘                         └─> Slack / Contact webhook (opcional)
```

---

## 🚀 Demo & Capturas

| Home bilingüe | Panel admin |
|---------------|-------------|
| ![Home](docs/screens/home.png) | ![Dashboard](docs/screens/admin-dashboard.png) |

> Si usas este repo en otro entorno asegúrate de retirar activos privados en `docs/screens`.

---

## 🧑‍💻 Guía de desarrollo

### Requisitos
- Node 20.x
- pnpm ≥ 9
- PostgreSQL (local o Supabase)

### Instalación
```bash
pnpm install
pnpm dev           # http://localhost:4321
```

### Scripts útiles
| Comando            | Descripción                                |
|--------------------|--------------------------------------------|
| `pnpm dev`         | Dev server con recarga en caliente         |
| `pnpm build`       | Genera la app para Vercel                  |
| `pnpm db:generate` | Prisma generate                            |
| `pnpm db:migrate`  | Ejecuta migraciones                        |
| `pnpm db:seed`     | Carga datos demo para billing/quotes       |

---

## 🔐 Variables de entorno

Copiar `.env.example` a `.env` y completar. Resumen:

| Variable             | Descripción                                     | Ejemplo / Nota |
|----------------------|-------------------------------------------------|----------------|
| `CONTACT_ENDPOINT`   | Webhook interno para reenviar el formulario     | `https://...`  |
| `SLACK_WEBHOOK_URL`  | Webhook Slack para avisos de nuevos leads       | `https://hooks.slack.com/...` |
| `DATABASE_URL`       | Conexión PgBouncer (producción)                 | `postgresql://...:6543/...` |
| `DIRECT_URL`         | Conexión directa (migraciones Prisma)           | `postgresql://...:5432/...` |
| `SUPABASE_URL`       | Proyecto Supabase                               | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY`  | Llave pública Supabase                          | `eyJhbGciOi...` |
| `PUBLIC_WHATSAPP_*`  | Datos mostrados en el sitio                     | Teléfono / mensaje |
| `ADMIN_SECRET`       | Fallback dev para acceder a `/admin`            | cadena aleatoria |

> No subas `.env` al repositorio. GitHub Push Protection bloqueará tokens reales.

---

## 📦 Flujo de billing (resumen funcional)

1. **Lead**: llega por formulario → se persiste y se envía a Slack / webhook.
2. **Cotización**: se crea vía `/admin/quotes`, se envía por correo y puede aceptarse con token.
3. **Conversión**: aceptar una cotización habilita la factura y permite archivarla al generar la siguiente (mensual/anual).
4. **Facturas**: pagos parciales, exportaciones CSV, recordatorios automáticos.
5. **Archivo**: al marcar “completed” la factura pasa a estado `archived` y se genera la del siguiente periodo.

---

## 🔄 Deploy

- **Proveedor:** Vercel.
- Variables obligatorias en Vercel: todas las listadas arriba.
- Migraciones: `pnpm db:migrate` (o `npx prisma migrate deploy`) vía hook.
- Asegúrate de tener `DIRECT_URL` disponible para migraciones en pipelines.

---

## 🧭 Roadmap corto

- Integrar firmas electrónicas en aceptación de cotizaciones.
- Conectar pagos en línea (Stripe).
- Automatizar recordatorios multi idioma vía correo.

---

## 🆘 Soporte / Contribuciones

- Para incidencias de la web oficial: `support@byteworks.agency`.
- Pull Requests: abrir issue antes de proponer cambios mayores.
- Este repositorio no acepta traducciones externas por ahora.

---

Hecho con ❤️ por el equipo de ByteWorks.
