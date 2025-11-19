import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  // Disable dev login entirely in production
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ ok: false, code: 'disabled' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const secret = (import.meta.env as any).ADMIN_SECRET as string | undefined;
  if (!secret) {
    return new Response(
      JSON.stringify({ ok: false, code: 'not_configured', message: 'ADMIN_SECRET is not set' }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  }
  cookies.set('admin_session', secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    // Use secure cookies only in production (HTTPS). In dev (http://localhost), secure cookies won't be set.
    secure: !!import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
