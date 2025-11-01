<div align="center">
  <img src="https://byteworksagency.com/og-image.png" alt="ByteWorks" width="180" />

  # ByteWorks — Official Agency Website
  *Modern, bilingual web experiences tailored for entrepreneurs and small businesses.*

  [Live Site](https://byteworksagency.com)
</div>

---

## About the Project

This repository powers ByteWorks' public marketing site and the internal admin portal. It is built with Astro and TypeScript, features a bilingual content strategy (English/Spanish), and integrates a custom billing pipeline that manages quotes, invoices, and automated reminders.

### Highlights
- Bilingual content with SEO-friendly routes (EN/ES)
- Light/dark theme with client persistence
- `/admin` dashboard secured with Supabase Auth (plus dev fallback)
- Billing workflow: quotes → acceptance → invoice generation → partial payments → automatic archiving
- Optional Slack notifications for new leads

---

## Development Setup

### Requirements
- Node 20+
- pnpm ≥ 9
- PostgreSQL (local or Supabase/Neon)

### Install & Run
```bash
pnpm install
pnpm dev           # http://localhost:4321
```

### Handy Scripts
| Command            | Purpose                                 |
|--------------------|-----------------------------------------|
| `pnpm dev`         | Start the dev server (Astro)            |
| `pnpm build`       | Production build (Vercel adapter)       |
| `pnpm db:generate` | Prisma client generation                |
| `pnpm db:migrate`  | Apply database migrations               |
| `pnpm db:seed`     | Seed demo data for billing/quotes       |

---

## Billing Flow (Functional Overview)

1. **Lead capture** → stored via Prisma and (optionally) pushed to Slack/CRM.
2. **Quote creation** → built in `/admin/quotes`, shared via email, token-based acceptance.
3. **Conversion** → accepted quote enables invoice generation and schedules follow-up.
4. **Invoices** → support partial payments, CSV exports, reminder previews.
5. **Archiving** → "Mark completed" archives the current invoice and spins up the next period (monthly/annual).

---

## Short Roadmap
- Add e-signature support when accepting quotes.
- Integrate online payments (Stripe).
- Automate bilingual reminder emails.

---

Made with ❤️ by the ByteWorks team.
