import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { declineQuoteBody } from '../../../lib/billing/zod';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin', 'staff']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });
    const body = await request.json().catch(() => ({}));
    const parse = declineQuoteBody.safeParse(body);
    if (!parse.success) return new Response(JSON.stringify({ ok: false, code: 'validation_error' }), { status: 400 });
    const { quoteId } = parse.data;

    const q = await prisma.quote.findUnique({ where: { id: quoteId }, select: { id: true, billToEmail: true, billToPhone: true } });
    if (!q) return new Response(JSON.stringify({ ok: false, code: 'quote_not_found' }), { status: 404 });

    await prisma.$transaction(async (tx) => {
      // Mark declined
      await tx.quote.update({ where: { id: quoteId }, data: { status: 'declined' } });
      // Delete related contact submissions (best-effort by email/phone)
      const email = (q.billToEmail || '').trim();
      const phone = (q.billToPhone || '').replace(/\D+/g, '');
      if (email) await tx.contactSubmission.deleteMany({ where: { email } });
      if (phone) await tx.contactSubmission.deleteMany({ where: { phone } });
      // Delete the quote (cascades delete items)
      await tx.quote.delete({ where: { id: quoteId } });
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};
