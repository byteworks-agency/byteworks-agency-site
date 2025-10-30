import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const auth = await requireRole(cookies, ['admin']);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, code: 'forbidden' }), { status: 403 });

    const now = new Date();
    const expired = await prisma.quote.findMany({
      where: {
        validUntil: { lt: now },
        // Consider only quotes not accepted
        NOT: { status: 'accepted' },
      },
      select: { id: true, billToEmail: true, billToPhone: true },
    });

    let deletedQuotes = 0;
    let deletedContacts = 0;
    for (const q of expired) {
      // Best-effort contact cleanup by email/phone match
      const email = (q.billToEmail || '').trim();
      const phone = (q.billToPhone || '').replace(/\D+/g, '');
      if (email) {
        const res = await prisma.contactSubmission.deleteMany({ where: { email } });
        deletedContacts += res.count;
      }
      if (phone) {
        const res = await prisma.contactSubmission.deleteMany({ where: { phone } });
        deletedContacts += res.count;
      }
      await prisma.quote.delete({ where: { id: q.id } });
      deletedQuotes += 1;
    }

    return new Response(
      JSON.stringify({ ok: true, data: { deletedQuotes, deletedContacts } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, code: 'unexpected', message: err?.message }), { status: 500 });
  }
};

