import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const id = params.id as string | undefined;
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, code: 'validation_error', message: 'Missing quote id' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
      );
    }

    // Guard against placeholder paths like /api/quotes/{id}
    const isPlaceholder = id === '{id}' || id.includes('{') || id.includes('}');
    if (isPlaceholder) {
      return new Response(
        JSON.stringify({ ok: false, code: 'validation_error', message: 'Replace {id} with a real quote id' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
      );
    }

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
      createdAt: q.createdAt.toISOString(),
      validUntil: q.validUntil?.toISOString() || null,
      notes: q.notes || null,
      billToName: q.billToName || null,
      billToEmail: q.billToEmail || null,
      billToPhone: q.billToPhone || null,
      items: q.items
        .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((i: any) => ({
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
