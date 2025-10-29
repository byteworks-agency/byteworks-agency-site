import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { access_token, refresh_token } = await request.json().catch(() => ({}));
    if (!access_token) {
      return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = import.meta.env.SUPABASE_URL as string | undefined;
    const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY as string | undefined;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ ok: false, code: 'not_configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${access_token}` } },
    });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return new Response(JSON.stringify({ ok: false, code: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ALLOWED = (import.meta as any).env?.ADMIN_EMAIL as string | undefined;
    const email = data.user.email || '';
    if (ALLOWED && email.toLowerCase() !== ALLOWED.toLowerCase()) {
      return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secure = !!import.meta.env.PROD;
    cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure,
      path: '/',
      maxAge: 60 * 60,
    });
    if (refresh_token) {
      cookies.set('sb-refresh-token', refresh_token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
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

