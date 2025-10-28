/// <reference types="astro/client" />
interface ImportMetaEnv {
  // Server-side
  readonly CONTACT_ENDPOINT: string;
  readonly DATABASE_URL?: string;
  readonly ADMIN_SECRET?: string;
  readonly BILLING_ALLOW_PLACEHOLDER?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;

  // Public (exposed to client)
  readonly PUBLIC_WHATSAPP_PHONE?: string;
  readonly PUBLIC_WHATSAPP_MSG?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_CONTACT_PHONE?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN?: string;
  readonly PUBLIC_SOCIAL_TWITTER?: string;
  readonly PUBLIC_SOCIAL_LINKEDIN?: string;
  readonly PUBLIC_SOCIAL_INSTAGRAM?: string;
  readonly PUBLIC_SOCIAL_FACEBOOK?: string;
  readonly PUBLIC_SOCIAL_YOUTUBE?: string;
  readonly PUBLIC_SOCIAL_GITHUB?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
