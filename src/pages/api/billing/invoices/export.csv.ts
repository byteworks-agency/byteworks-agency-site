import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const auth = await requireRole(cookies, ['admin', 'staff']);
  if (!auth.ok) return new Response('forbidden', { status: 403 });

  const status = (url.searchParams.get('status') || 'all');
  const q = (url.searchParams.get('q') || '').trim();
  const where: any = {};
  if (status && status !== 'all') where.status = status as any;
  if (q) {
    where.OR = [
      { id: { contains: q, mode: 'insensitive' as any } },
      { number: { contains: q, mode: 'insensitive' as any } },
      { billToName: { contains: q, mode: 'insensitive' as any } },
    ];
  }

  const rows = await prisma.invoice.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      number: true,
      status: true,
      currency: true,
      subtotal: true,
      taxes: true,
      total: true,
      balance: true,
      updatedAt: true,
      billToName: true,
    },
  });

  const header = ['id','number','status','currency','subtotal','taxes','total','balance','updatedAt','billToName'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const vals = [
      r.id,
      r.number || '',
      r.status,
      r.currency,
      r.subtotal.toString(),
      r.taxes.toString(),
      r.total.toString(),
      r.balance.toString(),
      r.updatedAt.toISOString(),
      r.billToName || '',
    ].map((v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    });
    lines.push(vals.join(','));
  }

  const csv = lines.join('\n');
  const fileName = `invoices_export_${Date.now()}.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Cache-Control': 'no-store',
    },
  });
};
