import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const body = await request.json().catch(() => ({} as any));
    const id = (body?.id || '').trim?.();
    if (!id) return new Response(JSON.stringify({ ok: false, code: 'invalid_id' }), { status: 400 });

    const removed = await prisma.contactSubmission.delete({
      where: { id },
      select: { id: true },
    }).catch((err) => {
      if ((err as any)?.code === 'P2025') return null;
      throw err;
    });
    if (!removed) return new Response(JSON.stringify({ ok: false, code: 'not_found' }), { status: 404 });

    return new Response(JSON.stringify({ ok: true, data: removed }), {
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

