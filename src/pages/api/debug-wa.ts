import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const fromEnv = import.meta.env.PUBLIC_WHATSAPP_PHONE || '';
  return new Response(
    JSON.stringify({
      PUBLIC_WHATSAPP_PHONE: fromEnv,
      length: fromEnv.length,
      digitsOnly: fromEnv.replace(/\D+/g, '')
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};