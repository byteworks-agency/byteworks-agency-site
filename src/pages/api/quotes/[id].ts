import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const id = params.id as string | undefined;
    if (!id) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const q = await prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!q) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });

    const data = {
      id: q.id,
      originEnquiryId: q.originEnquiryId || null,
      status: q.status,
      currency: q.currency,
      subtotal: q.subtotal.toString(),
      taxes: q.taxes.toString(),
      total: q.total.toString(),
      validUntil: q.validUntil?.toISOString() || null,
      notes: q.notes || null,
      billToName: q.billToName || null,
      billToEmail: q.billToEmail || null,
      billToPhone: q.billToPhone || null,
      items: q.items
        .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((i) => ({
          id: i.id,
          description: i.description,
          qty: i.qty.toString(),
          unitPrice: i.unitPrice.toString(),
          sort: i.sort ?? null,
        })),
    };

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
