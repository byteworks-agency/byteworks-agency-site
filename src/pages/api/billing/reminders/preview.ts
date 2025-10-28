import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { remindersPreviewBody } from '../../../../lib/billing/zod';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const parse = remindersPreviewBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { invoiceId, template } = parse.data;
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return new Response(JSON.stringify({ ok: false, code: 'invoice_not_found' }), { status: 404 });

    const INV = invoice.number || invoice.id;
    const dueDate = invoice.dueDate.toISOString().slice(0, 10);
    const total = invoice.total.toString();
    const paid = invoice.total.sub(invoice.balance).toString();
    const balance = invoice.balance.toString();

    const en = {
      due_Tminus3: `Friendly reminder: Invoice ${INV} is due on ${dueDate}. Total ${invoice.currency} ${total}, Paid ${paid}, Balance ${balance}.`,
      due_day0: `Invoice ${INV} is due today (${dueDate}). Balance due ${invoice.currency} ${balance}.`,
      due_plus3: `Past due: Invoice ${INV} was due on ${dueDate}. Remaining balance ${invoice.currency} ${balance}.`,
    }[template];
    const es = {
      due_Tminus3: `Recordatorio: la factura ${INV} vence el ${dueDate}. Total ${invoice.currency} ${total}, Pagado ${paid}, Saldo ${balance}.`,
      due_day0: `La factura ${INV} vence hoy (${dueDate}). Saldo a pagar ${invoice.currency} ${balance}.`,
      due_plus3: `Vencida: la factura ${INV} venció el ${dueDate}. Saldo pendiente ${invoice.currency} ${balance}.`,
    }[template];

    return new Response(JSON.stringify({ ok: true, data: { textEN: en, textES: es } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
import { requireRole } from '@/lib/auth';
