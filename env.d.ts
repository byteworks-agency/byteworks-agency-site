/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly CONTACT_ENDPOINT: string; // server-only (Vercel)
  readonly PUBLIC_WHATSAPP_PHONE?: string;
  readonly PUBLIC_WHATSAPP_MSG?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
