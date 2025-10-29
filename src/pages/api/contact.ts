import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';

export const prerender = false;

interface Payload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  lang?: 'en' | 'es';
  sourceUrl?: string;
  preference?: 'whatsapp' | 'email';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const endpoint = import.meta.env.CONTACT_ENDPOINT;
    if (!endpoint) {
      return new Response(JSON.stringify({ ok: false, error: 'CONTACT_ENDPOINT not configured' }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data: Payload = await request.json().catch(() => ({} as Payload));
    const name = (data?.name || '').trim();
    const email = (data?.email || '').trim();
    const phone = (data?.phone || '').trim();
    const message = (data?.message || '').trim();
    const preference = (data?.preference === 'email' ? 'email' : 'whatsapp');

    if (!name || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing name or message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (preference === 'email' && !email) {
      return new Response(JSON.stringify({ ok: false, error: 'Email is required when preference is email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (preference === 'whatsapp' && !phone) {
      return new Response(JSON.stringify({ ok: false, error: 'Phone is required when preference is whatsapp' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const meta = {
      lang: (data?.lang === 'es' ? 'es' : 'en'),
      sourceUrl: data?.sourceUrl || '',
      phone: (phone || '').replace(/\D+/g, ''),
      preference,
      ip: (request.headers.get('x-forwarded-for') || '').split(',')[0].trim(),
      ua: request.headers.get('user-agent') || '',
      ts: new Date().toISOString(),
    };

    // Persist lead for dashboard
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email: email || '',
          phone: (phone || '').replace(/\D+/g, ''),
          message,
          preference: preference as any,
          lang: meta.lang,
          sourceUrl: meta.sourceUrl,
        },
      });
    } catch {}

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: email || '', message, meta }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return new Response(JSON.stringify({ ok: false, error: 'Upstream error', status: resp.status, body: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Unexpected error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
