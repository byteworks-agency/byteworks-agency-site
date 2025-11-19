import { requireRole } from '@/lib/auth';
import { computeTotals, updateInvoiceStatusByDates } from '@/lib/billing/util';
import { updateInvoiceBody } from '@/lib/billing/zod';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const body = await request.json().catch(() => ({}));
    const parse = updateInvoiceBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });
    const { invoiceId, items, notes, currency, billToName, billToEmail, billToPhone } = parse.data;

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { items: true, payments: true } });
    if (!invoice) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });
    if (invoice.status !== 'draft')
      return new Response(JSON.stringify({ ok: false, code: 'validation_error', message: 'Only draft editable' }), {
        status: 400,
      });

    const mapped = items.map((i: any) => ({
      description: i.description,
      qty: new Prisma.Decimal(i.qty),
      unitPrice: new Prisma.Decimal(i.unitPrice),
      sort: i.sort ?? null,
    }));
    const totals = computeTotals(mapped);
    const paid = invoice.payments.reduce((acc: any, p: any) => acc.add(p.amount), new Prisma.Decimal(0));
    const newBalance = totals.total.sub(paid);
    const newStatus = updateInvoiceStatusByDates('draft', newBalance, totals.total, invoice.dueDate);

    await prisma.$transaction(async (tx: any) => {
      await tx.invoiceItem.deleteMany({ where: { invoiceId } });
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          currency: (currency || invoice.currency) as any,
          notes: notes ?? invoice.notes,
          billToName: billToName ?? invoice.billToName,
          billToEmail: billToEmail ?? invoice.billToEmail,
          billToPhone: billToPhone ?? invoice.billToPhone,
          subtotal: totals.subtotal,
          taxes: totals.taxes,
          total: totals.total,
          balance: newBalance,
          status: newStatus,
          items: { createMany: { data: mapped } },
        },
      });
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
