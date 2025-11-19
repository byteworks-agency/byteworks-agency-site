import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { APIRoute } from 'astro';
import { computeTotals, getBillingDefaults } from '../../../../lib/billing/util';
import { createInvoiceQuery } from '../../../../lib/billing/zod';

export const prerender = false;

export const POST: APIRoute = async ({ url, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const q = Object.fromEntries(url.searchParams.entries());
    const parse = createInvoiceQuery.safeParse(q);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { quoteId } = parse.data;
    const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } });
    if (!quote) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });
    if (quote.status !== 'accepted')
      return new Response(JSON.stringify({ ok: false, code: 'quote_not_acceptable' }), { status: 400 });

    const items = quote.items
      .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
      .map((i: any) => ({ qty: i.qty, unitPrice: i.unitPrice }));
    const totals = computeTotals(items);
    const defaults = await getBillingDefaults(prisma);

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + (defaults.dueDays * 24 * 60 * 60 * 1000));

    const invoice = await prisma.invoice.create({
      data: {
        customerId: quote.customerId,
        status: 'draft',
        currency: quote.currency,
        subtotal: totals.subtotal,
        taxes: totals.taxes,
        total: totals.total,
        balance: totals.total,
        billToName: quote.billToName,
        billToEmail: quote.billToEmail,
        billToPhone: quote.billToPhone,
        issueDate,
        dueDate,
        notes: `From Quote ${quote.id}`,
        number: quote.originEnquiryId || null,
        originQuoteId: quote.id,
        items: {
          create: quote.items.map((i: any) => ({
            description: i.description,
            qty: i.qty,
            unitPrice: i.unitPrice,
            sort: i.sort,
          })),
        },
      },
      select: { id: true },
    });

    return new Response(JSON.stringify({ ok: true, data: { invoiceId: invoice.id } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
