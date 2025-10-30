import { createClient } from '@supabase/supabase-js';
const env = import.meta.env;
import type { APIContext } from 'astro';

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
  const all = cookies.getAll();
  for (const c of all) {
    if (/^sb-.*-auth-token$/.test(c.name) || c.name === 'supabase-auth-token') {
      try {
        const parsed = JSON.parse(decodeURIComponent(c.value));
        const token = parsed?.access_token || parsed?.currentSession?.access_token;
        if (typeof token === 'string' && token) return token;
      } catch {}
    }
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
