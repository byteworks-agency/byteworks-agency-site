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

    const inv = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
    if (!inv) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });

    const paid = inv.payments.reduce((acc, p) => acc.add(p.amount), inv.total.minus(inv.total));

    const data = {
      id: inv.id,
      status: inv.status,
      currency: inv.currency,
      subtotal: inv.subtotal.toString(),
      taxes: inv.taxes.toString(),
      total: inv.total.toString(),
      balance: inv.balance.toString(),
      paid: paid.toString(),
      issueDate: inv.issueDate.toISOString(),
      dueDate: inv.dueDate.toISOString(),
      notes: inv.notes || null,
      billToName: inv.billToName || null,
      billToEmail: inv.billToEmail || null,
      billToPhone: inv.billToPhone || null,
      items: inv.items
        .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((i) => ({
          id: i.id,
          description: i.description,
          qty: i.qty.toString(),
          unitPrice: i.unitPrice.toString(),
          sort: i.sort ?? null,
        })),
      payments: inv.payments
        .sort((a, b) => a.receivedDate.getTime() - b.receivedDate.getTime())
        .map((p) => ({
          id: p.id,
          method: p.method,
          amount: p.amount.toString(),
          receivedDate: p.receivedDate.toISOString(),
          ref: p.ref,
          source: p.source,
          proofUrl: p.proofUrl,
          notes: p.notes,
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
