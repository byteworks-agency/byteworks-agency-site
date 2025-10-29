import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json().catch(() => ({}));
    if (!email) {
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

    const origin = new URL(request.url).origin;
    const ALLOWED = (import.meta as any).env?.ADMIN_EMAIL as string | undefined;
    if (ALLOWED && email.toLowerCase() !== ALLOWED.toLowerCase()) {
      return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const redirectTo = `${origin}/auth/callback`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    if (error) {
      return new Response(JSON.stringify({ ok: false, code: 'send_failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
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
