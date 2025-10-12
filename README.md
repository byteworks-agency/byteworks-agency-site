# 🌐 ByteWorks Agency Site

**ByteWorks** — Websites that work for you, not against you.

> Professional, bilingual, responsive, and automation-ready websites for small businesses and personal brands.

---

## 🧱 Stack
- **Astro 4 + TailwindCSS 3**
- **PNPM** package manager
- **Automatic i18n detection (EN/ES)**
- **Dark/Light theme auto**
- **WhatsApp forms with .env integration**

---

## 🧩 Local Setup
```bash
pnpm install
pnpm dev

---

## ✅ SEO Checklist

- [ ] Set `site` in `astro.config.mjs` with your final domain.
- [ ] Add `og-image.svg` or a PNG at `/public/og-image.png` and update the path in `Base.astro`.
- [ ] Verify `<title>` and `<meta name="description">` per page (Home EN/ES).
- [ ] Confirm `hreflang` alternates (`/en/`, `/es/`) are correct.
- [ ] Test Open Graph (Facebook, LinkedIn) and Twitter Card with a live URL.
- [ ] Run a Lighthouse audit (Performance/SEO ≥ 90).
- [ ] Enable analytics (Cloudflare/Plausible) via `.env`.
- [ ] Submit sitemap to Google Search Console: `/sitemap-index.xml`.