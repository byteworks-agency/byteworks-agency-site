import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import type { APIRoute } from 'astro';
import { computeTotals } from '../../../lib/billing/util';
import { updateQuoteBody } from '../../../lib/billing/zod';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const body = await request.json().catch(() => ({}));
    const parse = updateQuoteBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });
    const { quoteId, items, notes, validUntil, currency, billToName, billToEmail, billToPhone } = parse.data;

    const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } });
    if (!quote) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });
    if (quote.status !== 'draft')
      return new Response(JSON.stringify({ ok: false, code: 'quote_not_acceptable', message: 'Only draft editable' }), {
        status: 400,
      });

    const mapped = items.map((i: any) => ({
      description: i.description,
      qty: new Prisma.Decimal(i.qty),
      unitPrice: new Prisma.Decimal(i.unitPrice),
      sort: i.sort ?? null,
    }));
    const totals = computeTotals(mapped);

    await prisma.$transaction(async (tx: any) => {
      await tx.quoteItem.deleteMany({ where: { quoteId } });
      await tx.quote.update({
        where: { id: quoteId },
        data: {
          currency: (currency || quote.currency) as any,
          validUntil: validUntil ? new Date(validUntil) : quote.validUntil,
          notes: notes ?? quote.notes,
          billToName: billToName ?? quote.billToName,
          billToEmail: billToEmail ?? quote.billToEmail,
          billToPhone: billToPhone ?? quote.billToPhone,
          subtotal: totals.subtotal,
          taxes: totals.taxes,
          total: totals.total,
          items: { createMany: { data: mapped } },
        },
      });
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
