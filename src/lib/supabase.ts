import { createClient } from '@supabase/supabase-js';
import type { APIContext } from 'astro';
const env = import.meta.env;

type SupaUser = {
  id: string;
  email?: string;
  [key: string]: any;
} | null;

function getEnv() {
  const url = env.SUPABASE_URL as string | undefined;
  const anon = env.SUPABASE_ANON_KEY as string | undefined;
  return { url, anon };
}

function extractAccessToken(cookies: APIContext['cookies']): string | undefined {
  // 1) New default cookie (if using custom integration)
  const direct = cookies.get('sb-access-token')?.value;
  if (direct) return direct;

  // 2) Auth helpers cookie: sb-<project-ref>-auth-token (JSON string)
  // We derive the project ref from SUPABASE_URL to avoid scanning all cookies (cookies.getAll is not available)
  const { url } = getEnv();
  let tokenCookieName = 'supabase-auth-token';
  if (url) {
    try {
      const u = new URL(url);
      const hostname = u.hostname; // e.g. "xyz.supabase.co"
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const ref = parts[0];
        tokenCookieName = `sb-${ref}-auth-token`;
      }
    } catch {}
  }

  const c = cookies.get(tokenCookieName) || cookies.get('supabase-auth-token');
  if (c?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(c.value));
      const token = parsed?.access_token || parsed?.currentSession?.access_token;
      if (typeof token === 'string' && token) return token;
    } catch {}
  }
  return undefined;
}

export async function getSupabaseUserFromCookies(cookies: APIContext['cookies']): Promise<SupaUser> {
  try {
    const { url, anon } = getEnv();
    if (!url || !anon) return null;
    const accessToken = extractAccessToken(cookies);
    if (!accessToken) return null;

    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user as any;
  } catch {
    return null;
  }
}
