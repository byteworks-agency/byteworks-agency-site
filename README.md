# ByteWorks — Agency Website (Astro + Tailwind)

Official website of **ByteWorks**. Built with **Astro 5** and **Tailwind CSS**.  
Bilingual content (**EN/ES**), dark/light mode, and Vercel deployment.

## Tech Stack
- **Astro 5**
- **Tailwind CSS 3**
- **TypeScript**
- Package manager: **pnpm**
- Hosting: **Vercel**

## Getting Started

```bash
pnpm install
pnpm dev
# http://localhost:4321
```

## Environment Variables

- Copy `.env.example` to `.env` and adjust values for your setup.
- Required for database-backed admin pages: set `DATABASE_URL` to a valid Postgres connection string.
- For the contact API, set `CONTACT_ENDPOINT` (server-only). If you already have `PUBLIC_CONTACT_ENDPOINT`, keep it and also set `CONTACT_ENDPOINT` to the same URL.
- Frontend WhatsApp config:
  - `PUBLIC_WHATSAPP_PHONE` (e.g., 18687759858)
  - `PUBLIC_WHATSAPP_MSG` (plain text message)

## Database (Prisma / Postgres)

If you want to use the admin billing/quotes features:

```bash
# 1) Ensure Postgres is running and DATABASE_URL is set in .env

# 2) Generate client and run migrations
pnpm db:generate
pnpm db:migrate

# 3) (Optional) Seed sample data
pnpm db:seed
```

You can use a local Postgres or a hosted provider like Supabase/Neon. The connection string format is:

```
postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public
```
