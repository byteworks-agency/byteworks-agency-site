import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const body = await request.json().catch(() => ({} as any));
    const id = (body?.id || '').trim?.();
    const archived = Boolean(body?.archived);
    if (!id) return new Response(JSON.stringify({ ok: false, code: 'invalid_id' }), { status: 400 });

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { archived },
      select: { id: true, archived: true, status: true },
    }).catch((err: any) => {
      if ((err as any)?.code === 'P2025') return null; // record not found
      throw err;
    });
    if (!updated) return new Response(JSON.stringify({ ok: false, code: 'not_found' }), { status: 404 });

    return new Response(JSON.stringify({ ok: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message || 'Unexpected error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

