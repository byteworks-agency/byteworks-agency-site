import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  const secure = !!import.meta.env.PROD;
  const opts = { httpOnly: true as const, sameSite: 'Lax' as const, secure, path: '/' };
  cookies.set('sb-access-token', '', { ...opts, maxAge: 0 });
  cookies.set('sb-refresh-token', '', { ...opts, maxAge: 0 });
  cookies.set('admin_session', '', { ...opts, maxAge: 0 });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

