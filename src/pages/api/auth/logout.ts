import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Standard app cookies
    const names = [
      'sb-access-token',
      'sb-refresh-token',
      'admin_session',
      'supabase-auth-token',
    ];

    // Also remove any Supabase helper cookies if present (sb-<project>-auth-token)
    try {
      const all = cookies.getAll();
      for (const c of all) {
        if (/^sb-.*-auth-token$/i.test(c.name)) names.push(c.name);
      }
    } catch {}

    const secure = !!import.meta.env.PROD;
    for (const name of Array.from(new Set(names))) {
      cookies.set(name, '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'Lax',
        secure,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

