import type { APIRoute } from 'astro';

export const prerender = false;

interface Payload {
  name: string;
  email: string;
  message: string;
  lang?: 'en' | 'es';
  sourceUrl?: string;
  waNumber?: string;
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
    const message = (data?.message || '').trim();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const meta = {
      lang: (data?.lang === 'es' ? 'es' : 'en'),
      sourceUrl: data?.sourceUrl || '',
      waNumber: (data?.waNumber || '').replace(/\D+/g, ''),
      ip: (request.headers.get('x-forwarded-for') || '').split(',')[0].trim(),
      ua: request.headers.get('user-agent') || '',
      ts: new Date().toISOString(),
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, meta }),
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
