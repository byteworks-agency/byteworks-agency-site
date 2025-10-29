import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const SUPABASE_URL = import.meta.env.SUPABASE_URL as string | undefined;
    const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY as string | undefined;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response('not_configured', { status: 500 });
    }

    const token_hash = url.searchParams.get('token_hash') || url.searchParams.get('token');
    const type = (url.searchParams.get('type') || 'magiclink') as any;
    const email = url.searchParams.get('email') || undefined;
    if (!token_hash || !email) {
      return new Response(null, { status: 307, headers: { Location: '/auth/signin?status=invalid' } });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type, email });
    if (error || !data?.session) {
      return new Response(null, { status: 307, headers: { Location: '/auth/signin?status=failed' } });
    }

    const ALLOWED = (import.meta as any).env?.ADMIN_EMAIL as string | undefined;
    const verifiedEmail = data.session.user?.email || email;
    if (ALLOWED && verifiedEmail && verifiedEmail.toLowerCase() !== ALLOWED.toLowerCase()) {
      return new Response(null, { status: 307, headers: { Location: '/auth/signin?status=forbidden' } });
    }

    const { access_token, refresh_token, expires_in } = data.session;
    const secure = !!import.meta.env.PROD;
    const maxAge = Math.max(60, Math.min(expires_in || 3600, 60 * 60 * 24));

    cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure,
      path: '/',
      maxAge,
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

    return new Response(null, { status: 307, headers: { Location: '/admin' } });
  } catch {
    return new Response(null, { status: 307, headers: { Location: '/auth/signin?status=error' } });
  }
};
