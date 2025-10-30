import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { acceptQuoteBody } from '../../../lib/billing/zod';
import { isQuoteExpired } from '../../../lib/billing/util';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, cookies }) => {
  try {
    const token = url.searchParams.get('token') || undefined;
    const body = await request.json().catch(() => ({}));
    const parse = acceptQuoteBody.safeParse({ ...body, token });
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });

    const { quoteId } = parse.data;
    if (!token) {
      const auth = await requireRole(cookies, ['admin', 'staff']);
      if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    }
    const where = quoteId ? { id: quoteId } : { acceptToken: token! };
    const quote = await prisma.quote.findFirst({
      where,
      select: {
        id: true,
        validUntil: true,
        status: true,
        billToName: true,
        billToEmail: true,
        billToPhone: true,
      },
    });
    if (!quote) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });
    if (isQuoteExpired(quote.validUntil))
      return new Response(JSON.stringify({ ok: false, code: 'quote_expired' }), { status: 400 });

    await prisma.$transaction(async (tx) => {
      await tx.quote.update({ where: { id: quote.id }, data: { status: 'accepted' } });
      const email = (quote.billToEmail || '').trim();
      const phone = (quote.billToPhone || '').replace(/\D+/g, '');
      const name = (quote.billToName || '').trim() || 'Customer';
      // Upsert a contact for future invoices, mark as converted
      if (email) {
        const existing = await tx.contactSubmission.findFirst({ where: { email } });
        if (existing) {
          await tx.contactSubmission.update({ where: { id: existing.id }, data: { name, phone, status: 'converted' } as any });
        } else {
          await tx.contactSubmission.create({ data: { name, email, phone, message: 'Accepted quote', preference: 'whatsapp' as any, status: 'converted' as any } });
        }
      } else if (phone) {
        const existing = await tx.contactSubmission.findFirst({ where: { phone } });
        if (existing) {
          await tx.contactSubmission.update({ where: { id: existing.id }, data: { name, email: '', status: 'converted' } as any });
        } else {
          await tx.contactSubmission.create({ data: { name, email: '', phone, message: 'Accepted quote', preference: 'whatsapp' as any, status: 'converted' as any } });
        }
      }
    });
    return new Response(JSON.stringify({ ok: true, data: { quoteId: quote.id } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
