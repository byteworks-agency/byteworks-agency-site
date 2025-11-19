import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { APIRoute } from 'astro';
import { generateAcceptToken } from '../../../lib/billing/ids';
import { isQuoteExpired } from '../../../lib/billing/util';
import { sendQuoteBody } from '../../../lib/billing/zod';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, url }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const parse = sendQuoteBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { quoteId } = parse.data;
    let quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } });
    if (!quote) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });
    if (isQuoteExpired(quote.validUntil)) {
      return new Response(JSON.stringify({ ok: false, code: 'quote_expired' }), { status: 400 });
    }

    // Ensure accept token
    if (!quote.acceptToken) {
      const token = generateAcceptToken();
      await prisma.quote.update({ where: { id: quoteId }, data: { acceptToken: token } });
      quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } })!;
    }

    // Mark as sent and set 30-day validity
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await prisma.quote.update({ where: { id: quoteId }, data: { status: 'sent', sentAt: now, validUntil } });
    // Reload with updated values
    const updatedQuote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } });
    if (!updatedQuote) throw new Error('Quote disappeared');
    quote = updatedQuote;

    const itemsText = quote.items
      .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
      .map((i: any) => `- ${i.description} x ${i.qty.toString()} @ ${i.unitPrice.toString()}`)
      .join('\n');

    const origin = url.origin;
    const acceptUrl = `${origin}/api/quotes/accept?token=${encodeURIComponent(quote.acceptToken!)}`;
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
    const custEN = `Customer: ${quote.billToName || '-'}${quote.billToEmail ? ` | ${quote.billToEmail}` : ''}${quote.billToPhone ? ` | ${quote.billToPhone}` : ''}`;
    const custES = `Cliente: ${quote.billToName || '-'}${quote.billToEmail ? ` | ${quote.billToEmail}` : ''}${quote.billToPhone ? ` | ${quote.billToPhone}` : ''}`;
    const totals = `Subtotal: ${quote.subtotal.toString()} ${quote.currency}\nTaxes: ${quote.taxes.toString()} ${quote.currency}\nTotal: ${quote.total.toString()} ${quote.currency}`;
    const notesEN = `Notes: ${quote.notes || '-'}`;
    const notesES = `Notas: ${quote.notes || '-'}`;
    const validityEN = `Valid until: ${fmtDate(quote.validUntil!)}. After that date, your data will be deleted from our databases.`;
    const validityES = `Valido hasta: ${fmtDate(quote.validUntil!)}. Despues de esa fecha, se eliminaran tus datos de nuestras bases de datos.`;
    const textEN = `Quote ${quote.id}\n${custEN}\n\nItems:\n${itemsText}\n\n${totals}\n${notesEN}\n\n${validityEN}\n\nAccept: ${acceptUrl}`;
    const textES = `Cotizacion ${quote.id}\n${custES}\n\nConceptos:\n${itemsText}\n\n${totals}\n${notesES}\n\n${validityES}\n\nAceptar: ${acceptUrl}`;

    return new Response(JSON.stringify({ ok: true, data: { quoteId, textEN, textES, acceptUrl, validUntil } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};

