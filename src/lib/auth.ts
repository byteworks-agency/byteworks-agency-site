import type { APIContext } from 'astro';
import { getSupabaseUserFromCookies } from './supabase';

type Role = 'admin' | 'staff';

export async function requireRole(cookies: APIContext['cookies'], roles: Role[]) {
  // 1) Try Supabase session from cookies
  const supaUser = await getSupabaseUserFromCookies(cookies);
  if (supaUser) {
    const ALLOWED = (import.meta as any).env?.ADMIN_EMAIL as string | undefined;
    const email = (supaUser as any)?.email as string | undefined;
    if (ALLOWED && (!email || email.toLowerCase() !== ALLOWED.toLowerCase())) {
      return { ok: false as const, code: 'forbidden' };
    }
    if (!roles.includes('admin')) return { ok: false as const, code: 'forbidden' };
    return { ok: true as const, user: { id: supaUser.id, role: 'admin' } as any, role: 'admin' };
  }

  // 2) Fallback simple gate using ADMIN_SECRET (dev only)
  const ADMIN_SECRET = import.meta.env.ADMIN_SECRET as string | undefined;
  if (!ADMIN_SECRET) return { ok: false as const, code: 'forbidden' };
  const cookie = cookies.get('admin_session')?.value;
  if (cookie !== ADMIN_SECRET) return { ok: false as const, code: 'forbidden' };
  if (!roles.includes('admin')) return { ok: false as const, code: 'forbidden' };
  return { ok: true as const, user: { role: 'admin' } as any, role: 'admin' };
}
