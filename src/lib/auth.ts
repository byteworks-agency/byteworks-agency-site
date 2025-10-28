import type { APIContext } from 'astro';

type Role = 'admin' | 'staff';

export async function requireRole(cookies: APIContext['cookies'], roles: Role[]) {
  // Fallback simple gate using ADMIN_SECRET cookie/header until Supabase auth is wired
  const ADMIN_SECRET = import.meta.env.ADMIN_SECRET as string | undefined;
  if (!ADMIN_SECRET) return { ok: true as const, user: null };
  const cookie = cookies.get('admin_session')?.value;
  const token = cookie; // could be extended to read header in integrations
  if (token !== ADMIN_SECRET) return { ok: false as const, code: 'forbidden' };
  if (!roles.includes('admin')) return { ok: false as const, code: 'forbidden' };
  return { ok: true as const, user: { role: 'admin' } as any, role: 'admin' };
}
