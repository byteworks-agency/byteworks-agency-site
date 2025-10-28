import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const invoiceId = (body?.invoiceId || '').trim();
    if (!invoiceId) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
    if (!inv) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });
    if (inv.payments.length > 0) return new Response(JSON.stringify({ ok: false, code: 'invoice_cannot_void' }), { status: 400 });

    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'void' } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
