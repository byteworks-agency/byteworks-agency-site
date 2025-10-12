# ByteWorks Web Starter (Next.js App Router, Tailwind, EN/ES i18n)

Create a fresh Next.js project, then copy these files on top.

## Step-by-step
1) Create project and enter folder:
```bash
npx create-next-app@latest byteworks-site --ts --eslint --use-npm --app --tailwind --src-dir=false --import-alias "@/*"
cd byteworks-site
```
2) Copy the contents of this ZIP **into** your `byteworks-site/` (allow overwrite).
3) Install and run:
```bash
npm install
npm run dev
```
4) Open http://localhost:3000

## Edit content
- Texts & prices: `/data/en.json` and `/data/es.json`
- WhatsApp / Email buttons: `app/page.tsx`
- Colors: `tailwind.config.js` (brand colors)
- Logo: put your file in `/public/byteworks-logo.svg` and adjust `app/layout.tsx`

Notes:
- `app/page.tsx` is a Client Component (uses i18n hook).
- Global CSS lives in `app/globals.css` (Next.js convention).
