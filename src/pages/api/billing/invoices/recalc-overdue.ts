import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const now = new Date();
    const toUpdate = await prisma.invoice.findMany({
      where: {
        status: { in: ['sent', 'partial'] as any },
        dueDate: { lt: now },
        balance: { gt: '0.00' as any },
      },
      select: { id: true },
    });
    if (toUpdate.length === 0) return new Response(JSON.stringify({ ok: true, data: { updated: 0 } }), { status: 200 });
    await prisma.invoice.updateMany({ where: { id: { in: toUpdate.map((i) => i.id) } }, data: { status: 'overdue' } });
    return new Response(JSON.stringify({ ok: true, data: { updated: toUpdate.length } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
