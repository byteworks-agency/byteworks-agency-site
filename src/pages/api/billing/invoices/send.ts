import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { invoiceNumberPrefix, formatInvoiceNumber } from '../../../../lib/billing/ids';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const invoiceId = (body?.invoiceId || '').trim();
    if (!invoiceId) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    let inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
    if (!inv) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });

    const prefix = invoiceNumberPrefix();
    let number = inv.number;
    if (!number) {
      // naive sequence: count existing with same prefix
      const count = await prisma.invoice.count({ where: { number: { startsWith: prefix } } });
      number = formatInvoiceNumber(prefix, count + 1);
    }

    inv = await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'sent', number } });
    return new Response(JSON.stringify({ ok: true, data: { invoiceId, number } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
