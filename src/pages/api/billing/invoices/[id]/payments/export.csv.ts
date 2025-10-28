import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireRole(cookies, ['admin', 'staff']);
  if (!auth.ok) return new Response('forbidden', { status: 403 });
  const invoiceId = params.id as string | undefined;
  if (!invoiceId) return new Response('validation_error', { status: 400 });

  const inv = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
  if (!inv) return new Response('invoice_not_found', { status: 404 });
  const header = ['id','method','amount','receivedDate','ref','source','proofUrl','notes'];
  const lines = [header.join(',')];
  for (const p of inv.payments.sort((a,b)=>a.receivedDate.getTime()-b.receivedDate.getTime())) {
    const vals = [
      p.id,
      p.method,
      p.amount.toString(),
      p.receivedDate.toISOString(),
      p.ref,
      p.source || '',
      p.proofUrl || '',
      p.notes || '',
    ].map((v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    });
    lines.push(vals.join(','));
  }
  const csv = lines.join('\n');
  const fileName = `invoice_${invoiceId}_payments.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=${fileName}`,
    },
  });
};
