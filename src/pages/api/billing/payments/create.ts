import type { APIRoute } from 'astro';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { paymentCreateBody } from '../../../../lib/billing/zod';
import { updateInvoiceStatusByDates } from '../../../../lib/billing/util';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const parse = paymentCreateBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { invoiceId, amount, method, receivedDate, ref, source, proofUrl, notes } = parse.data;
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });

    const amt = new Prisma.Decimal(amount);
    if (amt.gt(invoice.balance))
      return new Response(JSON.stringify({ ok: false, code: 'amount_exceeds_balance' }), { status: 400 });

    // Idempotency: unique (invoiceId, ref)
    const existing = await prisma.payment.findFirst({ where: { invoiceId, ref } });
    if (existing) return new Response(JSON.stringify({ ok: false, code: 'idempotent_conflict' }), { status: 409 });

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          invoiceId,
          method,
          amount: amt,
          receivedDate: new Date(receivedDate),
          ref,
          source: source || null,
          proofUrl: proofUrl || null,
          notes: notes || null,
        },
      });

      const newBalance = invoice.balance.sub(amt);
      const newStatus = updateInvoiceStatusByDates(invoice.status, newBalance, invoice.total, invoice.dueDate);
      await tx.invoice.update({ where: { id: invoiceId }, data: { balance: newBalance, status: newStatus } });
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
