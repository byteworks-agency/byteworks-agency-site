import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { sendQuoteBody } from '../../../lib/billing/zod';
import { isQuoteExpired } from '../../../lib/billing/util';
import { requireRole } from '@/lib/auth';
import { generateAcceptToken } from '../../../lib/billing/ids';

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
    if (isQuoteExpired(quote.validUntil))
      return new Response(JSON.stringify({ ok: false, code: 'quote_expired' }), { status: 400 });

    // Ensure accept token
    if (!quote.acceptToken) {
      const token = generateAcceptToken();
      await prisma.quote.update({ where: { id: quoteId }, data: { acceptToken: token } });
      quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } })!;
    }

    await prisma.quote.update({ where: { id: quoteId }, data: { status: 'sent', sentAt: new Date() } });

    const itemsText = quote.items
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .map((i) => `• ${i.description} x ${i.qty.toString()} @ ${i.unitPrice.toString()}`)
      .join('\n');

    const origin = url.origin;
    const acceptUrl = `${origin}/api/quotes/accept?token=${encodeURIComponent(quote.acceptToken!)}`;
    const textEN = `Quote ${quote.id}\nTotal: ${quote.total.toString()} ${quote.currency}\n${itemsText}\n\nAccept: ${acceptUrl}`;
    const textES = `Cotización ${quote.id}\nTotal: ${quote.total.toString()} ${quote.currency}\n${itemsText}\n\nAceptar: ${acceptUrl}`;

    return new Response(JSON.stringify({ ok: true, data: { quoteId, textEN, textES, acceptUrl } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
