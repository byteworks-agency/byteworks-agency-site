import type { APIRoute } from 'astro';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { createQuoteBody, createQuoteQuery } from '../../../lib/billing/zod';
import { computeTotals, getBillingDefaults } from '../../../lib/billing/util';
import { requireRole } from '@/lib/auth';

export const prerender = false;

// TODO: replace with Supabase Auth guard
async function requireStaff() {
  return { ok: true as const };
}

export const POST: APIRoute = async ({ request, url, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const qparse = createQuoteQuery.safeParse(Object.fromEntries(url.searchParams.entries()));
    if (!qparse.success)
      return new Response(JSON.stringify({ ok: false, code: 'validation_error', message: 'Invalid enquiryId' }), {
        status: 400,
      });
    const body = await request.json().catch(() => ({}));
    const bparse = createQuoteBody.safeParse(body);
    if (!bparse.success)
      return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { enquiryId } = qparse.data;
    // Resolve customer: prefer explicit customerId; otherwise allow placeholder in dev.
    let customerId = (body?.customerId as string | undefined)?.trim();
    if (!customerId) {
      const allowPlaceholder = String(import.meta.env.BILLING_ALLOW_PLACEHOLDER || 'true') === 'true';
      if (!allowPlaceholder) {
        return new Response(JSON.stringify({ ok: false, code: 'customer_missing' }), { status: 400 });
      }
      customerId = `from_enquiry_${enquiryId}`; // placeholder for dev
    }
    const { dueDays: _d, currency: defaultCurrency } = await getBillingDefaults(prisma);

    const itemsInput = (bparse.data.items && bparse.data.items.length > 0)
      ? bparse.data.items
      : [{ description: 'Service per enquiry', qty: '1.00', unitPrice: '0.00' }];

    const items = itemsInput.map((i) => ({
      description: i.description,
      qty: new Prisma.Decimal(i.qty),
      unitPrice: new Prisma.Decimal(i.unitPrice),
      sort: i.sort,
    }));
    const totals = computeTotals(items);

    const quote = await prisma.quote.create({
      data: {
        customerId,
        status: 'draft',
        currency: (bparse.data.currency || defaultCurrency) as any,
        subtotal: totals.subtotal,
        taxes: totals.taxes,
        total: totals.total,
        billToName: bparse.data.billToName || null,
        billToEmail: bparse.data.billToEmail || null,
        billToPhone: bparse.data.billToPhone || null,
        validUntil: bparse.data.validUntil ? new Date(bparse.data.validUntil) : null,
        notes: bparse.data.notes || null,
        originEnquiryId: enquiryId,
        items: {
          create: items,
        },
      },
      select: { id: true },
    });

    return new Response(JSON.stringify({ ok: true, data: { quoteId: quote.id } }), {
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
